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
      (exercise) => !exercise.data.id.includes("Left")
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
    window.location.href = "/play";
  };

  return workout ? (
    <div className="flex-col items-start justify-start">
      <div className="flex justify-start">
        <button className="button" onClick={startPlayer}>
          Start Workout →
        </button>
      </div>
      {workout.map((exercise, index) => (
        <div key={index} className="flex items-center justify-center pt-8">
          <div className="flex-shrink w-[150px] md:w-[200px]">
            <img
              src={`/assets/exercises/images/${exercise.data.id}.jpg`}
              alt={"Exercise " + exercise.data.name}
              width={200}
              height={200}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="flex-grow pl-8">
            <a href={`/exercises/${exercise.data.id}/`}>
              {exercise.data.name}
              <br />
              <small>30s work / 10s rest</small>
            </a>
          </div>
          <div className="flex-shrink">
            <a href={`/exercises/${exercise.data.id}/`}>→</a>
          </div>
        </div>
      ))}
    </div>
  ) : null;
};

export default Workout;
