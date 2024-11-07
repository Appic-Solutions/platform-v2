export interface ShapeSize {
  width: string;
  height: string;
  positionTop?: string;
  positionBottom?: string;
  positionRight?: string;
  positionLeft?: string;
}

export const shapesSizes: ShapeSize[] = [
  // left_top
  {
    width: "101px",
    height: "101px",
    positionTop: "15%",
    positionLeft: "1%",
  },
  // left_bottom
  {
    width: "131px",
    height: "131px",
    positionLeft: "5%",
    positionBottom: "10%",
  },
  // left_center
  {
    positionLeft: "30%",
    positionTop: "35%",
    width: "68px",
    height: "68px",
  },
  // right_top
  {
    positionRight: "25%",
    positionTop: "10%",
    width: "101px",
    height: "101px",
  },
  // right_center-first
  {
    positionRight: "1%",
    positionBottom: "10%",
    width: "239px",
    height: "239px",
  },
  // right_center-second
  {
    positionRight: "35%",
    positionBottom: "50%",
    width: "65px",
    height: "65px",
  },
  // right_bottom
  {
    positionRight: "25%",
    positionBottom: "0%",
    width: "101px",
    height: "101px",
  },
];
