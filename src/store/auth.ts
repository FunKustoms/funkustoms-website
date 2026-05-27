import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, usersAPI } from '../services/api';

export type UserRole = 'super_admin' | 'website_admin' | 'author' | 'inventory';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive' | 'invited';
  createdAt: string;
  lastLogin?: string;
  invitedBy?: string;
  permissions: Permission[];
}

export interface Permission {
  module: 'dashboard' | 'products' | 'orders' | 'users' | 'coupons' | 'integrations' | 'settings' | 'blogs';
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    { module: 'dashboard', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'products', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'orders', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'users', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'coupons', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'integrations', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'settings', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'blogs', canView: true, canCreate: true, canEdit: true, canDelete: true },
  ],
  website_admin: [
    { module: 'dashboard', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'products', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'orders', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'users', canView: true, canCreate: false, canEdit: false, canDelete: false },
    { module: 'coupons', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'integrations', canView: true, canCreate: true, canEdit: true, canDelete: false },
    { module: 'settings', canView: true, canCreate: false, canEdit: true, canDelete: false },
    { module: 'blogs', canView: true, canCreate: true, canEdit: true, canDelete: true },
  ],
  author: [
    { module: 'dashboard', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'products', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'orders', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'users', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'coupons', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'integrations', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'settings', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'blogs', canView: true, canCreate: true, canEdit: true, canDelete: false },
  ],
  inventory: [
    { module: 'dashboard', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'products', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'orders', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'users', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'coupons', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'integrations', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'settings', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'blogs', canView: false, canCreate: false, canEdit: false, canDelete: false },
  ],
};

// Sample users
const sampleUsers: AdminUser[] = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'admin@funkustoms.com',
    role: 'super_admin',
    status: 'active',
    createdAt: '2025-01-01',
    lastLogin: '2026-01-20',
    permissions: rolePermissions.super_admin,
  },
  {
    id: '2',
    name: 'Web Developer',
    email: 'dev@funkustoms.com',
    role: 'website_admin',
    status: 'active',
    createdAt: '2025-06-15',
    lastLogin: '2026-01-19',
    invitedBy: 'admin@funkustoms.com',
    permissions: rolePermissions.website_admin,
  },
  {
    id: '3',
    name: 'Content Writer',
    email: 'writer@funkustoms.com',
    role: 'author',
    status: 'active',
    createdAt: '2025-08-20',
    lastLogin: '2026-01-18',
    invitedBy: 'admin@funkustoms.com',
    permissions: rolePermissions.author,
  },
  {
    id: '4',
    name: 'Inventory Manager',
    email: 'inventory@funkustoms.com',
    role: 'inventory',
    status: 'invited',
    createdAt: '2026-01-15',
    invitedBy: 'admin@funkustoms.com',
    permissions: rolePermissions.inventory,
  },
];

interface AuthState {
  currentUser: AdminUser | null;
  users: AdminUser[];
  isAuthenticated: boolean;
  
  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  syncUsers: () => Promise<void>;
  
  // User management
  inviteUser: (user: Omit<AdminUser, 'id' | 'createdAt' | 'permissions' | 'status'>) => void;
  updateUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteUser: (id: string) => void;
  
  // Permission checks
  hasPermission: (module: Permission['module'], action: 'view' | 'create' | 'edit' | 'delete') => boolean;
  canAccessModule: (module: Permission['module']) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: sampleUsers,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await authAPI.login({ email, password });
          const payload = response.data;
          const apiRole = payload.role || 'customer';
          if (apiRole === 'customer') {
            return false;
          }

          localStorage.setItem('token', payload.token);
          const mappedRole: UserRole = apiRole === 'super_admin' || apiRole === 'website_admin' || apiRole === 'author' || apiRole === 'inventory'
            ? apiRole
            : 'super_admin';

          const user: AdminUser = {
            id: payload.userId,
            name: payload.name || email.split('@')[0],
            email,
            role: mappedRole,
            status: 'active',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            permissions: rolePermissions[mappedRole],
          };

          set({
            currentUser: user,
            isAuthenticated: true,
            users: get().users.some((u) => u.id === user.id)
              ? get().users.map((u) => (u.id === user.id ? user : u))
              : [user, ...get().users],
          });

          await get().syncUsers();
          return true;
        } catch {
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          currentUser: null,
          isAuthenticated: false,
        });
      },

      syncUsers: async () => {
        try {
          const response = await usersAPI.getAll();
          const apiUsers = (response.data || []).map((user: any) => {
            const apiRole = user.role || 'customer';
            const mappedRole: UserRole = apiRole === 'super_admin' || apiRole === 'website_admin' || apiRole === 'author' || apiRole === 'inventory'
              ? apiRole
              : 'inventory';

            return {
              id: user.id,
              name: user.name || user.email?.split('@')?.[0] || 'User',
              email: user.email,
              role: mappedRole,
              avatar: user.avatar,
              status: 'active' as const,
              createdAt: new Date(user.createdAt || Date.now()).toISOString(),
              lastLogin: user.lastLogin ? new Date(user.lastLogin).toISOString() : undefined,
              invitedBy: user.invitedBy,
              permissions: rolePermissions[mappedRole],
            };
          });

          if (apiUsers.length > 0) {
            set({ users: apiUsers });
          }
        } catch {
          return;
        }
      },

      inviteUser: (userData) => {
        const permissions = rolePermissions[userData.role];
        const newUser: AdminUser = {
          ...userData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          status: 'invited',
          permissions,
        };
        
        set((state) => ({
          users: [...state.users, newUser],
        }));
      },

      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updates } : user
          ),
          currentUser: state.currentUser?.id === id 
            ? { ...state.currentUser, ...updates } 
            : state.currentUser,
        }));
      },

      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }));
      },

      hasPermission: (module, action) => {
        const user = get().currentUser;
        if (!user) return false;
        
        const permission = user.permissions.find((p) => p.module === module);
        if (!permission) return false;

        const actionMap = {
          view: permission.canView,
          create: permission.canCreate,
          edit: permission.canEdit,
          delete: permission.canDelete,
        };

        return actionMap[action];
      },

      canAccessModule: (module) => {
        return get().hasPermission(module, 'view');
      },
    }),
    {
      name: 'funkustoms-auth',
      partialize: (state) => ({
        currentUser: state.currentUser,
        users: state.users,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
