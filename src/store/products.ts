import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, Category } from '../types';
import { products as initialProducts, categories as initialCategories } from '../data/products';

interface ProductState {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  getProductById: (id: number) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getTrendingProducts: () => Product[];
  searchProducts: (query: string) => Product[];
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      categories: initialCategories,

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: Date.now(), // Simple ID generation - in production, this would come from backend
        };
        set((state) => ({
          products: [...state.products, newProduct],
        }));
      },

      updateProduct: (id, productData) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...productData } : product
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }));
      },

      getProductById: (id) => {
        return get().products.find((product) => product.id === id);
      },

      getProductsByCategory: (category) => {
        if (category === 'all') return get().products;
        return get().products.filter((product) => product.category === category);
      },

      getTrendingProducts: () => {
        return get().products.filter((product) => product.trending);
      },

      searchProducts: (query) => {
        const lowercaseQuery = query.toLowerCase();
        return get().products.filter((product) =>
          product.name.toLowerCase().includes(lowercaseQuery) ||
          (product.description && product.description.toLowerCase().includes(lowercaseQuery)) ||
          product.category.toLowerCase().includes(lowercaseQuery)
        );
      },
    }),
    {
      name: 'funkustoms-products',
      // Only persist products and categories, not the methods
      partialize: (state) => ({
        products: state.products,
        categories: state.categories,
      }),
    }
  )
);