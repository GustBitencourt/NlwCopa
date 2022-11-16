import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { authenticate } from "../plugins/authenticate";

export async function gameRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/bets/:id/games",
    {
      onRequest: [authenticate],
    },
    async (request) => {
        const getBetParams = z.object({
            id: z.string(),
        })

        const { id } = getBetParams.parse(request.params)

        const games = await prisma.game.findMany({
            orderBy: {
                date: 'desc', //mostrar os jogos recentes primeiro                
            },
            include: {
                guesses: {
                    where: {
                        participant: {
                            userId: request.user.sub,
                            betId: id,
                        }
                    }
                }

            }
        })

        return {
            games: games.map((game) => {
                return {
                    ...game,
                    guess: game.guesses.length > 0 ? game.guesses[0] : null,
                    guesses: undefined, //exclui o guesses do bolao acima mostra só o palpite do usuário.
                }
            })
        }

    }
  );
}
