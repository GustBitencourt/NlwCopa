import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();

    return { count };
  });

  fastify.post(
    "/bets/:betId/games/:gameId/guesses",
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const createGuessParams = z.object({
        betId: z.string(),
        gameId: z.string(),
      });

      const createGuessBody = z.object({
        homeTeamPoints: z.number(),
        awayTeamPoints: z.number(),
      });

      const { betId, gameId } = createGuessParams.parse(request.params);
      const { homeTeamPoints, awayTeamPoints } = createGuessBody.parse(
        request.body
      );

      const participant = await prisma.participant.findUnique({
        where: {
          userId_betId: {
            betId,
            userId: request.user.sub,
          },
        },
      });

      if (!participant) {
        return reply.status(400).send({
          message: "Você não tem permissão para palpitar nesse bolão",
        });
      }

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId,
          },
        },
      });

      if (guess) {
        return reply.status(400).send({
          message: "Você já palpitou nesse jogo aqui nesse bolão amigo.",
        });
      }

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        return reply.status(400).send({
          message: "Jogo não encontrado",
        });
      }

      if (game.date < new Date()) {
        return reply.status(400).send({
          message: "Esse jogo já ocorreu, não é possível palpitar.",
        });
      }

      await prisma.guess.create({
        data: {
          gameId,
          participantId: participant.id,
          homeTeamPoints,
          awayTeamPoints,
        },
      });

      return reply.status(201).send()
    }
  );
}
