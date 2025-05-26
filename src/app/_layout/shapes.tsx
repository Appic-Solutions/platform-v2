import { SHAPE_SIZES } from '@/lib/constants/layout';

const ShapesPage = () => {
  return (
    <div className="absolute inset-0 z-[-1] hidden lg:block">
      {SHAPE_SIZES.map(
        ({ width, height, positionTop, positionBottom, positionRight, positionLeft }, idx) => (
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
        ),
      )}
    </div>
  );
};

export default ShapesPage;
