import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export interface App {
  id: string;
  name: string;
  description: string;
  client_id: string;
  // client_secret?: string; // Opcional para segurança
  status: 'active' | 'inactive' | 'suspended';
  environment: 'sandbox' | 'production';
  created_at: string;
  updated_at: string;
  last_used?: string;
  webhook_url?: string;
  ip_restrictions?: string[];
  permissions: string[];
}
//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Começar',
    url: '/dashboard/get-started',
    icon: 'rocket',
    isActive: false,
    shortcut: ['c', 'c'],
    items: []
  },
  {
    title: 'Integração',
    url: '/dashboard/integration',
    icon: 'plug',
    isActive: false,
    shortcut: ['i', 'i'],
    items: []
  },
  {
    title: 'Checkout',
    url: '#',
    icon: 'shoppingCart',
    isActive: false,
    items: [
      {
        title: 'Personalizar Checkout',
        url: '/dashboard/checkout/customize',
        icon: 'sliders'
      },
      {
        title: 'Configurações',
        url: '/dashboard/checkout/settings',
        icon: 'settings'
      }
    ]
  },
  {
    title: 'App',
    url: '#',
    icon: 'smartphone',
    isActive: false,
    items: [
      {
        title: 'Credenciais',
        url: '/dashboard/app/credentials',
        icon: 'key'
      },
      {
        title: 'Botões',
        url: '/dashboard/app/buttons',
        icon: 'mousePointer'
      }
    ]
  },
  {
    title: 'Financeiro',
    url: '#',
    icon: 'dollarSign',
    isActive: false,
    items: [
      {
        title: 'Carteira - Saques',
        url: '/dashboard/finance/wallet',
        icon: 'wallet'
      },
      {
        title: 'Reembolsos',
        url: '/dashboard/finance/refunds',
        icon: 'refreshCw'
      }
    ]
  },
  {
    title: 'Análises',
    url: '/dashboard/analytics',
    icon: 'barChart',
    isActive: false,
    shortcut: ['a', 'a'],
    items: []
  },
  {
    title: 'Marketing',
    url: '/dashboard/marketing',
    icon: 'megaphone',
    isActive: false,
    shortcut: ['m', 'm'],
    items: []
  },
  {
    title: 'Configurações',
    url: '#',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: 'Privacidade',
        url: '/dashboard/settings/privacy',
        icon: 'shield'
      },
      {
        title: 'Termos e Condições',
        url: '/dashboard/settings/terms',
        icon: 'fileText'
      },
      {
        title: 'Configurações Gerais',
        url: '/dashboard/settings/general',
        icon: 'settings'
      }
    ]
  },
  {
    title: 'Minha Conta',
    url: '#',
    icon: 'user',
    isActive: false,
    items: [
      {
        title: 'Perfil',
        url: '/dashboard/account/profile',
        icon: 'userPen'
      },
      {
        title: 'Sair',
        url: '/logout',
        icon: 'logOut'
      }
    ]
  }
];
export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
