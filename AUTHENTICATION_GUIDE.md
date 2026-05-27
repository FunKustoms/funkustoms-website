# Authentication & Role-Based Access Control Guide

## Overview
The admin panel now includes a complete authentication system with role-based access control (RBAC). Different user roles have access to different parts of the admin interface.

## User Roles

### 1. Super Admin
- **Full Access**: Can access all features and modules
- **Permissions**: 
  - Dashboard with revenue and analytics
  - Products management
  - Orders management
  - User management (invite, edit, delete users)
  - Coupons management
  - Integrations
  - Settings
  - All reporting and financial data

### 2. Website Admin
- **Development Tools Only**: Access to development tools but NOT revenue/reporting
- **Permissions**:
  - ✅ Products management
  - ✅ Orders management (view only, no revenue data)
  - ✅ Integrations
  - ✅ Settings
  - ❌ Dashboard (no access to revenue/analytics)
  - ❌ Financial reporting
  - ❌ User management
  - ❌ Coupons management

### 3. Author
- **Blog Management Only**: Can only edit, create, and read blogs
- **Permissions**:
  - ✅ Blog posts (create, edit, delete)
  - ❌ Products
  - ❌ Orders
  - ❌ Dashboard
  - ❌ Settings
  - ❌ User management

### 4. Inventory
- **Product Management Only**: Can add, remove, and create products
- **Permissions**:
  - ✅ Products (add, edit, delete, manage stock)
  - ❌ Orders
  - ❌ Dashboard
  - ❌ Blog posts
  - ❌ Settings
  - ❌ User management

## Demo Credentials

### For Testing:

1. **Super Admin**
   - Email: `admin@funkustoms.com`
   - Password: `admin123`
   - Access: Everything

2. **Website Admin**
   - Email: `dev@funkustoms.com`
   - Password: `dev123`
   - Access: Development tools only

3. **Author**
   - Email: `writer@funkustoms.com`
   - Password: `writer123`
   - Access: Blog management only

4. **Inventory Manager** (Currently Invited, not active)
   - Email: `inventory@funkustoms.com`
   - Status: Invited
   - Access: Product management when activated

## How to Use

### Accessing Admin Panel

1. Navigate to: `http://localhost:5174/admin`
2. You'll be automatically redirected to login if not authenticated
3. Use any of the demo credentials above
4. The dashboard will show only the modules you have access to

### User Management (Super Admin Only)

1. Login as Super Admin
2. Navigate to **Users** in the sidebar
3. Click **Invite User** button
4. Fill in:
   - Name
   - Email
   - Select Role (Website Admin, Author, or Inventory)
5. Review permissions preview
6. Click **Send Invitation**

### Testing Different Roles

**To test as Super Admin:**
```
Login → See full dashboard with revenue charts
Sidebar shows: Dashboard, Products, Orders, Users, Coupons, Integrations, Settings
```

**To test as Website Admin:**
```
Login → Redirected to Products page (no dashboard access)
Sidebar shows: Products, Orders, Integrations, Settings
Cannot see: Dashboard, Users, Coupons
```

**To test as Author:**
```
Login → Redirected to Blog page
Sidebar shows: Only Blog-related navigation
Cannot see: Products, Orders, Dashboard, etc.
```

**To test as Inventory:**
```
Login → Redirected to Products page
Sidebar shows: Only Products
Cannot see: Orders, Dashboard, Settings, etc.
```

### Logging Out

1. Scroll to bottom of sidebar
2. You'll see your profile info:
   - Avatar with initials
   - Name and email
   - Role badge
3. Click **Logout** button
4. Confirm logout
5. Redirected to login page

## Security Features

1. **Protected Routes**: All admin routes require authentication
2. **Role Verification**: Navigation items filtered based on role permissions
3. **Session Persistence**: User session saved in localStorage
4. **Permission Checks**: Fine-grained permission system for each module
5. **Logout Confirmation**: Prevents accidental logouts

## Permission Matrix

| Module | Super Admin | Website Admin | Author | Inventory |
|--------|-------------|---------------|--------|-----------|
| Dashboard (Revenue) | ✅ | ❌ | ❌ | ❌ |
| Products | ✅ | ✅ | ❌ | ✅ |
| Orders | ✅ | ✅ (view only) | ❌ | ❌ |
| Users | ✅ | ❌ | ❌ | ❌ |
| Coupons | ✅ | ❌ | ❌ | ❌ |
| Integrations | ✅ | ✅ | ❌ | ❌ |
| Settings | ✅ | ✅ | ❌ | ❌ |
| Blogs | ✅ | ❌ | ✅ | ❌ |

## Technical Implementation

### Files Modified:
- **src/store/auth.ts**: Authentication state management
- **src/pages/admin/AdminLogin.tsx**: Login page with demo credentials
- **src/pages/admin/AdminUsers.tsx**: User management interface
- **src/components/admin/AdminLayout.tsx**: Role-based navigation filtering
- **src/App.tsx**: Public login route + protected admin routes

### Key Functions:
```typescript
// Check if user is authenticated
const { isAuthenticated } = useAuthStore();

// Get current user
const { currentUser } = useAuthStore();

// Check specific permission
const canEdit = useAuthStore().hasPermission('edit');

// Check module access
const canAccessProducts = useAuthStore().canAccessModule('products');

// Login
await login(email, password);

// Logout
logout();
```

## Next Steps

### For Production:
1. Replace demo credentials with real authentication API
2. Implement password reset functionality
3. Add two-factor authentication (2FA)
4. Implement real email invitation system
5. Add activity logging for security auditing
6. Set up proper session timeout
7. Implement refresh tokens

### For Development:
1. Test each role thoroughly
2. Add more granular permissions as needed
3. Implement blog management pages for Authors
4. Add inventory-specific views for stock management
5. Create permission denied pages (403 errors)

## Troubleshooting

**Issue**: Can't login
- **Solution**: Make sure you're using exact demo credentials (case-sensitive)

**Issue**: Redirected to login after authentication
- **Solution**: Check browser console for errors, clear localStorage

**Issue**: Not seeing expected navigation items
- **Solution**: Verify your role permissions in the permission matrix above

**Issue**: Changes not persisting
- **Solution**: Auth state is saved in localStorage, check browser storage

## Support

For issues or questions:
1. Check browser console for errors
2. Verify you're using correct demo credentials
3. Clear browser cache and localStorage
4. Restart development server

---

**Last Updated**: 2024
**Version**: 1.0.0
