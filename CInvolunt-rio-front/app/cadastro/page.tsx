'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardContent } from '../../components/ui/card';
import  Button  from '../../components/ui/button';
import  Select  from '../../components/ui/select'; // Novo componente Select
import Input from '../../components/ui/input';

export default function Cadastro() {
  const router = useRouter();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/pagina_inicial');
  };
  return ( 
    <div className="flex items-center justify-center h-screen bg-red-600">
      <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input label="Email" type="email" placeholder="Digite seu email" />
            <Input label="Nome" type="text" placeholder="Digite seu nome" />
            <Select
              label="Função"
              placeholder="Selecione uma função"
              options={[
                { value: 'voluntario', label: 'Voluntário' },
                { value: 'organizador', label: 'Organizador' },
              ]}
            />
            <Input label="Senha" type="password" placeholder="Digite sua senha" />
            <Input label="Confirmar Senha" type="password" placeholder="Confirme sua senha" />
            <Button type="submit" variant="primary" className="w-full">
              Finalizar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}