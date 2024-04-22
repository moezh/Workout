import { useState, useEffect } from "react";

type Props = { workout: any; exercises: any };

type Exercises = {
  id: string;
  collection: string;
  data: {
    id: string;
    name: string;
    category: string;
    target: string;
    target_muscles: string;
    order: number;
    instruction: string;
    hints: string;
  };
}[];

type Filter = {
  category: string;
  target?: string | undefined;
  target_muscles?: string | undefined;
}[];

function getRandomExercises(listExercises: Exercises, listFilter: Filter) {
  listExercises = listExercises.sort((a, b) => Math.random() - 0.5);

  let randomExercises: Exercises = [];

  listFilter.map((filter) => {
    let filtredExercises = listExercises.filter(
      (exercise) => !exercise.id.includes("Left")
    );
    if (filter.category && filter.category != "") {
      filtredExercises = filtredExercises.filter((exercise) =>
        exercise.data.category
          .split(",")
          .map((item) => item.trim())
          .includes(filter.category)
      );
    }
    if (filter.target && filter.target != "") {
      filtredExercises = filtredExercises.filter((exercise) =>
        exercise.data.target
          .split(",")
          .map((item) => item.trim())
          .includes(filter.target == undefined ? "" : filter.target)
      );
    }
    if (filter.target_muscles && filter.target_muscles != "") {
      filtredExercises = filtredExercises.filter((exercise) =>
        exercise.data.target_muscles
          .split(",")
          .map((item) => item.trim())
          .includes(
            filter.target_muscles == undefined ? "" : filter.target_muscles
          )
      );
    }
    if (filtredExercises.length > 0) {
      randomExercises.push(filtredExercises[0]);
      listExercises = listExercises.filter(
        (element) => element !== filtredExercises[0]
      );
      /*if (filtredExercises[0].id.includes("Right")) {
        let resultOtherSide = listExercises.filter(
          (exercise) =>
            exercise.id == filtredExercises[0].id.replace("Right", "Left")
        )[0];
        if (resultOtherSide) {
          randomExercises.push(resultOtherSide);
          listExercises = listExercises.filter(
            (element) => element !== resultOtherSide
          );
        }
      }*/
    }
  });
  return randomExercises;
}

const Workout = (props: Props) => {
  const [workout, setWorkout] = useState<Exercises>([]);

  useEffect(() => {
    let warmupExercises: Exercises;
    warmupExercises = getRandomExercises(
      props.exercises,
      props.workout.data.warmupTarget
    );

    let coolDownExercises: Exercises;
    coolDownExercises = getRandomExercises(
      props.exercises,
      props.workout.data.coolDownTarget
    );

    let primaryExercises: Exercises = [];
    for (var i = 0; i < props.workout.data.circuit; i++) {
      let circuitExercises = getRandomExercises(
        props.exercises,
        props.workout.data.workoutTarget
      );
      primaryExercises = [...primaryExercises, ...circuitExercises];
    }

    let workoutExercises = [
      ...warmupExercises,
      ...primaryExercises,
      ...coolDownExercises,
    ];

    setWorkout(workoutExercises);
  }, []);

  const startPlayer = () => {
    localStorage.setItem("currentWorkout", JSON.stringify(workout));
    window.location.href = "/player";
  };

  return workout ? (
    <div className="flex-col items-center justify-center">
      <div className="flex">
        <button className="button full-width rounded-md" onClick={startPlayer}>
          Start Workout →
        </button>
      </div>
      {workout.map((exercise) => (
        <div className="flex items-center justify-center pt-4">
          <div className="flex-shrink">
            <img
              src={`/assets/exercises/images/${exercise.id}.jpg`}
              alt={"exercise: " + exercise.data.name}
              width={200}
              height={200}
            />
          </div>
          <div className="flex-grow pl-8">
            {exercise.data.name}
            <br />
            <small>30s work / 10s rest</small>
          </div>
          <div className="flex-shrink">
            <a href={`/exercises/${exercise.id}/`}>→</a>
          </div>
        </div>
      ))}
      <div className="flex pt-4">
        <button className="button full-width rounded-md" onClick={startPlayer}>
          Start Workout →
        </button>
      </div>
    </div>
  ) : null;
};

export default Workout;
