import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DesignData, PricingBreakdown, User, Order, SavedDesign } from '../types';
import { authAPI, ordersAPI, customizationsAPI } from '../services/api';

interface DesignState {
  designData: DesignData;
  designImage: HTMLImageElement | null;
  imageAspectRatio: number;
  setDesignData: (data: Partial<DesignData>) => void;
  setDesignImage: (image: HTMLImageElement | null) => void;
  setImageAspectRatio: (ratio: number) => void;
  resetDesign: () => void;
  calculatePricing: () => PricingBreakdown;
}

const initialDesignData: DesignData = {
  image: null,
  size: 'XS',
  tshirtPrice: 200,
  color: '#000000',
  printing: 'DTF',
  view: 'front',
  designWidth: 6,
  designHeight: 6,
  positionX: 0,
  positionY: 0,
};

export const useDesignStore = create<DesignState>()(
  persist(
    (set, get) => ({
      designData: initialDesignData,
      designImage: null,
      imageAspectRatio: 1,

      setDesignData: (data) =>
        set((state) => ({
          designData: { ...state.designData, ...data },
        })),

      setDesignImage: (image) => set({ designImage: image }),

      setImageAspectRatio: (ratio) => set({ imageAspectRatio: ratio }),

      resetDesign: () =>
        set({
          designData: initialDesignData,
          designImage: null,
          imageAspectRatio: 1,
        }),

      calculatePricing: () => {
        const { designData } = get();
        const designArea = designData.designWidth * designData.designHeight;
        const rawDesignCost = designArea * 1; // ₹1 per sq inch

        // Round to nearest multiple of 5
        const roundedDesignCost = Math.round(rawDesignCost / 5) * 5;
        const roundedOffAmount = roundedDesignCost - rawDesignCost;

        const tshirtCost = designData.tshirtPrice;
        const subtotal = roundedDesignCost + tshirtCost;
        const gst = subtotal * 0.05;
        const totalPrice = subtotal + gst;

        return {
          designArea,
          rawDesignCost,
          roundedDesignCost,
          roundedOffAmount,
          tshirtCost,
          subtotal,
          gst,
          totalPrice,
        };
      },
    }),
    {
      name: 'funkustoms-design',
      partialize: (state) => ({ designData: state.designData }),
    }
  )
);

// Cart Store
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: 'funkustoms-cart',
    }
  )
);

// User Store
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  orders: Order[];
  savedDesigns: SavedDesign[];
  setUser: (user: User | null) => void;
  updateUser: (data: Partial<User>) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: { name: string; email: string; password: string; phone: string }) => Promise<boolean>;
  hydrateUserData: () => Promise<void>;
  logout: () => void;
  addOrder: (order: Order) => void;
  addSavedDesign: (design: SavedDesign) => void;
  removeSavedDesign: (id: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      orders: [],
      savedDesigns: [],

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      login: async (email, password) => {
        try {
          const response = await authAPI.login({ email, password });
          const payload = response.data;
          localStorage.setItem('token', payload.token);

          const createdAt = new Date().toISOString();
          set({
            user: {
              id: payload.userId,
              name: payload.name || email.split('@')[0],
              email,
              phone: payload.phone || '',
              gender: 'male',
              avatarHue: 0,
              createdAt,
            },
            isAuthenticated: true,
            token: payload.token,
          });
          await get().hydrateUserData();
          return true;
        } catch {
          return false;
        }
      },

      register: async ({ name, email, password, phone }) => {
        try {
          const response = await authAPI.register({ name, email, password, phone });
          const payload = response.data;
          localStorage.setItem('token', payload.token);
          set({
            user: {
              id: payload.userId,
              name,
              email,
              phone,
              gender: 'male',
              avatarHue: 0,
              createdAt: new Date().toISOString(),
            },
            isAuthenticated: true,
            token: payload.token,
            orders: [],
            savedDesigns: [],
          });
          return true;
        } catch {
          return false;
        }
      },

      hydrateUserData: async () => {
        const currentUser = get().user;
        if (!currentUser) return;
        try {
          const [ordersRes, customizationsRes] = await Promise.all([
            ordersAPI.getUserOrders(currentUser.id),
            customizationsAPI.getUserCustomizations(currentUser.id),
          ]);

          const orders: Order[] = (ordersRes.data || []).map((order: any) => ({
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
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            shippingAddress: order.shippingAddress,
          }));

          const savedDesigns: SavedDesign[] = (customizationsRes.data || []).map((item: any) => ({
            id: item.id,
            name: item.title || 'Custom Design',
            image: item.image || '/assets/logo.png',
            createdAt: new Date(item.createdAt || Date.now()).toISOString().split('T')[0],
            productType: item.category || 'Custom Product',
            size: item.size,
            color: item.color,
          }));

          set({ orders, savedDesigns });
        } catch {
          set({ orders: [], savedDesigns: [] });
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false, token: null, orders: [], savedDesigns: [] });
      },

      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),

      addSavedDesign: (design) =>
        set((state) => ({ savedDesigns: [design, ...state.savedDesigns] })),

      removeSavedDesign: (id) =>
        set((state) => ({
          savedDesigns: state.savedDesigns.filter((d) => d.id !== id),
        })),
    }),
    {
      name: 'funkustoms-user',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        orders: state.orders,
        savedDesigns: state.savedDesigns,
      }),
    }
  )
);
