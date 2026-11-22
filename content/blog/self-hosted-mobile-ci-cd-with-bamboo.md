---
title: Building our own mobile CI/CD on a Mac with Bamboo
date: 2026/11/22
description: How we ship our React Native app to testers and the app stores from one Mac in the office. How the pieces fit together, where the secrets live, and what it really costs compared with hosted CI.
tag: react-native,expo,ci-cd,fastlane,bamboo,devops
author: Hritik Singh
---

Most guides to mobile CI start with "sign up for a hosted service". That's usually good advice, but it wasn't an option for us. The company already ran Atlassian Bamboo, iOS apps can only be built on a Mac, and paying for hosted Mac time adds up quickly when you ship a few builds a day for both iOS and Android.

So we built our own. One Mac in the office does all the builds. A separate git repo holds the build scripts, and every password, key and certificate sits in an encrypted store. When developers want a build, they run one command on their laptop. About 15 minutes later, a Slack message says the build is on TestFlight.

This post covers how it fits together, what tripped us up along the way, and whether it actually saves money. The names, URLs and IDs are placeholders, but the setup is the one we really run.

## The big picture

Here's what happens between typing the command and getting the Slack message:

```
 Your laptop                    Bamboo                    The Mac
 ───────────                    ──────                    ───────
 npm run deploy
   ├─ choose a version
   ├─ write a changelog
   └─ push a "BUILD:" commit ──► notices the commit ────► 1. Install
                                                             get the code and secrets,
                                                             install dependencies
                                                          2. Build iOS and Android
                                                             at the same time
                                                          3. Clean up
                                                          4. Post to Slack
```

The system has three parts:

1. **The app repo** holds the React Native app and a small script that starts a build.
2. **The tools repo** holds the build scripts. That means our fastlane setup (fastlane is a popular tool for automating iOS and Android builds and uploads) and the shell scripts Bamboo runs. There's no app code in it.
3. **The vault** is an encrypted git branch that holds every secret: settings files, API keys and signing certificates.

Bamboo itself does very little. Each step in Bamboo just runs one function from the tools repo. All the real logic lives in git, so changes to the build go through code review and can be rolled back like any other change.

## Why the build scripts have their own repo

At first, the build scripts lived inside the app repo. That caused two problems.

The first was that fixing the build was tied to app branches. If the upload step broke, the fix had to be merged into whichever feature branch someone was trying to build at the time.

The second was that secrets sat too close to the app code. The build needs credentials, and with secret folders in the same project as the app, it was far too easy to commit something by accident.

Now Bamboo checks out two repos for every build: the app, on whichever branch started the build, and the tools repo, usually on `main`. The tools repo only needs to know where the app is. On a laptop the two repos sit next to each other, so it finds the app without any help. On the build machine, the scripts set one environment variable that points to the app's folder.

## The build machine

The Mac has very little installed on it:

- Xcode and its command line tools
- Node, Ruby, Java 17, ccache (a compiler cache, more on that later) and the AWS command line tool, all installed with Homebrew
- Expo's command line tool, for over-the-air updates
- the Bamboo agent, which is the program that picks up jobs from the Bamboo server. It runs as a normal user that logs in automatically, so the Mac's keychain can be unlocked for code signing.

Nothing about our project is set up on the machine by hand. If the Mac dies, we can set up a new one from a short checklist.

## The version number decides what gets built

This is my favourite part of the setup. Nobody picks "staging" or "release" from a menu in Bamboo. Instead, the version number in the app's `package.json` carries that information after a `+` sign:

```
2.3.0+staging          → staging, over-the-air update only
2.3.0+staging.hard     → staging, full native build
2.3.0+release.hard     → production, native build and store upload
```

It helps to know the two kinds of build:

- A **soft** build is an over-the-air (OTA) update. It sends new JavaScript to apps people already have installed, without going through the App Store or Play Store. It's quick and cheap.
- A **hard** build is a full native build. It produces a new app file (an IPA for iOS, an APK or AAB for Android) that people have to install or download from the store. You need one whenever native code changes.

Before anything else runs, fastlane reads the version, works out the mode (testing, staging or release) and whether it's a hard or soft build, and loads the right settings for that mode. This is the part that reads the version:

