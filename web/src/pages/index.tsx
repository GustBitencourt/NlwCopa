import { FormEvent, useState } from 'react';
import { api } from '../lib/axios';

import Image from 'next/image';

import appPreviewImg from '../assets/appPreview.png';
import logoImg from '../assets/logo.svg';
import usersAvatarExample from '../assets/avatares.png';
import iconCheck from '../assets/check.svg';

interface HomeProps {
  betsCount: number;
  usersCount: number;
  guessesCount: number;
}

export default function Home(props: HomeProps) {
  const [betTitle, setBetTitle] = useState('')

  async function createBet(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post('/bets', {
        title: betTitle,
      })

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert('Bolão criado com Sucesso! Código copiado para área de transferência.');
      
      setBetTitle('');

    } catch(error) {
      alert('FALHA na criação de BOLÃO');
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="logo nlw Copa" />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu Bolão da copa e compartilhe com os amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExample} alt="Usuários participantes" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.usersCount}</span> pessoas já estão se divertindo por aqui!
          </strong>
        </div>

        <form 
          className='mt-10 flex gap-2'
          onSubmit={createBet}       
        >
          <input 
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            type="text" 
            placeholder="Qual o nome do seu bolão?"
            onChange={event => setBetTitle(event.target.value)}
            value={betTitle}
            required 
          />
          <button 
            className="px-6 py-4 rounded bg-yellow-500 text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"          
          >
            Criar Bolão
          </button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar o seu bolão você receberá um código único que poderá ser utilizado para convidar seus amigos!
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex justify-between items-center text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt="Ícone de check"/>
            <div className='flex flex-col'>
              <span className="font-bold text-2xl">+{props.betsCount}</span>
              <span>Bolões criados.</span>              
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600'/>

          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt="Ícone de check"/>
            <div className='flex flex-col'>
              <span className="font-bold text-2xl">+{props.guessesCount}</span>
              <span>Palpites enviados.</span>              
            </div>
          </div>
        </div>
      </main>

      <Image 
        src={appPreviewImg}
        className="h-[80%]" 
        alt="Dois celulares exibindo a prévia da aplicação de bolão"
        quality={100}
      />
    </div>
  )
}

export const getServerSideProps = async() => {
  const [betsCountResponse, usersCountResponse, guessesCountResponse] = await Promise.all([
    api.get('bets/count'),
    api.get('users/count'),
    api.get('guesses/count'),
  ])

  return {
    props: {
      betsCount: betsCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
      guessesCount: guessesCountResponse.data.count,      
    }
  }
}
