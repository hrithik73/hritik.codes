import type { MDXComponents } from "mdx/types";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export function useMDXComponents(
  components: MDXComponents = {},
): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
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
      <ul className="list-disc list-inside mb-4 text-ink/90 space-y-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 text-ink/90 space-y-2">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="ml-4 leading-[1.75]">{children}</li>,
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
    ...components,
  };
}
