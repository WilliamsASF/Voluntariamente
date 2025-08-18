'use client';

import React, { useState } from 'react';
import { Check, X, FileText, Users, Package, Building } from 'lucide-react';
import Card from './ui/card';
import { Group, Document, Deliverable } from '../lib/types';

interface GroupCardProps {
  group: Group;
  onEdit?: (group: Group) => void;
  onDelete?: (groupId: string) => void;
  isEditable?: boolean;
}

export default function GroupCard({ group, onEdit, onDelete, isEditable = false }: GroupCardProps) {
  const [activeStage, setActiveStage] = useState('Etapa 1');

  const getDeliverableStatus = (stage: string) => {
    const deliverable = group.deliverables.find(d => d.stage === stage);
    if (!deliverable) return { status: 'pending', icon: <X className="h-4 w-4" />, color: 'bg-gray-300 text-gray-600' };
    
    switch (deliverable.status) {
      case 'completed':
        return { status: 'completed', icon: <Check className="h-4 w-4" />, color: 'bg-gray-700 text-white' };
      case 'rejected':
        return { status: 'rejected', icon: <X className="h-4 w-4" />, color: 'bg-gray-700 text-white' };
      default:
        return { status: 'pending', icon: <X className="h-4 w-4" />, color: 'bg-gray-300 text-gray-600' };
    }
  };

  const getDocumentsForStage = (stage: string) => {
    return group.documents.filter(doc => doc.stage === stage);
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* NGO Name Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Nome da Ong
            </h3>
            <p className="text-sm text-gray-600 mb-2">{group.ngoName}</p>
            <p className="text-xs text-gray-500 mb-3">[descrição problema]</p>
            <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {group.category}
            </span>
          </div>

          {/* Documents Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Documentos
            </h3>
            
            {/* Stage Navigation */}
            <div className="flex gap-2 mb-4">
              {['Etapa 1', 'Etapa 2', 'Etapa 3', 'Etapa 4'].map((stage) => (
                <button
                  key={stage}
                  onClick={() => setActiveStage(stage)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    activeStage === stage 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>

            {/* Documents for Active Stage */}
            <div className="space-y-3">
              {getDocumentsForStage(activeStage).map((doc) => (
                <div key={doc.id} className="bg-gray-50 p-3 rounded-md border">
                  <h4 className="font-medium text-gray-900 text-sm">{doc.title}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">&lt;ft&gt;</span>
                    <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      {doc.stage}
                    </span>
                  </div>
                </div>
              ))}
              {getDocumentsForStage(activeStage).length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Nenhum documento para {activeStage}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Students Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Alunos
            </h3>
            <div className="space-y-3">
              {group.students.map((student) => (
                <div key={student.id} className="flex items-center gap-3 bg-gray-100 p-3 rounded-md">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    {student.profilePicture ? (
                      <img src={student.profilePicture} alt={student.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <span className="text-gray-600 text-sm font-semibold">
                        {student.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                    <span className="text-xs text-gray-500">&lt;ft&gt;</span>
                  </div>
                </div>
              ))}
              {group.students.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Nenhum aluno no grupo
                </div>
              )}
            </div>
          </div>

          {/* Deliverables Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              Entregas
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {['Etapa 1', 'Etapa 2', 'Etapa 3', 'Etapa 4'].map((stage) => {
                const status = getDeliverableStatus(stage);
                return (
                  <button
                    key={stage}
                    className={`p-3 rounded-md flex items-center justify-center gap-2 transition-colors ${status.color}`}
                  >
                    <span className="text-sm font-medium">{stage}</span>
                    {status.icon}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditable && (
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => onEdit?.(group)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete?.(group.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Excluir
          </button>
        </div>
      )}
    </Card>
  );
}
