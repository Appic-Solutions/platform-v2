const TwinTokenIcon = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 17 17"
      stroke="none"
      {...props}
    >
      <path d="M16.1362 4.54987L8.41574 0.260742L0.695312 4.54987V13.1281L8.41574 17.4173L16.1362 13.1281V4.54987ZM8.41574 2.22516L13.4855 5.03883L10.9034 6.4714C10.2772 5.81945 9.39366 5.4077 8.41574 5.4077C7.43782 5.4077 6.55426 5.81945 5.92805 6.4714L3.34599 5.03883L8.41574 2.22516ZM7.55792 14.981L2.41096 12.1245V6.48856L5.09596 7.98117C5.01875 8.2471 4.98444 8.53876 4.98444 8.839C4.98444 10.4346 6.07388 11.7813 7.55792 12.1588V14.981ZM6.70009 8.839C6.70009 7.89539 7.47213 7.12335 8.41574 7.12335C9.35935 7.12335 10.1314 7.89539 10.1314 8.839C10.1314 9.78261 9.35935 10.5546 8.41574 10.5546C7.47213 10.5546 6.70009 9.78261 6.70009 8.839ZM9.27357 14.981V12.1674C10.7576 11.7899 11.847 10.4431 11.847 8.84758C11.847 8.54734 11.8127 8.25568 11.7355 7.98117L14.4205 6.48856V12.1245L9.27357 14.981Z" />
    </svg>
  );
};

export default TwinTokenIcon;