```ruby
def load_version
  version = JSON.parse(File.read(@root_path.join('package.json')))['version']
  flags   = version.split('+')[1].to_s.split('.')

  ENV['MODE'] = flags.find { |f| f.match?(/^(testing|staging|release)$/) }
  ENV['IPA_DEPLOYMENT'] = ENV['APK_DEPLOYMENT'] = flags.include?('hard') ? 'hard' : 'soft'
end
```

So going from a staging update to a production release doesn't mean touching any CI settings. You change one string, and the change is right there in the commit history. A small settings file in the app repo adds a few rules on top, such as "release builds always include a native build".

## Starting a build from your laptop

Running `npm run deploy` in the app repo starts a short interactive script. It:

1. Asks which mode you want and whether you need a native build.
2. Looks up the version that's currently live for that mode and suggests the next one.
3. Opens an editor so you can write a changelog. This appears in the Slack message and in the app's "what's new" history.
4. Commits with a message like `BUILD: 2.3.0+staging.hard` and pushes it.
5. For release builds, also adds a git tag so we can go back to that exact version later.

On the Bamboo side, the plan ignores any commit that doesn't start with `BUILD:`. (Bamboo calls this setting "exclude changesets", and it takes a regular expression.) So ordinary pushes to feature branches never start a build. If you want a build, you ask for one. Release builds can also be started by hand from Bamboo.

### The first-build surprise

Bamboo creates a "plan branch" for every new git branch it sees, and it always runs the first build on that branch, even when the commit should have been ignored. So every new feature branch was starting a full iOS and Android build that nobody asked for.

The fix is a small check that runs at the very start of every build:

| Situation                                     | Result |
| --------------------------------------------- | ------ |
| Someone started it by hand in Bamboo          | build  |
| It isn't the branch's first build             | build  |
| First build, and the latest commit is `BUILD:` | build  |
| First build, anything else                    | skip   |

When the check decides to skip, it asks Bamboo to stop the build and leaves a note for the later steps. If Bamboo doesn't stop in time, each later step sees the note and does nothing, so the build ends green without building anything.

## Where the secrets live

We had one rule: **no secrets in either repo, and as few as possible in Bamboo.**

### Bamboo only holds the key to the vault

Bamboo hides the value of any variable whose name includes "secret" or "password", both on its settings screens and in build logs. We keep only a few things there:

- the address, branch and password for the vault
- the token for installing our private npm packages
- a few tokens that are needed before the vault is opened (Expo, Sentry and Slack)

If the Bamboo variables aren't there, the scripts fall back to ordinary environment variables, so the same scripts also work on a laptop.

### Everything else is in the vault

All the other secrets (the settings for each mode, AWS keys, Play Store and App Store Connect credentials, and the key that signs OTA updates) live in a `secrets/` folder in the tools repo. Git ignores that folder, so it can't be committed. Instead, a fastlane plugin called [cryptex](https://github.com/hjanuschka/fastlane-plugin-cryptex) encrypts the folder and stores it on a separate git branch. Two commands move it back and forth:

```bash
bundle exec fastlane pull_vault   # download and decrypt into secrets/
bundle exec fastlane init_vault   # encrypt secrets/ and upload it
```

