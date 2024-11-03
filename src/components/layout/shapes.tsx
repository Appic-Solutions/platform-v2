import { shapesSizes } from "@/constants/layout/shapes";
import { cn } from "@/lib/utils";

const ShapesPage = () => {
  return (
    shapesSizes.map(({ width, height, positionX, positionY }, idx) => (
      <div
        key={idx}
        className={cn(
          "absolute rounded-full",
          `w-[${width}px] h-[${height}px]`,
          `left-[${positionX}px] top-[${positionY}px]`
        )}
      />
    ))
  );
}

export default ShapesPage;