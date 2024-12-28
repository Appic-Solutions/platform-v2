import { shapesSizes } from "@/common/constants/layout/shapes";

const ShapesPage = () => {
  return (
    <div className="hidden absolute inset-0 z-[-1] lg:block">
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
            className="absolute rounded-full bg-shapes-background opacity-50"
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
