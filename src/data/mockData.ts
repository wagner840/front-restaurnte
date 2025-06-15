import { MenuItem, Order, Category, DashboardStats } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Entradas', icon: '🥗' },
  { id: '2', name: 'Pratos Principais', icon: '🍽️' },
  { id: '3', name: 'Sobremesas', icon: '🍰' },
  { id: '4', name: 'Bebidas', icon: '🥤' },
];

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Salada Caesar',
    description: 'Alface romana, croutons, parmesão e molho caesar',
    price: 28.90,
    category: 'Entradas',
    image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '2',
    name: 'Salmão Grelhado',
    description: 'Salmão grelhado com legumes e arroz integral',
    price: 45.90,
    category: 'Pratos Principais',
    image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '3',
    name: 'Tiramisu',
    description: 'Sobremesa italiana tradicional com café e mascarpone',
    price: 18.90,
    category: 'Sobremesas',
    image: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '4',
    name: 'Suco Natural',
    description: 'Suco natural de frutas da estação',
    price: 12.90,
    category: 'Bebidas',
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  }
];

export const orders: Order[] = [
  {
    id: '1',
    customerName: 'João Silva',
    items: [
      { menuItem: menuItems[0], quantity: 1 },
      { menuItem: menuItems[1], quantity: 1 }
    ],
    status: 'preparing',
    total: 74.80,
    createdAt: new Date(),
    tableNumber: 5
  },
  {
    id: '2',
    customerName: 'Maria Santos',
    items: [
      { menuItem: menuItems[2], quantity: 2 },
      { menuItem: menuItems[3], quantity: 1 }
    ],
    status: 'ready',
    total: 50.70,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    tableNumber: 3
  }
];

export const dashboardStats: DashboardStats = {
  totalOrders: 45,
  revenue: 2340.50,
  activeOrders: 8,
  completedOrders: 37
};