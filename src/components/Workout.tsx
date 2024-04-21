import React from "react";

type Props = { workout: any; exercises: any };

const Workout = (props: Props) => {
  return props.exercises.map((exercise: any) => <p>{exercise.id}</p>);
};

export default Workout;
