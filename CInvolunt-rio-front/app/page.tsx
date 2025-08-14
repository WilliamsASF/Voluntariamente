'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardContent } from '../components/ui/card';
import Input from '../components/ui/input';
import Button from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpar erro ao digitar
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        router.push('/pagina_inicial');
      } else {
        setError(result.error || 'Erro ao fazer login');
      }
    } catch (error) {
      setError('Erro inesperado ao fazer login');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-red-600">
      {/* Logo fora do quadrado vermelho */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <Image
          src="/logo.svg"
          alt="CInvoluntário Logo"
          width={128}
          height={128}
          className="object-contain"
        />
      </div>

      {/* Caixa Branca Centralizada */}
      <Card className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-md">
        <CardContent>
          {/* Título */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Login</h1>
            <p className="text-gray-600">Acesse sua conta</p>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Formulário */}
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <Input
                name="username"
                type="text"
                placeholder="Digite seu usuário"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <Input
                name="password"
                type="password"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Botão Entrar */}
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
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