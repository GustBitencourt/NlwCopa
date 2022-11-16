import { useCallback, useState } from "react";
import { Icon, useToast, VStack, FlatList } from "native-base";
import { Octicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { api } from "../../services/api";

import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import { BetCard, BetCardProps } from "../../components/BetCard";
import { EmptyBetList } from "../../components/EmptyBetList";


export function Bets() {
    const [isLoading, setIsLoading] = useState(true);
    const [bets, setBets] = useState<BetCardProps[]>([]);

    const { navigate } = useNavigation();
    const toast = useToast();

    async function getBoloes() {

        try {
            setIsLoading(true);
            const response = await api.get('/bets');
            setBets(response.data.bets);

        } catch (error) {
            console.log(error);

            toast.show({
                title: 'Erro ao carregar bolões, tente mais tarde.',
                placement: 'top',
                bgColor: 'red.500',
            })

        } finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(useCallback(() => {
        getBoloes();

    }, []))

    return (
        <VStack flex={1} bgColor="gray.900" >
            <Header title="Meus Bolões" />

            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4} >
                <Button
                    title="BUSCAR BOLÃO POR CÓDIGO"
                    leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
                    onPress={() => navigate('find')}
                />
            </VStack>

            {isLoading
                ? <Loading />
                : <FlatList
                    data={bets}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <BetCard 
                            data={item}
                            onPress={() => navigate('details', { id: item.id })}              
                        />                    
                    )}
                    ListEmptyComponent={() => <EmptyBetList />}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{ pb: 10 }}
                    px={5}
                />
            }
        </VStack>
    )
}
