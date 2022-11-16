import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Jhon Doe',
            email: 'jhon.doe@gmail.com',
            avatarUrl: 'https://github.com/diego3g.png',
        }
    })

    const bet = await prisma.bet.create({
        data: {
            title: 'Bolão da Firma',
            code: 'bol123',
            ownerId: user.id,

            participants: {
                create: {
                    userId: user.id,
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-20T16:00:00.201Z',
            homeTeamCountryCode: 'DE',
            awayTeamCountryCode: 'BR',
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-20T16:00:00.201Z',
            homeTeamCountryCode: 'BR',
            awayTeamCountryCode: 'AR',

            guesses: {
                create: {
                    homeTeamPoints: 7,
                    awayTeamPoints: 5,

                    participant: {
                        connect: {
                            userId_betId: {
                                userId: user.id,
                                betId: bet.id,
                            }
                        }
                    }
                }
            }
        }
    })
    
}

main()