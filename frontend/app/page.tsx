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
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when typing
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Email inválido');
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
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
    <div className="min-h-screen bg-red-600 flex items-center justify-center p-4">
      {/* Logo positioned above the card */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <Image
          src="/logo.svg"
          alt="CInvoluntário Logo"
          width={198}
          height={198}
          className="object-contain"
        />
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-xl">
        <CardContent>
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Login</h1>
            <p className="text-gray-600">Acesse sua conta</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                name="email"
                type="email"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full"
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
                className="w-full"
              />
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              variant="primary" 
              className="mt-4 mx-auto block w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>

            {/* Registration Link */}
            <p className="text-sm text-center text-gray-500">
              Ou <a href="/cadastro" className="text-red-600 underline hover:text-red-700">cadastre-se</a>
            </p>
          </form>

          {/* Development Accounts Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500 mb-3">Contas de desenvolvimento</p>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="bg-gray-50 p-2 rounded text-center">
                  <p className="font-medium text-gray-700">Professor</p>
                  <p className="font-mono text-gray-600">professor@cin.ufpe.br / 123456</p>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <p className="font-medium text-gray-700">Aluno</p>
                  <p className="font-mono text-gray-600">aluno@cin.ufpe.br / 123456</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}