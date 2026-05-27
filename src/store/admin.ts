import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order } from '../types';
import { customizationsAPI, ordersAPI, usersAPI } from '../services/api';

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  expiryDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  avatar?: string;
}

export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  salesByCategory: { category: string; sales: number }[];
  revenueByDay: { day: string; revenue: number }[];
}

interface AdminState {
  orders: Order[];
  customizations: {
    id: string;
    customerName: string;
    title: string;
    description?: string;
    status: string;
    createdAt: string;
  }[];
  coupons: Coupon[];
  customers: Customer[];
  analytics: Analytics;
  
  // Order management
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
  loadOrders: () => Promise<void>;
  loadCustomizations: () => Promise<void>;
  loadCustomers: () => Promise<void>;
  syncOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  
  // Coupon management
  addCoupon: (coupon: Omit<Coupon, 'id' | 'createdAt' | 'usedCount'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string) => Coupon | null;
  
  // Customer management
  addCustomer: (customer: Omit<Customer, 'id' | 'joinedDate'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  
  // Analytics
  refreshAnalytics: () => void;
}

// Sample data
const sampleOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'FK-2026-001234',
    date: '2026-01-18',
    status: 'processing',
    items: [
      {
        id: 1,
        name: 'Custom Black T-Shirt',
        price: 599,
        quantity: 2,
        image: '/assets/product-tshirt.png',
        size: 'L',
        color: 'Black',
      },
    ],
    total: 1599,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    shippingAddress: '123 Main St, Mumbai, MH 400001',
  },
  {
    id: '2',
    orderNumber: 'FK-2026-001233',
    date: '2026-01-18',
    status: 'shipped',
    items: [
      {
        id: 2,
        name: 'Custom Hoodie',
        price: 1299,
        quantity: 1,
        image: '/assets/product-hoodie.png',
        size: 'XL',
        color: 'Navy',
      },
      {
        id: 3,
        name: 'Custom Mug',
        price: 349,
        quantity: 2,
        image: '/assets/product-mug.png',
      },
    ],
    total: 2499,
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    shippingAddress: '456 Park Ave, Delhi, DL 110001',
    trackingNumber: 'DTDC987654321',
  },
  {
    id: '3',
    orderNumber: 'FK-2026-001232',
    date: '2026-01-17',
    status: 'delivered',
    items: [
      {
        id: 4,
        name: 'Phone Case',
        price: 449,
        quantity: 2,
        image: '/assets/product-phonecase.png',
      },
    ],
    total: 899,
    customerName: 'Raj Kumar',
    customerEmail: 'raj@example.com',
    shippingAddress: '789 Lake Rd, Bangalore, KA 560001',
    trackingNumber: 'DTDC456789123',
  },
  {
    id: '4',
    orderNumber: 'FK-2026-001231',
    date: '2026-01-17',
    status: 'pending',
    items: [
      {
        id: 5,
        name: 'Custom Hoodie',
        price: 1299,
        quantity: 1,
        image: '/assets/product-hoodie.png',
        size: 'M',
        color: 'Black',
      },
      {
        id: 6,
        name: 'Custom T-Shirt',
        price: 599,
        quantity: 2,
        image: '/assets/product-tshirt.png',
        size: 'L',
        color: 'White',
      },
      {
        id: 7,
        name: 'Stickers Pack',
        price: 199,
        quantity: 5,
        image: '/assets/product-stickers.png',
      },
    ],
    total: 3299,
    customerName: 'Priya Sharma',
    customerEmail: 'priya@example.com',
    shippingAddress: '321 Hill St, Pune, MH 411001',
  },
  {
    id: '5',
    orderNumber: 'FK-2026-001230',
    date: '2026-01-16',
    status: 'delivered',
    items: [
      {
        id: 8,
        name: 'Custom Hoodie',
        price: 1299,
        quantity: 1,
        image: '/assets/product-hoodie.png',
        size: 'L',
        color: 'Gray',
      },
    ],
    total: 1299,
    customerName: 'Amit Patel',
    customerEmail: 'amit@example.com',
    shippingAddress: '654 Beach Rd, Chennai, TN 600001',
    trackingNumber: 'DTDC789123456',
  },
];

const sampleCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    description: 'Welcome discount for new customers',
    expiryDate: '2026-12-31',
    usageLimit: 100,
    usedCount: 45,
    isActive: true,
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    code: 'SUMMER50',
    type: 'fixed',
    value: 50,
    description: 'Flat ₹50 off on all orders',
    expiryDate: '2026-06-30',
    usageLimit: 500,
    usedCount: 234,
    isActive: true,
    createdAt: '2026-01-15',
  },
];

