import { useEffect, useState } from 'react';
import { Share } from 'react-native';
import { VStack, useToast, HStack } from 'native-base';
import { useRoute } from '@react-navigation/native';

import { api } from '../../services/api';

import { Header } from '../../components/Header';
import { Loading } from '../../components/Loading';
import { BetCardProps } from '../../components/BetCard';
import { BetHeader } from '../../components/BetHeader';
import { EmptyMyBetList } from '../../components/EmptyMyBetList';
import { Options } from '../../components/Options';
import { Guesses } from '../../components/Guesses';

interface RouteParams {
    id: string;
}

export function Details() {
    const [isLoading, setIsLoading] = useState(true);
    const [isOptionSelected, setIsOptionSelected] = useState<'Seus Palpites' | 'Ranking do Grupo'>('Seus Palpites');
    const [betDetails, setBetDetails] = useState<BetCardProps>({} as BetCardProps)

    const route = useRoute();
    const { id } = route.params as RouteParams;

    const toast = useToast();

    async function getBetDetails() {
        try {
            setIsLoading(true);

            const response = await api.get(`/bets/${id}`);
            setBetDetails(response.data.bet);

        } catch (error) {
            console.log(error);

            toast.show({
                title: 'Erro ao carregar detalhes do bolão, tente mais tarde.',
                placement: 'top',
                bgColor: 'red.500',
            })

        } finally {
            setIsLoading(false);

        }
    }

    async function handleCodeShare() {
        await Share.share({
            message: betDetails.code,
        })
    }

    useEffect(() => {
        getBetDetails()

    }, [id])

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header 
                title={betDetails.title} 
                showBackButton 
                showShareButton
                onShare={handleCodeShare} 
            />

            {betDetails._count?.participants > 0 ? 
                    <VStack px={5} flex={1}>
                        <BetHeader data={betDetails} />

                        <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                            <Options 
                                title="Seus Palpites" 
                                isSelected={isOptionSelected === 'Seus Palpites'}
                                onPress={() => setIsOptionSelected('Seus Palpites')} 
                            />
                            <Options 
                                title="Ranking do Grupo" 
                                isSelected={isOptionSelected === 'Ranking do Grupo'}
                                onPress={() => setIsOptionSelected('Ranking do Grupo')} 
                            />
                        </HStack>

                        <Guesses betId={betDetails.id} code={betDetails.code} />

                    </VStack>

                    : <EmptyMyBetList code={betDetails.code} />
            }

        </VStack>

    )
}