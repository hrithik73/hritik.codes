import type { MDXComponents } from "mdx/types";

// Styled replacements for the HTML elements MDX renders. Server components
// import `mdxComponents` directly; `useMDXComponents` is the hook @next/mdx
// looks for by convention.
export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="font-display text-3xl text-ink mt-8 mb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-display text-2xl text-ink mt-8 mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display text-xl text-ink mt-6 mb-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-base text-ink/90 mb-4 leading-[1.75]">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-ink underline decoration-accent decoration-[1.5px] underline-offset-[3px] hover:decoration-primary transition-[text-decoration-color]"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 mb-4 marker:text-muted text-ink/90 space-y-2">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 mb-4 marker:text-muted text-ink/90 space-y-2">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 leading-[1.75] [&>p]:mb-2">{children}</li>
  ),
  code: ({ children, className, ...props }) => {
    const isInlineCode = !className;

    if (isInlineCode) {
      return (
        <code
          className="text-ink bg-surface px-1.5 py-0.5 rounded text-sm"
          {...props}
        >
          {children}
        </code>
      );
    }

    // For code blocks, preserve all props - rehype-pretty-code adds inline styles
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, className, ...props }) => {
    // Preserve rehype-pretty-code classes and add our own
    const classes = className
      ? `mb-4 rounded-lg overflow-x-auto ${className}`
      : "mb-4 rounded-lg overflow-x-auto";
    return (
      <pre className={classes} {...props}>
        {children}
      </pre>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="bg-surface rounded-lg px-5 py-1 italic text-muted my-4">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-line" />,
  table: ({ children }) => (
    <div className="mb-6 overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-surface border-b border-line">{children}</thead>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-line last:border-b-0">{children}</tr>
  ),
  th: ({ children, style }) => (
    <th
      style={style}
      className="px-3 py-2 text-left font-semibold text-ink whitespace-nowrap"
    >
      {children}
    </th>
  ),
  td: ({ children, style }) => (
    <td
      style={style}
      className="px-3 py-2 align-top text-ink/90 leading-relaxed"
    >
      {children}
    </td>
  ),
};

export function useMDXComponents(
  components: MDXComponents = {},
): MDXComponents {
  return { ...mdxComponents, ...components };
}
