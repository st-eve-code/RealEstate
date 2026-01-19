'use client'

import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: AlertType;
  title: string;
  message: string;
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    buttonColor: 'bg-green-600 hover:bg-green-700',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
    iconColor: 'text-red-600',
    iconBg: 'bg-red-100',
    buttonColor: 'bg-red-600 hover:bg-red-700',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
  },
  info: {
    icon: Info,
    bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
  },
};

export default function AlertModal({ isOpen, onClose, type, title, message }: AlertModalProps) {
  if (!isOpen) return null;

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className={`${config.bgColor} rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slideIn`}>
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-black hover:bg-opacity-5 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>

          <div className="flex items-start gap-4">
            <div className={`${config.iconBg} p-3 rounded-full`}>
              <Icon size={28} className={config.iconColor} />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="px-6 pb-6">
          <p className="text-gray-700 text-base leading-relaxed pl-16">{message}</p>
        </div>

        {/* Action Button */}
        <div className="px-6 pb-6 pl-16">
          <button
            onClick={onClose}
            className={`${config.buttonColor} text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl`}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
