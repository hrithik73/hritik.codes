---
title: Building our own mobile CI/CD on a Mac with Bamboo
date: 2026/11/22
description: How we ship a React Native (Expo) app to TestFlight, S3 and OTA updates from a self-hosted Mac running Bamboo, with fastlane in a separate tools repo, an encrypted secrets vault, and a version string that decides what gets built.
tag: react-native,expo,ci-cd,fastlane,bamboo,devops
author: Hritik Singh
---

Most mobile CI guides start with "sign up for a hosted CI". That's a good default, but it isn't always an option. Our company already ran Atlassian Bamboo, iOS builds need macOS, and hosted macOS minutes get expensive once you're shipping a few builds a day for two platforms.

So we built our own: one Mac in the office running a Bamboo agent, a separate repo of fastlane lanes and shell scripts, and an encrypted vault for every key and certificate. A developer runs one command on their laptop, and a few minutes later Slack says the build is on TestFlight.

This post walks through how it fits together. All names, URLs and IDs below are placeholders, but the structure is what we actually run.

## The big picture

```
 developer laptop                    Bamboo server              Mac build agent
 ────────────────                    ─────────────              ───────────────
 npm run deploy                                                  
   ├─ pick version + changelog                                   
   ├─ commit "BUILD: 2.3.0+staging"                              
   └─ git push  ───────────────────►  plan branch detects  ────► Install job
                                      the commit                  ├─ clone app + tools
                                                                  ├─ pull encrypted vault
                                                                  ├─ npm ci, expo prebuild
                                                                  ▼
                                                                Deploy stage (parallel)
                                                                  ├─ iOS  → fastlane ios deploy
                                                                  └─ Android → fastlane android deploy
                                                                  ▼
                                                                Clean job
                                                                  └─ delete checkouts
                                                                  ▼
                                                                Slack: "build ready"
```

There are three pieces:

1. **The app repo.** The React Native app, plus a small `deploy` script that bumps the version and pushes a build commit.
2. **The tools repo.** fastlane lanes, the Bamboo entry-point scripts, and shared non-secret config. No app code.
3. **The vault.** An encrypted branch holding every `.env` file, API key and signing certificate.

Bamboo itself does very little. Every job is a single "Script" task that sources a shell file from the tools repo and calls one function. All the logic lives in git, where it can be reviewed and rolled back like any other code.

## Why a separate tools repo?

Our first version kept fastlane inside the app repo. Over time that caused two problems:

- **CI changes were tied to app branches.** Fixing a broken upload step meant merging into whatever feature branch someone was trying to build.
- **Secrets drifted too close to the app.** Lanes need credentials, and having `secrets/` folders and fastlane config in the same tree as app code made it far too easy to commit something you shouldn't.

Now the Bamboo plan has two linked repositories: the app repo (on whatever branch triggered the build) and the tools repo (usually `main`). The tools repo finds the app through one environment variable:

```ruby
# fastlane/fastfile.rb
@root_path = Pathname.new(
  ENV['FASTLANE_ROOT_PATH'] || File.expand_path('../../../my-mobile-app', __FILE__)
)
@keys_path = Pathname.new(File.expand_path('../../secrets', __FILE__))
```

On a laptop the two repos sit side by side and the default path just works. On CI, the scripts clone the app into `<working-dir>/mobile` and set `FASTLANE_ROOT_PATH` to that path.

## The build machine

The agent is a Mac with:

- Xcode, plus the command line tools
- Homebrew: Node, Ruby (pinned with `.ruby-version`), OpenJDK 17, `ccache`, `awscli`
- `eas-cli` for OTA updates
- the Bamboo remote agent, running as a normal user with an auto-login session (so the keychain can be unlocked)

That's all. Nothing project-specific is installed on the machine by hand, so if it dies we can rebuild it from a short checklist.

## The version string decides what gets built

This is the part I like most. Nobody picks "staging" or "release" in a Bamboo dropdown. The `version` in the app's `package.json` carries that information as semver build metadata:

```
2.3.0+staging          → staging build, OTA update only
2.3.0+staging.hard     → staging build, full native build
2.3.0+release.hard     → production, native build + store upload
```

A `before_all` hook in fastlane parses the version and sets the mode for everything that runs after it:

```ruby
def load_version
  version = JSON.parse(File.read(@root_path.join('package.json')))['version']
  flags   = version.split('+')[1].to_s.split('.')

  ENV['MODE'] = flags.find { |f| f.match?(/^(testing|staging|release)$/) }

  if flags.include?('hard')
    ENV['IPA_DEPLOYMENT'] = ENV['APK_DEPLOYMENT'] = 'hard'  # native build
  else
    ENV['IPA_DEPLOYMENT'] = ENV['APK_DEPLOYMENT'] = 'soft'  # OTA only
  end
end
```

