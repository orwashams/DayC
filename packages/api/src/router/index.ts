import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { workdayRouter } from "./workday";

export const appRouter = router({
  post: postRouter,
  workday: workdayRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
