const NoteRemoveIcon = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M7 14H12" strokeMiterlimit="10" />
      <path d="M7 5.95996L3.25 2.20996" strokeMiterlimit="10" />
      <path d="M6.96002 2.25L3.21002 6" strokeMiterlimit="10" />
      <path d="M7 10H15" strokeMiterlimit="10" />
      <path d="M10 2H16C19.33 2.18 21 3.41 21 7.99V16" strokeMiterlimit="10" />
      <path
        d="M3 9.01001V15.98C3 19.99 4 22 9 22H12C12.17 22 14.84 22 15 22"
        strokeMiterlimit="10"
      />
      <path d="M21 16L15 22V19C15 17 16 16 18 16H21Z" />
    </svg>
  );
};

export default NoteRemoveIcon;