Then it loads config for that mode. Dotenv doesn't overwrite variables that are already set, so the first file in the list wins:

```ruby
before_all do
  load_version
  Dir.chdir(@keys_path) do
    Dotenv.load(".env.app.#{ENV['MODE']}", ".env.app", ".env")
  end
  Dotenv.load(File.expand_path('../config/constants.env', __dir__))
end
```

So switching from a staging OTA to a production native build doesn't mean editing CI config. You change one string, and that change shows up in the commit history.

A small `deploy.json` in the app repo covers the rest, such as "release builds must always include a native build".

## Triggering a build from a laptop

`npm run deploy` in the app repo is a small Node CLI. It:

1. Asks which mode and whether you need a native build.
2. Fetches the currently live version for that mode and suggests the next one.
3. Opens an editor for the changelog, which ends up in the Slack message and in the in-app "what's new" history file.
4. Commits with a fixed subject and pushes:

```
BUILD: 2.3.0+staging.hard
```

5. For release builds, also creates a git tag so we can roll back to it later.

On the Bamboo side, the plan's repository has an **exclude changesets** regex. Any commit that doesn't match the `BUILD:` pattern is ignored, so only build commits start a build:

```
^(?!BUILD:\s[0-9\.\+\w]+staging).*$
```

Normal pushes to feature branches don't start a build. When you actually want one, you run a single command. Release builds can still be started by hand from the Bamboo UI.

### The plan-branch gotcha

Bamboo auto-creates a plan branch for every new git branch, and it **always runs build #1 of that branch while ignoring the exclude regex**. Every new feature branch was starting a full iOS and Android build.

The fix is a small guard script that runs first in the Install job:

| Situation                                  | Result |
| ------------------------------------------ | ------ |
| Manually triggered from the Bamboo UI      | build  |
| Not build #1                               | build  |
| Build #1, HEAD is a `BUILD: …` commit      | build  |
| Build #1, anything else                    | skip   |

On a skip, it asks Bamboo's REST API to stop the job, and it writes `BUILD_GUARD_SKIP=true` to a shared file that the later jobs read. If the stop call doesn't take effect, every later task still returns early, and the build finishes green having done nothing.

## Secrets: what lives where

The goal was simple: **no secret in either repo, and as few secrets in Bamboo as possible.**

### Bamboo holds just enough to open the vault

Bamboo plan variables whose names contain `secret` or `password` are masked in the UI and in build logs. We store only a handful there:

- the vault git URL, branch and password
- the npm token for private packages
- a few tokens that jobs need before the vault is opened (Expo, Sentry, Slack)

`deploy.sh` maps them to normal names once, at the top:

```bash
export VAULT_PASSWORD="${bamboo_VAULT_PASSWORD:-${VAULT_PASSWORD:-}}"
export VAULT_GIT_URL="${bamboo_VAULT_GIT_URL:-${VAULT_GIT_URL:-}}"
export EXPO_TOKEN="${bamboo_EXPO_SECRET:-${EXPO_TOKEN:-}}"
```

The `${bamboo_X:-${X:-}}` fallback means the same script runs on a laptop with plain env vars.

### Everything else is in an encrypted vault