const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    totalOrders: 12,
    totalSpent: 15890,
    joinedDate: '2025-12-01',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+91 98765 43211',
    totalOrders: 8,
    totalSpent: 9450,
    joinedDate: '2025-12-15',
  },
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      orders: sampleOrders,
      customizations: [],
      coupons: sampleCoupons,
      customers: sampleCustomers,
      analytics: {
        totalRevenue: 245890,
        totalOrders: 1234,
        totalCustomers: 856,
        revenueGrowth: 12.5,
        ordersGrowth: 8.3,
        customersGrowth: 15.2,
        salesByCategory: [
          { category: 'T-Shirts', sales: 45 },
          { category: 'Hoodies', sales: 28 },
          { category: 'Mugs', sales: 15 },
          { category: 'Phone Cases', sales: 12 },
        ],
        revenueByDay: [
          { day: 'Mon', revenue: 12500 },
          { day: 'Tue', revenue: 15200 },
          { day: 'Wed', revenue: 18900 },
          { day: 'Thu', revenue: 22100 },
          { day: 'Fri', revenue: 19800 },
          { day: 'Sat', revenue: 25600 },
          { day: 'Sun', revenue: 23400 },
        ],
      },

      // Order management
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),

      updateOrder: (id, updates) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, ...updates } : order
          ),
        })),

      deleteOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        })),

      getOrderById: (id) => {
        return get().orders.find((order) => order.id === id);
      },

      loadOrders: async () => {
        try {
          const response = await ordersAPI.getAllOrders();
          const mapped: Order[] = (response.data || []).map((order: any) => ({
            id: order.id,
            orderNumber: order.orderNumber || `FK-${new Date(order.createdAt || Date.now()).getFullYear()}-${String(order.id).slice(-6)}`,
            date: new Date(order.createdAt || Date.now()).toISOString().split('T')[0],
            status: order.status || 'pending',
            items: (order.products || []).map((product: any, index: number) => ({
              id: Number(product.productId || index + 1),
              name: product.name || 'Custom Product',
              price: Number(product.price || 0),
              quantity: Number(product.quantity || 1),
              image: '/assets/logo.png',
            })),
            total: Number(order.totalAmount || 0),
            customerName: order.customerName || '',
            customerEmail: order.customerEmail || '',
            shippingAddress: order.shippingAddress || '',
          }));
          set({ orders: mapped.length > 0 ? mapped : get().orders });
          get().refreshAnalytics();
        } catch {
          return;
        }
      },

      loadCustomizations: async () => {
        try {
          const response = await customizationsAPI.getAllCustomizations();
          const mapped = (response.data || []).map((item: any) => ({
            id: item.id,
            customerName: item.customerName || 'Customer',
            title: item.title || 'Custom Design',
            description: item.description || '',
            status: item.status || 'draft',
            createdAt: new Date(item.createdAt || Date.now()).toISOString(),
          }));
          set({ customizations: mapped });
        } catch {
          return;
        }
      },

      loadCustomers: async () => {
        try {
          const response = await usersAPI.getAll();
          const users = response.data || [];
          const mapped: Customer[] = users
            .filter((user: any) => (user.role || 'customer') === 'customer')
            .map((user: any) => ({
              id: user.id,
              name: user.name || user.email?.split('@')?.[0] || 'Customer',
              email: user.email || '',
              phone: user.phone || '',
              totalOrders: 0,
              totalSpent: 0,
              joinedDate: new Date(user.createdAt || Date.now()).toISOString(),
            }));

          if (mapped.length > 0) {
            set({ customers: mapped });
            get().refreshAnalytics();
          }
        } catch {
          return;
        }
      },

      syncOrderStatus: async (id, status) => {
        await ordersAPI.updateOrder(id, { status });
        get().updateOrder(id, { status });
      },

      // Coupon management
      addCoupon: (couponData) => {
        const newCoupon: Coupon = {
          ...couponData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          usedCount: 0,
        };
        set((state) => ({
          coupons: [...state.coupons, newCoupon],
        }));
      },

      updateCoupon: (id, updates) =>
        set((state) => ({
          coupons: state.coupons.map((coupon) =>
            coupon.id === id ? { ...coupon, ...updates } : coupon
          ),
        })),

      deleteCoupon: (id) =>
        set((state) => ({
          coupons: state.coupons.filter((coupon) => coupon.id !== id),
        })),

      validateCoupon: (code) => {
        const coupon = get().coupons.find(
          (c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive
        );
        if (!coupon) return null;
        if (new Date(coupon.expiryDate) < new Date()) return null;
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return null;
        return coupon;
      },

      // Customer management
      addCustomer: (customerData) => {
        const newCustomer: Customer = {
          ...customerData,
          id: Date.now().toString(),
          joinedDate: new Date().toISOString(),
        };
        set((state) => ({
          customers: [...state.customers, newCustomer],
        }));
      },

      updateCustomer: (id, updates) =>
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id ? { ...customer, ...updates } : customer
          ),
        })),

      // Analytics
      refreshAnalytics: () => {
        const { orders, customers } = get();
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const totalCustomers = customers.length;

        set({
          analytics: {
            ...get().analytics,
            totalRevenue,
            totalOrders,
            totalCustomers,
          },
        });
      },
    }),
    {
      name: 'funkustoms-admin',
      partialize: (state) => ({
        orders: state.orders,
        customizations: state.customizations,
        coupons: state.coupons,
        customers: state.customers,
      }),
    }
  )
);
