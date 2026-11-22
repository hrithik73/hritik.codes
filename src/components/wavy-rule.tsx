/* Wavy hand-drawn divider — the one organic gesture on a page */
export function WavyRule() {
  return (
    <svg
      viewBox="0 0 200 8"
      className="w-32 h-2 text-line mt-14 mb-10"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 4 C 20 1, 36 7, 56 4 S 92 1, 112 5 S 156 2, 176 5 S 194 4, 198 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
