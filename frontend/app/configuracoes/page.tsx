'use client';

import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Database, Palette } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../../components/ui/card';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function ConfiguracoesPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true
  });

  const [theme, setTheme] = useState('light');

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
          <p className="text-gray-600 mt-2">
            Gerencie as configurações da sua conta e do sistema
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900">Perfil do Usuário</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <Input
                  type="text"
                  placeholder="Seu nome completo"
                  defaultValue="Professor"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  defaultValue="professor@ufpe.br"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento
                </label>
                <Input
                  type="text"
                  placeholder="Seu departamento"
                  defaultValue="Ciência da Computação"
                  disabled
                />
              </div>
              
              <Button variant="outline" className="w-full">
                Editar Perfil
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900">Notificações</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Notificações por Email</p>
                  <p className="text-sm text-gray-500">Receber atualizações por email</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Notificações Push</p>
                  <p className="text-sm text-gray-500">Receber notificações no navegador</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Relatório Semanal</p>
                  <p className="text-sm text-gray-500">Receber resumo semanal das atividades</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.weekly}
                  onChange={(e) => setNotifications({ ...notifications, weekly: e.target.checked })}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900">Aparência</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tema
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-gray-500">
                  O tema escuro estará disponível em breve
                </p>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900">Informações do Sistema</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Versão:</span>
                  <span className="text-gray-900">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Última atualização:</span>
                  <span className="text-gray-900">Hoje</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  Verificar Atualizações
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900">Segurança</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                Alterar Senha
              </Button>
              <Button variant="outline" className="w-full">
                Configurar 2FA
              </Button>
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-gray-500">
                Mantenha sua conta segura com senhas fortes e autenticação de dois fatores
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}


