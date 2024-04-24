import { useState, useEffect, useRef } from "react";

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

const Player = () => {
  const [seconds, setSeconds] = useState(0);
  const [timerWorkout, setTimerWorkout] = useState(0);

  const [exercises, setExercises] = useState<Exercises>([]);
  const [count, setCount] = useState(0);
  const [side, setSide] = useState("Right");

  const [isActive, setIsActive] = useState(true);
  const [isGetPrepared, setIsGetPrepared] = useState(true);

  const exercise = exercises[count];
  const workSeconds = 30;
  const restSeconds = 10;

  const videoRef = useRef<HTMLVideoElement>(null);

  function toTime(s: number) {
    return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
  }

  function endWorkout() {
    setIsActive(false);
    setSeconds(0);
    speechSynthesis.cancel();
    window.location.href = "/finish";
  }

  function prevExercise() {
    if (count > 0) {
      setCount(count - 1);
      setIsGetPrepared(true);
      setSeconds(0);
      setSide("Right");
      const video = videoRef.current;
      video?.load();
      isActive ? video?.play() : video?.pause();
      speechSynthesis.cancel();
    }
  }

  function nextExercise() {
    if (count < exercises.length - 1) {
      setCount(count + 1);
      setIsGetPrepared(true);
      setSeconds(0);
      setSide("Right");
      const video = videoRef.current;
      video?.load();
      isActive ? video?.play() : video?.pause();
      speechSynthesis.cancel();
    }
  }

  function playPauseExercise() {
    const video = videoRef.current;
    if (isActive) {
      video?.pause();
    } else {
      video?.play();
    }
    setIsActive(!isActive);
    speechSynthesis.cancel();
  }

  useEffect(() => {
    const currentWorkout = localStorage.getItem("currentWorkout");
    setExercises(JSON.parse(currentWorkout ? currentWorkout : "[]"));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    video?.load();
    isActive ? video?.play() : video?.pause();
  }, [side]);

  useEffect(() => {
    let interval = undefined;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
        setTimerWorkout((seconds) => seconds + 1);
        if (seconds == restSeconds) {
          if (isGetPrepared) {
            setIsGetPrepared(false);
            setSeconds(0);
          }
        }
        if (seconds === workSeconds) {
          if (count === exercises.length - 1) {
            utterance.text =
              "Congratulations! You have completed your workout.";
            speechSynthesis.speak(utterance);
            endWorkout();
          } else {
            nextExercise();
          }
        }
        if (isGetPrepared) {
          if (seconds === 1)
            utterance.text = `"Get ready for : ${workSeconds} seconds of ${exercise?.data.name}`;
          if (seconds === restSeconds - 4) utterance.text = "3";
          if (seconds === restSeconds - 3) utterance.text = "2";
          if (seconds === restSeconds - 2) utterance.text = "1";
          if (seconds === restSeconds - 1) utterance.text = "Begin!";
          speechSynthesis.speak(utterance);
        } else {
          if (seconds === Math.ceil(workSeconds / 2) - 1) {
            if (exercise?.data.id.slice(-5) === "Right") {
              utterance.text = "Change side.";
              setSide(side === "Right" ? "Left" : "Right");
            } else {
              utterance.text = "Halfway.";
            }
          }
          if (seconds === workSeconds - 4) utterance.text = "3";
          if (seconds === workSeconds - 3) utterance.text = "2";
          if (seconds === workSeconds - 2) utterance.text = "1";
          if (seconds === workSeconds - 1) utterance.text = "Stop!";
          speechSynthesis.speak(utterance);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, seconds]);

  if (!exercise)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );

  let utterance = new SpeechSynthesisUtterance();
  let samantha = speechSynthesis.getVoices().find((v) => v.name == "Samantha");
  if (samantha) utterance.voice = samantha;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col shrink pt-8">
        <div className="flex flex-row text-center">
          <div className="grow">
            <b>
              {count + 1} of {exercises.length}
            </b>
            <br />
            Exercises
          </div>
          <div className="grow">
            <b>{toTime(timerWorkout)}</b>
            <br />
            Overall Time
          </div>
        </div>
        <h1 className="text-center pb-4">{exercise.data.name}</h1>
        <div className="h-1 bg-neutral-100"></div>
        <div
          className="h-1 bg-black relative -top-1"
          style={{
            width: `${((count + 1) / 12) * 100}%`,
          }}
        ></div>
      </div>
      <div className="flex flex-col grow items-center justify-center">
        <div className="relative h-0">
          {isActive ? (
            !isGetPrepared ? null : (
              <div className=" bg-black bg-opacity-50">
                <div className="relative top-[100px] uppercase ">
                  <b>Get Ready</b>
                </div>
              </div>
            )
          ) : (
            <div className=" bg-black w-full h-[100px] bg-opacity-50">
              <div className="relative w-full top-[100px] uppercase text-red-700">
                <b>Paused</b>
              </div>
            </div>
          )}
        </div>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          width={400}
          height={300}
          className="mx-auto"
        >
          <source
            src={`/assets/exercises/videos/${exercise.data.id.replace(
              "Right",
              side
            )}.mp4`}
            type="video/mp4"
          />
        </video>
      </div>
      <div className="flex flex-col shrink pb-8">
        <div className="h-1 bg-neutral-100"></div>
        <div
          className="h-1 bg-black relative -top-1"
          style={{
            width: `${
              (seconds / (isGetPrepared ? restSeconds : workSeconds)) * 100
            }%`,
          }}
        ></div>
        <div className="flex flex-row">
          <div className="w-32">
            {count > 0 ? (
              <button onClick={prevExercise} className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
                <img
                  src={`/assets/exercises/images/${
                    exercises[count - 1]?.data.id
                  }.jpg`}
                  alt={"Exercise " + exercise.data.name}
                  width={100}
                  height={100}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ) : null}
          </div>
          <div className="grow">
            <button onClick={playPauseExercise}>
              <h3>
                {isGetPrepared ? restSeconds - seconds : workSeconds - seconds}
              </h3>
              <div>Seconds</div>
              <div className="pt-2">
                {isActive ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mx-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mx-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>
          <div className="w-32">
            {count < exercises.length - 1 ? (
              <button onClick={nextExercise} className="flex items-center">
                <img
                  src={`/assets/exercises/images/${
                    exercises[count + 1]?.data.id
                  }.jpg`}
                  alt={"Exercise " + exercise.data.name}
                  width={100}
                  height={100}
                  loading="lazy"
                  decoding="async"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
