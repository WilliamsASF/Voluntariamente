'use client';

import React from 'react';
import Image from 'next/image';
import  Card  from '../components/ui/card';
import Input from '../components/ui/input';
import Button from '../components/ui/button';

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-600">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-md">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo.jpeg"
            alt="CInvoluntário Logo"
            width={128}
            height={128}
            className="object-contain"
          />
        </div>

        {/* Título (opcional) */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Bem-vindo(a) de volta
        </h2>

        {/* Formulário */}
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="w-full mt-1"
              label="Email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full mt-1"
              label="Senha"
            />
          </div>

          <Button type="submit" variant="default" className="w-full mt-4">
            Entrar
          </Button>
        </form>

        {/* Link para cadastro */}
        <p className="text-sm text-center text-gray-500">
          Não tem conta?{' '}
          <a href="/cadastro" className="text-red-600 underline">
            Cadastre-se
          </a>
        </p>
      </Card>
    </div>
  );
}