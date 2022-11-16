import { useState } from 'react';
import { VStack, Heading, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';

import { api } from '../../services/api';

import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';


export function Find() {
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState('')
    
    const { navigate } =  useNavigation();
    const toast = useToast();

    async function handleJoinBolao() {
        try {
            setIsLoading(true);

            if(!code.trim()) {
                return toast.show({
                    title: 'Informe o código do bolão',
                    placement: 'top',
                    bgColor: 'red.500',
                })
            }

            await api.post('/bets/join', { code });
            
            toast.show({
                title: 'Você entrou no bolão',
                placement: 'top',
                bgColor: 'green.500',
            })

            navigate('bets');

        } catch (error) {
            console.log(error);
            setIsLoading(false);

            if (error.response?.data?.message === 'Bolão não encontrado') {
                return toast.show({
                    title: 'Bolão não encontrado',
                    placement: 'top',
                    bgColor: 'red.500',
                })
            }

            if (error.response?.data?.message === 'Você já participa desse bolão amigo.') {
                return toast.show({
                    title: 'Você já participa desse bolão amigo.',
                    placement: 'top',
                    bgColor: 'red.500',
                })
            }

            toast.show({
                title: 'Não foi possível encontrar o bolão',
                placement: 'top',
                bgColor: 'red.500',
            })

        }
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Buscar por código" showBackButton />

            <VStack mt={8} mx={5} alignItems="center" >
                <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
                    Encontre o seu bolão através {'\n'}
                    do seu código!
                </Heading>

                <Input
                    mb={2}
                    placeholder="Qual o código do seu bolão?"
                    autoCapitalize='characters'
                    onChangeText={setCode}
                    value={code}
                />

                <Button
                    title="BUSCAR BOLÃO"
                    isLoading={isLoading}
                    onPress={handleJoinBolao}
                />
            </VStack>

        </VStack>
    )
}
