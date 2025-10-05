export function Logo() {
  return (
    <div className="flex gap-2 items-center">
      <svg
        width="32"
        height="32"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Better Modal Logo</title>
        <rect width="50" height="50" rx="4" fill="black" />
        <rect x="4" y="10" width="40" height="6" rx="2" fill="white" />
        <rect x="4" y="19" width="25" height="6" rx="2" fill="white" />
      </svg>
      <p className="font-bold leading-tight select-none">BETTER-MODAL</p>
    </div>
  );
}
