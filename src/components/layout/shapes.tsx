import { shapesSizes } from "@/constants/layout/shapes";
import { cn } from "@/lib/utils";

const ShapesPage = () => {
  return (
    <div className="absolute h-full w-11/12 lg:block hidden">
      {shapesSizes.map(
        (
          {
            width,
            height,
            positionTop,
            positionBottom,
            positionRight,
            positionLeft,
          },
          idx
        ) => (
          <div
            key={idx}
            className={cn(
              "absolute rounded-round bg-shapes-background opacity-50"
            )}
            style={{
              width,
              height,
              top: positionTop,
              bottom: positionBottom,
              right: positionRight,
              left: positionLeft,
            }}
          />
        )
      )}
    </div>
  );
};

export default ShapesPage;
