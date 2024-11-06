const TokenPlaceHolderIcon = ({
  className,
  width,
  height,
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width || "70"}
      height={height || "70"}
      viewBox="0 0 70 69"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="34.5"
        cy="34.5"
        r="22.5"
        strokeWidth="0"
        className={className || "fill-[#333333]"}
      />
      <circle
        cx="49"
        cy="50"
        r="9.25"
        className={className || "fill-[#333333]"}
        stroke={props.stroke || "#333333"}
        strokeWidth="2.5"
      />
    </svg>
  );
};

export default TokenPlaceHolderIcon;
