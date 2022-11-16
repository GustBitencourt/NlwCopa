import { useState } from 'react';
import { VStack, Heading, Text, useToast } from 'native-base';

import { api } from '../../services/api';

import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

import Logo from '../../assets/logo.svg'

export function New() {
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();

    async function handleBolaoCreate() {
        if(!title.trim()) {
            return toast.show({
                title: 'Informe o título do bolão.',
                placement: 'top',
                bgColor: 'red.500',
            });
        }

        try {
            setIsLoading(true);

            await api.post('/bets', { title })

            toast.show({
                title: 'Bolão criado com sucesso!',
                placement: 'top',
                bgColor: 'green.500',
            });

            setTitle('');

        } catch (error) {
            console.log(error);

            toast.show({
                title: 'Não foi possível a criação do bolão.',
                placement: 'top',
                bgColor: 'red.500',
            });

        } finally {
            setIsLoading(false);
        }                
    }

    return(
        <VStack flex={1} bgColor="gray.900">
            <Header title="Criar novo bolão"/>

            <VStack mt={8} mx={5} alignItems="center" >
                <Logo />

                <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
                    Crie seu bolão da copa {'\n'} e compartilhe com seus amigos.
                </Heading>

                <Input 
                    mb={2}
                    placeholder="Qual o nome do seu bolão?"
                    onChangeText={setTitle}
                    value={title}                    
                />

                <Button 
                    title="CRIAR MEU BOLÃO"
                    onPress={handleBolaoCreate}
                    isLoading={isLoading}
                />

                <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
                    Após a criação do seu bolão você receberá um código que poderá ser usado para convidar seus amigos.
                </Text>                
            </VStack>

        </VStack>
    )
}