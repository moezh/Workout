import { z, defineCollection } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const programs = defineCollection({
  type: "data",
  schema: z.object({
    programId: z.string(),
    programType: z.string(),
    programName: z.string(),
    programDescription: z.string(),
    programWorkouts: z.object({
      "2DaysPerWeek": z.array(z.string()),
      "3DaysPerWeek": z.array(z.string()),
      "4DaysPerWeek": z.array(z.string()),
      "5DaysPerWeek": z.array(z.string()),
      "6DaysPerWeek": z.array(z.string()),
      "7DaysPerWeek": z.array(z.string()),
    }),
    programWeeks: z.number(),
  }),
});

const workouts = defineCollection({
  type: "data",
  schema: z.object({
    id: z.string(),
    type: z.string(),
    name: z.string(),
    description: z.string(),
    work_seconds: z.number(),
    rest_seconds: z.number(),
    circuit: z.number(),
    warmupTarget: z.array(
      z.object({
        category: z.string(),
        target: z.string().optional(),
        target_muscles: z.string().optional(),
      })
    ),
    workoutTarget: z.array(
      z.object({
        category: z.string(),
        target: z.string().optional(),
        target_muscles: z.string().optional(),
      })
    ),
    coolDownTarget: z.array(
      z.object({
        category: z.string(),
        target: z.string().optional(),
        target_muscles: z.string().optional(),
      })
    ),
  }),
});

const exercises = defineCollection({
  type: "data",
  schema: z.object({
    id: z.string(),
    name: z.string(),
    order: z.number(),
    category: z.string(),
    target: z.string(),
    target_muscles: z.string(),
    instruction: z.string(),
    hints: z.string(),
  }),
});

export const collections = {
  posts: posts,
  programs: programs,
  workouts: workouts,
  exercises: exercises,
};
