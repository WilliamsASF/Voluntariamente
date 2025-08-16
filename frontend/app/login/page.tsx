'use client';

import React from 'react';
import Image from 'next/image';

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-600">
      <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            CIn
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Bem-vindo(a) de volta
        </h2>

        {/* Formulário */}
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            Entrar
          </button>
        </form>

        {/* Link para cadastro */}
        <p className="text-sm text-center text-gray-500">
          Não tem conta?{' '}
          <a href="/cadastro" className="text-red-600 underline">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}