const ChevronDownIcon = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 15 8"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        d="M1.74984 1.08317L7.58317 6.9165L13.4165 1.08317"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ChevronDownIcon;
