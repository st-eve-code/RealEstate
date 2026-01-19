import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Users, Settings, MessageSquare } from 'lucide-react';

const actions = [
  {
    title: 'List New Property',
    description: 'Add a new property to your portfolio',
    icon: Plus,
    color: 'blue',
    href: '/dashboard/list-property',
  },
  {
    title: 'View Properties',
    description: 'Manage all your listed properties',
    icon: FileText,
    color: 'green',
    href: '/dashboard/properties',
  },
  {
    title: 'Messages',
    description: 'Check tenant inquiries and messages',
    icon: MessageSquare,
    color: 'purple',
    href: '/dashboard/messages',
  },
  {
    title: 'Settings',
    description: 'Update your profile and preferences',
    icon: Settings,
    color: 'orange',
    href: '/dashboard/settings',
  },
];

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
  green: 'bg-green-100 text-green-600 hover:bg-green-200',
  purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
  orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
};

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              onClick={() => router.push(action.href)}
              className="group text-left p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-md"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${colorClasses[action.color]}`}>
                <Icon size={24} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {action.title}
              </h4>
              <p className="text-xs text-gray-500">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
