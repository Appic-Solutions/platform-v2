const TransformDataHorizontalIcon = ({
  className,
  width,
  height,
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width || "19"}
      height={height || "21"}
      className={className}
      viewBox="0 0 19 21"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17.3477 13.875L14.083 17.1396M17.3477 13.875L14.083 10.6104M17.3477 13.875L7.1457 13.875"
        className={className || "stroke-slate-500"}
        strokeWidth="1.22423"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.02344 5.91799L4.28806 9.18262M1.02344 5.91799L4.28806 2.65336M1.02344 5.91799L11.2254 5.91799"
        className={className || "stroke-slate-500"}
        strokeWidth="1.22423"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TransformDataHorizontalIcon;
