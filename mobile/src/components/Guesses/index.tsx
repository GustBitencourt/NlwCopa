import { useState, useEffect } from 'react';
import { useToast, FlatList } from 'native-base';

import { Game, GameProps } from '../Game';
import { Loading } from '../Loading';
import { EmptyMyBetList } from '../EmptyMyBetList';

import { api } from '../../services/api';

interface Props {
  betId: string;
  code: string;
}

export function Guesses({ betId, code }: Props) {
    const [isLoading, setIsLoading] = useState(true);
    const [games, setGames] = useState<GameProps[]>([]);
    const [homeTeamPoints, setHomeTeamPoints] = useState('');
    const [awayTeamPoints, setAwayTeamPoints] = useState('');

    const toast = useToast();

    async function getGames() {
        try {
            setIsLoading(true);

            const response = await api.get(`/bets/${betId}/games`);            
            setGames(response.data.games);

        } catch(error) {
            console.log(error);
            toast.show({
                title: 'Não foi possível carregar os jogos',
                placement: 'top',
                bgColor: 'red.500',
            })

        } finally {
            setIsLoading(false);
        }
    }

    async function handleGuessConfirm(gameId: string) {
        try {
            if(!homeTeamPoints.trim() || !awayTeamPoints.trim()) {
                return toast.show({
                    title: 'Informe os placares corretamente',
                    placement: 'top',
                    bgColor: 'red.500',
                })
            }

            await api.post(`/bets/${betId}/games/${gameId}/guesses`, {
                homeTeamPoints: Number(homeTeamPoints),
                awayTeamPoints: Number(awayTeamPoints),
            })

            toast.show({
                title: 'Palpite enviado com sucesso',
                placement: 'top',
                bgColor: 'green.500',
            })

            getGames();

        } catch(error) {
            console.log(error);
            toast.show({
                title: 'Não foi possíve enviar palpite',
                placement: 'top',
                bgColor: 'red.500',
            })

        } finally {
            setIsLoading(false);
        }

    }

    useEffect(() => {
        getGames();

    }, [betId])

    if(isLoading) {
        <Loading />
    }

  return (
    <FlatList 
        data={games}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
            <Game 
                data={item}
                setHomeTeamPoints={setHomeTeamPoints}
                setAwayTeamPoints={setAwayTeamPoints}
                onGuessConfirm={() => handleGuessConfirm(item.id)}
            /> 
        )}
        _contentContainerStyle={{ pb: 10 }}
        ListEmptyComponent={() => <EmptyMyBetList code={code} />}
    />
  );
}
