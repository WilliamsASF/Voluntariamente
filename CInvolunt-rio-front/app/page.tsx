'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardContent } from '../components/ui/card';
import  Input  from '../components/ui/input';
import  Button  from '../components/ui/button';

export default function Login() {
  const router = useRouter();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/pagina_inicial');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-red-600">
      {/* Logo fora do quadrado vermelho */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <Image
          src="/logo.svg"
          alt="ClInvoluntário Logo"
          width={128}
          height={128}
          className="object-contain"
        />
      </div>

      {/* Caixa Branca Centralizada */}
      <Card className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-md">
        <CardContent>
          {/* Formulário */}
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input label="Email" type="email" placeholder="Digite seu email" />
            <Input label="Senha" type="password" placeholder="Digite sua senha" />

            {/* Botão Entrar */}
            <Button type="submit" variant="primary" className="w-full mt-4">
              Entrar
            </Button>

            {/* Link para cadastro */}
            <p className="text-sm text-center text-gray-500">
              Ou <a href="/cadastro" className="text-red-600 underline">cadastre-se</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}