We patched cryptex to use a stronger way of turning the password into an encryption key (PBKDF2, instead of the plugin's single round of hashing). Machines with the old code could still read the old format, so we waited until every machine had the patch before re-encrypting.

### iOS signing certificates

Apple's signing certificates and provisioning profiles are handled by fastlane's `match` tool, which keeps them encrypted in git on their own branch. Before each build, the scripts create a temporary keychain and unlock it. Without that, macOS would pop up a password prompt in the middle of the build, and on a machine nobody is watching, the build would just sit there waiting.

### Settings that aren't secret

App names, team IDs, storage bucket names, CDN addresses and Slack channel IDs aren't secrets, but they used to be copied into a dozen different scripts. Now they live in one settings file that both the shell scripts and fastlane read. A comment at the top of the file spells out the rule: **new settings go here, secrets never do.**

### A list of every secret

We also keep a document listing every secret, where it's stored, and what else has to change when it's replaced. Some secrets depend on each other. For example, the key that signs OTA updates has to match a certificate built into the app itself. You'll be glad you wrote this down the first time a key expires at 6pm on a Friday.

## The Bamboo plan

A Bamboo plan is split into stages, and each stage has one or more jobs. Ours has three stages, and every job is the same two lines: load the main script from the tools repo, then call one function.

```bash
source "${bamboo_build_working_directory}/tools/scripts/deploy.sh"
TaskInstall        # or TaskDeployIOS, TaskDeployAndroid, TaskClean
```

### Stage 1: Install

This job gets everything ready. It downloads the app code, runs the first-build check from earlier, decrypts the vault, installs the npm packages, and generates the native iOS and Android projects with Expo.

Two checks in this job have saved us a lot of time:

- **It tests the AWS keys straight away** by uploading a small test file to the storage bucket and then deleting it. Before we added this, a replaced AWS key would only fail at the very end, after 20 minutes of building. Now it fails in the first minute. The test writes a file instead of just reading one, because a key can be allowed to read a bucket without being allowed to write to it.
- **Release builds can only come from certain branches.** If someone starts a release build from any other branch, the job fails and posts a red alert in Slack. That way a release can't slip out of a feature branch by mistake.

### Stage 2: Build and ship (iOS and Android at the same time)

Both platforms follow the same steps:

1. Update the changelog history.
2. For a soft build, publish the OTA update to the right channel.
3. For a hard build, build the app and upload it. iOS goes to TestFlight. Android goes to S3 or the Play Store.
4. Upload a small file that the app checks to see whether a new version is out and whether users must update.
5. Upload source maps, so crash reports point at real lines of code.
6. Clear the CDN cache and send the Slack message.

Since both jobs run in the same folder at the same time, they can't share anything that one of them might delete. That's how Metro's cache caught us out. (Metro is the tool that bundles the app's JavaScript.) Each build cleared the cache when it started, which wiped the other build's cache halfway through. The fix was to give Android its own cache folder:

```bash
export EXPO_METRO_CACHE_OUTPUT_DIR="$FASTLANE_ROOT_PATH/android/.metro-cache"
```

### Stage 3: Clean up

This deletes the app and tools code from the machine. The caches are stored somewhere else, so they're kept for the next build.

## Making one Mac fast

Hosted CI gives you a fresh machine for every build, so each build starts from nothing. On your own machine, you can keep work from one build to the next:

- **Cache compiled native code.** ccache remembers compiled C, C++ and Objective-C files, so files that haven't changed don't get compiled again. React Native's Xcode setup already supports it. Keep the cache in a fixed folder, and clear out old entries now and then:

  ```bash
  export CCACHE_DIR="$HOME/Library/Caches/ccache"
  export CCACHE_BASEDIR="$HOME/ci/working-dir"
  export CCACHE_NOHASHDIR=true
  export CCACHE_MAXSIZE=20G
  ccache --evict-older-than 21d
  ```

  The `CCACHE_BASEDIR` line lets builds share the cache even though each one checks the code out into a different folder.

