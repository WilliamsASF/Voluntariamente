'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardContent } from '../../components/ui/card';
import Button from '../../components/ui/button';
import Select from '../../components/ui/select';
import Input from '../../components/ui/input';
import { useAuth } from '../../hooks/useAuth';

export default function Cadastro() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Estudante'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      role: value
    });
    setError('');
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validações
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      if (result.success) {
        setSuccess('Cadastro realizado com sucesso! Redirecionando...');
        setTimeout(() => {
          router.push('/pagina_inicial');
        }, 2000);
      } else {
        setError(result.error || 'Erro ao realizar cadastro');
      }
    } catch (error) {
      setError('Erro inesperado ao realizar cadastro');
    }
  };

  return ( 
    <div className="flex items-center justify-center h-screen bg-red-600">
      {/* Logo */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <Image
          src="/logo.svg"
          alt="CInvoluntário Logo"
          width={128}
          height={128}
          className="object-contain"
        />
      </div>

      <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <CardContent>
          {/* Título */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Cadastro</h1>
            <p className="text-gray-600">Crie sua conta</p>
          </div>

          {/* Mensagens */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome de usuário
              </label>
              <Input
                name="username"
                type="text"
                placeholder="Digite seu nome de usuário"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>

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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Função
              </label>
              <Select
                placeholder="Selecione uma função"
                options={[
                  { value: 'Estudante', label: 'Estudante' },
                  { value: 'Professor', label: 'Professor' },
                  { value: 'Admin', label: 'Administrador' },
                ]}
                value={formData.role}
                onChange={handleSelectChange}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Cadastrando...' : 'Finalizar Cadastro'}
            </Button>

            {/* Link para login */}
            <p className="text-sm text-center text-gray-500">
              Já tem uma conta? <a href="/" className="text-red-600 underline">Faça login</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}