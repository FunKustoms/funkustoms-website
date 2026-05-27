// Product Types
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  colors: string[];
  sizes: string[];
  trending?: boolean;
  description?: string;
  customizable?: boolean; // true = fully customizable, false/undefined = readymade or slightly customizable
}

// Design Data Types
export interface DesignData {
  image: string | null;
  size: string;
  tshirtPrice: number;
  color: string;
  printing: string;
  view: string;
  designWidth: number;
  designHeight: number;
  positionX: number;
  positionY: number;
}

// Pricing Types
export interface PricingBreakdown {
  designArea: number;
  rawDesignCost: number;
  roundedDesignCost: number;
  roundedOffAmount: number;
  tshirtCost: number;
  subtotal: number;
  gst: number;
  totalPrice: number;
}

// Size Price Map
export interface SizePrice {
  size: string;
  price: number;
}

// Category Type
export interface Category {
  id: string;
  name: string;
  image: string;
  productTitle: string;
}

// Bulk Order Form
export interface BulkOrderForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  quantity: string;
  productType: string;
  deadline: string;
  notes: string;
}

// User Profile Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  gender: 'male' | 'female';
  avatarHue: number; // 0-360 degrees for hue rotation
  createdAt: string;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  customerName?: string;
  customerEmail?: string;
  shippingAddress?: string;
  trackingNumber?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

// Design Upload Types
export interface SavedDesign {
  id: string;
  name: string;
  image: string;
  createdAt: string;
  productType: string;
  size?: string;
  color?: string;
}

// Admin Types
export interface AdminUser extends User {
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  permissions: string[];
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired';
  applicableProducts?: number[];
  applicableCategories?: string[];
  createdAt: string;
}

export interface ApiIntegration {
  id: string;
  name: string;
  type: 'payment' | 'shipping' | 'analytics' | 'marketing' | 'inventory' | 'other';
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  apiKey?: string;
  webhookUrl?: string;
  lastSync?: string;
  config?: Record<string, unknown>;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  recentOrders: Order[];
  topProducts: { product: Product; sales: number }[];
  salesByCategory: { category: string; sales: number }[];
}

export interface AdminSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  taxRate: number;
  shippingFee: number;
  freeShippingThreshold: number;
  orderPrefix: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
  };
  emailNotifications: {
    orderConfirmation: boolean;
    orderShipped: boolean;
    orderDelivered: boolean;
    lowStock: boolean;
  };
}