- **Keep Ruby gems between builds.** Tell Bundler (Ruby's package installer) to store gems in a folder outside the checkout, so they aren't downloaded again every time. One catch: if the project has a committed Bundler settings file that says something different, Bundler follows that file over your environment variables. Pointing `BUNDLE_APP_CONFIG` at another folder makes Bundler ignore it.
- **Bundle the JavaScript while Xcode compiles.** A small script starts bundling the JavaScript in the background just before the iOS build begins, so the two happen at once instead of one after the other.
- **Upload to TestFlight with the App Store Connect API.** The older upload tool (`altool`) first runs a slow check for duplicate build numbers. Switching to the API saved more than a minute on every upload.

One more thing: set `GIT_PAGER=cat` and `CI=true` on the machine. fastlane runs some git commands as if a person were at the keyboard. Without these settings, git opens its pager and waits for someone to press a key. Nobody ever does, so the build hangs.

## Letting people know

The last step posts a Slack message with the version, mode, branch and commit, how the app's size compares with the live version, the changelog, and the commits since the last release. The code that builds this message has its own tests, because it's the part people actually read.

On iOS there's a catch: "uploaded" doesn't mean "ready to test". Apple spends several minutes processing each build after it's uploaded. So instead of posting straight away, the build starts a small watcher in the background. It keeps checking with App Store Connect and posts once Apple is done, with an **Open in TestFlight** button. If Apple rejects the build, it posts that too, along with Apple's reason.

## Releasing to users

Production builds don't go live the moment they finish. Native builds are uploaded to a holding area in S3, and OTA updates go to a holding branch that no users are connected to. QA tests from there.

When QA is happy, someone runs a separate Bamboo plan by hand. It:

1. Moves the release files from the holding area to the live location.
2. Republishes the OTA update to the live branch and empties the holding branch.
3. Clears the CDN cache so users get the new files.

Building a release and making it live are separate steps, and the second one always needs a person to press the button.

## What it costs

Saving money is the main reason people self-host, so here are real numbers.

**How often we build.** I counted the `BUILD:` commits in the app repo. Over the last six months we averaged about 37 builds a month. A busy release month goes past 50, and almost all of those are full native builds.

**How long a build takes**, measured from Bamboo's logs for a native build on the Mac with its caches warm:

| Step     | Time    | Where the time goes                                                  |
| -------- | ------- | -------------------------------------------------------------------- |
| Install  | ~1 min  | Installing npm packages, decrypting the vault                        |
| Android  | ~6 min  | Building the app (~5.5 min), uploading to S3                         |
| iOS      | ~13 min | Setting up the project (~1.3 min), building (~7 min), uploading (~3.5 min) |
| Clean up | &lt;1 min |                                                                    |

iOS and Android build at the same time, so a native build takes about **15 minutes** from push to TestFlight. Release builds take a little longer, because iOS gets built twice: once for the App Store and once for direct installs.

**Monthly cost at 50 native builds**, compared with hosted services:

| Option                      | How it's priced                                              | Per month              |
| --------------------------- | ------------------------------------------------------------ | ---------------------- |
| **Our own Mac**             | A Mac mini ($600–1,400) spread over 3 years, plus electricity | **$20–45**             |
| GitHub Actions, hosted Mac  | $0.062 a minute, about 30 minutes a build without our caches  | ~$95                   |
| EAS Build, large machines   | $4 per iOS build plus $2 per Android build                   | ~$300, minus plan credit |

How I got these numbers:

- **Electricity barely registers.** A Mac mini uses a few watts when idle and well under 100 W while building. Running it all month costs a few dollars.
- **I assumed hosted builds take twice as long.** A fresh hosted machine starts without any of our caches. If your hosted builds are quicker than that, the gap is smaller. Building Android on a cheaper Linux machine would also bring the cost down.
- **Hosted prices change.** Check the current [GitHub Actions pricing](https://docs.github.com/en/billing/reference/actions-runner-pricing) and [EAS pricing](https://expo.dev/pricing) before relying on these numbers.
- **Bamboo didn't cost anything extra.** The company already paid for Bamboo Data Center, and the Mac is just one more agent. If you're starting fresh, I wouldn't pick Bamboo today, because Atlassian is [ending Data Center support in March 2029](https://www.atlassian.com/licensing/bamboo). But nothing else here depends on Bamboo. Every job just runs one function from a script, so moving to GitHub Actions or Buildkite on the same Mac would mostly mean rewriting a few lines of job settings.
- **OTA updates aren't included.** We still use EAS Update for those, and it's priced separately, based on monthly active users.

**What the table leaves out is your time.** Someone has to install Xcode updates, renew certificates, free up disk space and restart the agent when it gets stuck. For us that's a few hours a month, and that time alone is worth more than the difference from GitHub Actions.

So the real win isn't a smaller bill. It's **15-minute native builds** thanks to warm caches, never having to think about what a build costs before pushing, and being able to log into the machine to see what went wrong. If you only ship a couple of builds a month, a hosted service is probably the better choice.

## If you're building one yourself

- **Keep your CI tool thin.** Each job should just call a script from a repo. Then your build setup gets code review, history and rollback like the rest of your code.
- **Decide what to build in the commit, not in the CI settings.** A version number with a few flags is easy to read and easy to look back on.
- **Check credentials first.** Test every outside service in the first minute, not at the end of a 20-minute build.
- **Keep secrets in one place, and write down where they are.** A folder git ignores, synced to an encrypted vault, plus a list of what to change when each secret is replaced.
- **Give yourself off switches.** We have settings to skip iOS, skip Android, turn off Slack messages and allow duplicate OTA updates. Each one exists because we needed it during an outage.
- **Count your builds before you decide.** Running your own Mac pays off at dozens of native builds a month. At a handful, the upkeep costs more than a hosted service.
- **Expect odd problems that only happen in CI.** Git waiting for a keypress, two builds sharing a cache, Bamboo's surprise first build, keychain prompts on a Mac nobody is watching. Each one cost us an afternoon. Leave a comment next to every workaround explaining why it's there.

It's more work than a hosted service. But native builds now take about 15 minutes, the Mac costs $20–45 a month, the whole system lives in git, and when something breaks you can log into the machine and see exactly what happened.
