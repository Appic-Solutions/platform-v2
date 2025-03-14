export default function HistoryIcon({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="21"
      height="18"
      viewBox="0 0 21 18"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 0C7.03 0 3 4.03 3 9H0L3.89 12.89L3.96 13.03L8 9H5C5 5.13 8.13 2 12 2C15.87 2 19 5.13 19 9C19 12.87 15.87 16 12 16C10.07 16 8.32 15.21 7.06 13.94L5.64 15.36C7.27 16.99 9.51 18 12 18C16.97 18 21 13.97 21 9C21 4.03 16.97 0 12 0ZM11 5V10L15.25 12.52L16.02 11.24L12.5 9.15V5H11Z" />
    </svg>
  );
};