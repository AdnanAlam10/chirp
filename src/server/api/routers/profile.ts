/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getUserbyUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      // const { data: user } = await clerkClient.users.getUserList({
      //   username: [input.username],
      // });

      const { data: users } = await clerkClient.users.getUserList({
        username: [input.username],
        limit: 110,
      });

      const user = users[0];
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      return filterUserForClient(user);
    }),
});
