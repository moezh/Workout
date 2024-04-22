import { z, defineCollection } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
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

const workouts = defineCollection({
  type: "data",
  schema: z.object({
    id: z.string(),
    type: z.string(),
    name: z.string(),
    description: z.string(),
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

export const collections = {
  posts: posts,
  exercises: exercises,
  workouts: workouts,
};
