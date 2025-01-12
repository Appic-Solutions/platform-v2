const CloseIcon = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      width={24}
      height={24}
      {...props}
    >
      {/* circle */}
      {/* <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" /> */}
      <path d="M9.16998 14.83L14.83 9.17004" />
      <path d="M14.83 14.83L9.16998 9.17004" />
    </svg>
  );
};

export default CloseIcon;
