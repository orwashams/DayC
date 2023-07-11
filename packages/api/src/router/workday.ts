import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const workdayRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.workday.findMany();
  }),
  byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.workday.findFirst({ where: { id: input } });
  }),
  create: protectedProcedure
    .input(z.object({ note: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.workday.create({ data: input });
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.workday.delete({ where: { id: input } });
  }),
});
