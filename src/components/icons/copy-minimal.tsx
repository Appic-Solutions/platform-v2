export default function CopyMinimalIcon({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.4751 15.0001H5.90001C5.61005 15.0001 5.375 14.7651 5.375 14.4751V5.90001C5.375 5.61005 5.61005 5.375 5.90001 5.375H14.4751C14.7651 5.375 15.0001 5.61005 15.0001 5.90001V14.4751C15.0001 14.7651 14.7651 15.0001 14.4751 15.0001Z"
        stroke="currentColor"
        strokeWidth="1.575"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6251 5.37506V1.52501C10.6251 1.23505 10.3901 1 10.1001 1H1.52501C1.23505 1 1 1.23505 1 1.52501V10.1001C1 10.3901 1.23505 10.6251 1.52501 10.6251H5.37506"
        stroke="currentColor"
        strokeWidth="1.575"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
