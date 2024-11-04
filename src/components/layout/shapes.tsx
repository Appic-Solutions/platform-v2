import { shapesSizes } from "@/constants/layout/shapes";
import { cn } from "@/lib/utils";

const ShapesPage = () => {
  return (
    <div className="absolute w-full h-full">
      {shapesSizes.map(({ width, height, positionTop, positionBottom, positionRight, positionLeft }, idx) => (
        <div
          key={idx}
          className={cn(
            "absolute rounded-round bg-white",
          )}
          style={{
            width,
            height,
            top: positionTop,
            bottom: positionBottom,
            right: positionRight,
            left: positionLeft
          }}
        />
      ))}
    </div>
  );
}

export default ShapesPage;