The rest (per-mode `.env` files, AWS keys, the Play Store service account, the App Store Connect API key, the OTA signing key) lives in a `secrets/` folder that is **gitignored** in the tools repo. It is synced to and from an encrypted branch with the [cryptex](https://github.com/hjanuschka/fastlane-plugin-cryptex) fastlane plugin:

```bash
bundle exec fastlane pull_vault   # decrypt the vault branch into secrets/
bundle exec fastlane init_vault   # encrypt secrets/ and push it to the vault branch
```

We patched cryptex to derive its key with PBKDF2 instead of the plugin's default single-pass hash. Hosts running the old code can still read the old vault format, so we only re-encrypted once every machine had the patch.

### iOS signing goes through match

Certificates and provisioning profiles are handled by fastlane `match`, in the same encrypted git storage on a separate branch. Before building, CI creates a temporary keychain and unlocks it, so `codesign` never shows a GUI prompt on a headless agent:

```ruby
lane :create_match_keychain do
  create_keychain(
    name: ENV['MATCH_KEYCHAIN_NAME'],
    password: ENV['MATCH_KEYCHAIN_PASSWORD'],
    default_keychain: true,
    unlock: true,
    timeout: 3600
  )
end
```

### Non-secret config goes in `constants.env`

App names, scheme names, team IDs, bucket names, CDN hosts and Slack channel IDs aren't secrets, but they used to be hardcoded across a dozen scripts. Now they all live in one `config/constants.env` that both the shell scripts and fastlane load. The rule is written at the top of the file: **new hardcoded values go here, secrets never do.**

### A rotation map

We also keep a doc that lists every secret, where it's stored, and what else has to change when it's rotated. For example, the OTA signing key has to match a certificate that ships inside the native app. You'll be glad you wrote this down the first time a key expires at 6pm on a Friday.

## The Bamboo plan

The plan has three stages. Each job is one Script task:

```bash
source "${bamboo_build_working_directory}/tools/scripts/deploy.sh"
TaskInstall        # or TaskDeployIOS / TaskDeployAndroid / TaskClean
```

### Stage 1: Install

```bash
function TaskInstall() {
  TaskSetupEnvironment          # paths, written to a .common file for later jobs
  TaskClone                     # shallow-clone the app at the triggering branch
  TaskBuildGuard || return 0    # skip the build Bamboo forces on new plan branches
  ValidateReleaseBranch         # release builds only from allowed branches

  cd "$FASTLANE_TOOLS_PATH"
  bundle install
  bundle exec fastlane pull_vault             || exit 1
  bundle exec fastlane verify_aws_credentials || exit 1

  cd "$FASTLANE_ROOT_PATH"
  echo "//registry.npmjs.org/:_authToken=${NPM_SECRET}" >> .npmrc
  npm ci
  npm run prebuild cicd android
}
```

Two things here saved us a lot of time:

- **`verify_aws_credentials` writes a test object to the bucket and deletes it.** Before this check, a rotated AWS key failed the S3 upload after a 20-minute build. Now it fails in the first minute. It does a write, not a read, because a key can be allowed to read a bucket it can't write to.
- **Release builds are only allowed from specific branches.** A `+release` version on any other branch fails the job and posts a red Slack alert, so a release can't come from a feature branch by accident.

### Stage 2: Deploy (iOS and Android in parallel)

Both platforms go through the same fastlane steps:

```
update_history → deploy_soft (OTA) → build + deploy_hard (native)
              → upload_version → upload_sourcemap → invalidate CDN → notify
```

- **Soft** runs `eas update` to publish a signed OTA bundle to the channel for that mode.
- **Hard** builds with `gym` / Gradle, uploads the IPA to TestFlight and the APK/AAB to S3 or the Play Store, then writes a small `<mode>-<platform>.json` that the app checks to see whether a forced update is available.

Both jobs run in the same checkout at the same time, so they can't share anything that gets wiped. The one that bit us was Metro's cache: each bundle's `--reset-cache` deleted the other job's cache halfway through its build. Android now gets its own cache directory:

```bash
export EXPO_METRO_CACHE_OUTPUT_DIR="$FASTLANE_ROOT_PATH/android/.metro-cache"
```

### Stage 3: Clean

Deletes the app and tools checkouts. Caches stay outside the working directory, so they survive.

## Making a single Mac fast

With hosted CI, every build starts on a fresh machine. On your own hardware, you can keep caches between builds:

- **ccache** for native C/C++/Obj-C. React Native's Xcode integration already supports it. Point the cache at a stable directory, set `CCACHE_BASEDIR` so absolute paths from different checkout folders still hit the cache, and evict old entries now and then:

  ```bash
  export CCACHE_DIR="$HOME/Library/Caches/ccache"
  export CCACHE_BASEDIR="$HOME/ci/working-dir"
  export CCACHE_NOHASHDIR=true
  export CCACHE_MAXSIZE=20G
  ccache --evict-older-than 21d
  ```

- **Bundler gems outside the checkout.** Set `BUNDLE_PATH` to a directory in `~/.cache`. Watch out for a tracked `.bundle/config` with `path: vendor/bundle`, because Bundler ranks that file above env vars. Set `BUNDLE_APP_CONFIG` to another directory so Bundler skips the file. Clear the gem cache once it passes a size limit.
- **Bundle JS while Xcode compiles.** A prebundle script starts the Metro bundle in the background right before `gym`, so the JS bundle builds during the native compile instead of after it.
- **Upload to TestFlight through the App Store Connect API** instead of `altool`. The API path skips a slow duplicate-build-number check, which saved over a minute per upload.

Also set `GIT_PAGER=cat` and `CI=true`. fastlane runs git through a PTY, and without the pager override `less` waits for input forever and the agent hangs.

## Telling people about it

The last step builds a Slack Block Kit message with the version, mode, branch, commit, build size compared to the live build, the changelog, and the commits since the last release tag. The message builder is a plain Ruby function with unit tests, because it's the part people actually read.

For iOS, "uploaded" doesn't mean "available in TestFlight". Apple processes builds for several minutes after upload. So `deploy` prepares the message and starts a small detached watcher. The watcher polls App Store Connect and posts once Apple finishes processing, with an **Open in TestFlight** button. If Apple rejects the build, it posts the failure with Apple's reason.

## Promoting a release

Production builds don't go live as soon as they finish. They upload to a `release/` prefix in S3, and OTA updates go to a holding branch that no channel points at. QA tests from there.

A separate Bamboo plan, run by hand, does the promotion:

1. Moves the release JSON and APK from `release/` into the live prefix.
2. Republishes the OTA from the holding branch onto the live branch, then clears the holding branch.
3. Invalidates the CDN.

Shipping a release and making it live are separate steps, and the second one is a button a person has to press.

## What it costs

Most of the pitch for self-hosting is cost, so here are actual numbers.

**How much we build.** I counted `BUILD:` commits in the app repo. Over the last six months we averaged about 37 builds a month. A busy release month hits 50 or more, and almost all of those are native ("hard") builds.

**How long a build takes** on the warm Mac, measured from Bamboo logs for a native build:

| Job       | Time    | Where the time goes                                    |
| --------- | ------- | ------------------------------------------------------ |
| Install   | ~1 min  | npm install, vault decrypt                             |
| Android   | ~6 min  | `assembleRelease` ~5.5 min, S3 uploads                 |
| iOS       | ~13 min | prebuild + pods ~1.3 min, archive ~7 min, upload ~3.5 min |
| Clean     | &lt;1 min |                                                        |

iOS and Android run in parallel, so a native build finishes in about **15 minutes** from push to TestFlight. Release builds archive iOS twice (store and ad-hoc), so they take a bit longer.

**Monthly cost at 50 native builds**, compared with hosted options:

| Option                          | How it's priced                                  | ~Per month         |
| ------------------------------- | ------------------------------------------------ | ------------------ |
| **Self-hosted Mac**             | Mac mini (~$600–1,400) spread over 3 years, plus power | **~$20–45**  |
| GitHub Actions, hosted macOS    | $0.062/min, ~30 min per build with cold caches   | ~$95               |
| EAS Build, large workers        | $4 per iOS build + $2 per Android build          | ~$300, minus plan credit |

Some notes on how I got these:

- **Power is close to nothing.** A Mac mini idles at a few watts and draws well under 100 W while building. Running it all month adds only a few dollars.
- **The hosted estimate assumes builds take twice as long.** A fresh hosted runner starts with no ccache, gem cache or warm DerivedData. If your hosted builds are faster than that, the gap is smaller. Running Android on a Linux runner would bring it down too.
- **Hosted prices change.** Check the current [GitHub Actions runner pricing](https://docs.github.com/en/billing/reference/actions-runner-pricing) and [EAS pricing](https://expo.dev/pricing) before using these numbers.
- **Bamboo cost us nothing extra.** The company already had a Bamboo Data Center license, and the Mac is one more remote agent. If you're starting from scratch, I wouldn't pick Bamboo now. Atlassian has set [Data Center end-of-life for March 2029](https://www.atlassian.com/licensing/bamboo). The rest of this setup doesn't depend on Bamboo, though. Because each job is just "source a script, call a function", moving to GitHub Actions or Buildkite on the same Mac would mostly mean rewriting a few lines of job config.
- **EAS Update isn't in this table.** We still use it for OTA updates, and it's priced separately by monthly active users.

**The cost that isn't in the table is your time.** Someone has to install Xcode updates, renew certificates, clear a full disk and restart a stuck agent. For us that's a few hours a month, which is more than the price difference with GitHub Actions on its own.

So what we actually get for self-hosting isn't mainly a lower bill. It's **15-minute native builds** thanks to warm caches, no per-build cost to think about before pushing, and the ability to SSH in and check what went wrong. If you only ship a couple of builds a month, a hosted service is probably the better choice.

## What I'd tell you if you're building one

- **Keep Bamboo thin.** One script task per job, with all logic in a repo. You get code review, history and rollback for your CI.
- **Encode build intent in the commit, not the CI UI.** A version string with flags is easy to read and easy to audit.
- **Fail fast on credentials.** Check every external dependency in the first minute, not at the end of the build.
- **Put secrets in exactly one place, and document it.** A gitignored folder synced to an encrypted vault, plus a rotation map.
- **Add escape hatches.** We have plan variables like `SKIP_IOS`, `SKIP_ANDROID`, `DISABLE_SLACK_NOTIFICATIONS` and `OTA_KEEP_DUPLICATES`. Each one exists because we needed it during an incident.
- **Count your builds before deciding.** Self-hosting pays off at dozens of native builds a month. At a few a month, the upkeep costs more than a hosted service.
- **Expect CI-specific quirks.** Pagers, shared caches, Bamboo's forced first build, keychains on a headless Mac. Each one cost us an afternoon. Write a comment next to every workaround saying why it's there.

It's more work than a hosted service, but native builds now take about 15 minutes and cost a few dollars a month in hardware, the whole system is in git, and when something breaks you can SSH into the machine and see exactly what happened.
