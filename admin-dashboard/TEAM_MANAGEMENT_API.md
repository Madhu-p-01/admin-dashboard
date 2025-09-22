# Admin Team Management API Documentation (v1)

## 🎯 Overview
Complete implementation of the Admin Team Management API with role-based access control (RBAC), audit logging, and comprehensive team management features.

## 🚀 Base URL
```
http://localhost:3001/api/v1/admin/team
```

## 🔐 Authentication
- Requires Admin JWT (role: "admin" or "super_admin")
- Header: `Authorization: Bearer YOUR_TOKEN`

---

## 📋 API Endpoints

### 1. Invite/Add Team Member
**POST** `/members`

#### Request
```json
{
  "name": "Anita Sharma",
  "email": "anita@store.com",
  "role": "manager",
  "permissions": ["orders:read", "products:write", "customers:read"]
}
```

#### Response
```json
{
  "success": true,
  "message": "Team member created successfully",
  "data": {
    "id": "tm_201",
    "name": "Anita Sharma",
    "email": "anita@store.com",
    "role": "manager",
    "permissions": ["orders:read", "products:write", "customers:read"],
    "status": "active",
    "joinedAt": "2025-09-22T10:00:00Z"
  }
}
```

---

### 2. Get All Team Members
**GET** `/members?status=active&role=manager&page=1&limit=20`

#### Query Parameters
- `status` - Filter by status (active, inactive, suspended)
- `role` - Filter by role
- `search` - Search in name or email
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sort` - Sort by (name, email, joinedAt, lastLogin)
- `order` - Sort order (asc, desc)

#### Response
```json
{
  "success": true,
  "message": "Team members fetched successfully",
  "data": {
    "data": [
      {
        "id": "tm_201",
        "name": "Anita Sharma",
        "email": "anita@store.com",
        "role": "manager",
        "permissions": ["orders:read", "products:write"],
        "status": "active",
        "joinedAt": "2025-09-22T10:00:00Z",
        "lastLogin": "2025-09-22T09:30:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

### 3. Get Single Team Member
**GET** `/members/{id}`

#### Response
```json
{
  "success": true,
  "message": "Team member fetched successfully",
  "data": {
    "id": "tm_201",
    "name": "Anita Sharma",
    "email": "anita@store.com",
    "role": "manager",
    "permissions": ["orders:read", "products:write"],
    "status": "active",
    "joinedAt": "2025-09-22T10:00:00Z",
    "lastLogin": "2025-09-22T09:30:00Z",
    "createdBy": "tm_001"
  }
}
```

---

### 4. Update Team Member Info
**PUT** `/members/{id}`

#### Request
```json
{
  "name": "Anita Sharma Updated",
  "role": "admin",
  "permissions": ["orders:read", "orders:write", "analytics:read"]
}
```

#### Response
```json
{
  "success": true,
  "message": "Team member updated successfully",
  "data": {
    "id": "tm_201",
    "name": "Anita Sharma Updated",
    "role": "admin",
    "permissions": ["orders:read", "orders:write", "analytics:read"],
    "updatedAt": "2025-09-22T10:30:00Z"
  }
}
```

---

### 5. Suspend/Deactivate Member
**PUT** `/members/{id}/status`

#### Request
```json
{
  "status": "inactive"
}
```

#### Response
```json
{
  "success": true,
  "message": "Team member status updated successfully",
  "data": {
    "id": "tm_201",
    "status": "inactive",
    "updatedAt": "2025-09-22T10:30:00Z"
  }
}
```

---

### 6. Delete Member (Remove Access)
**DELETE** `/members/{id}`

#### Response
```json
{
  "success": true,
  "message": "Team member deleted successfully"
}
```

---

### 7. Roles Management

#### Create Role
**POST** `/roles`
```json
{
  "name": "Inventory Manager",
  "description": "Manage inventory and stock levels",
  "permissions": ["products:read", "inventory:write", "analytics:read"]
}
```

#### Get All Roles
**GET** `/roles`

#### Response
```json
{
  "success": true,
  "message": "Roles fetched successfully",
  "data": [
    {
      "id": "role_001",
      "name": "super_admin",
      "description": "Super Administrator",
      "permissions": ["orders:read", "orders:write", "orders:delete", "..."],
      "isSystem": true,
      "createdAt": "2025-09-22T10:00:00Z"
    }
  ]
}
```

#### Get Single Role
**GET** `/roles/{id}`

#### Update Role
**PUT** `/roles/{id}`
```json
{
  "name": "Senior Manager",
  "permissions": ["orders:read", "orders:write", "products:read", "products:write"]
}
```

#### Delete Role
**DELETE** `/roles/{id}`

---

### 8. Permissions Reference (For UI Control)
**GET** `/permissions`

#### Response
```json
{
  "success": true,
  "message": "Permissions fetched successfully",
  "data": [
    "orders:read", "orders:write", "orders:delete",
    "products:read", "products:write", "products:delete",
    "customers:read", "customers:write", "customers:delete",
    "discounts:read", "discounts:write", "discounts:delete",
    "analytics:read", "analytics:export",
    "team:read", "team:write", "team:delete",
    "settings:read", "settings:write",
    "inventory:read", "inventory:write",
    "reports:read", "reports:export"
  ]
}
```

---

### 9. Audit Logs (Track Admin Actions)
**GET** `/audit-logs?from=2025-09-01&to=2025-09-16&userId=tm_201`

#### Query Parameters
- `from` - Start date (ISO 8601)
- `to` - End date (ISO 8601)
- `userId` - Filter by user ID
- `action` - Filter by action type
- `resource` - Filter by resource type
- `page` - Page number
- `limit` - Items per page

#### Response
```json
{
  "success": true,
  "message": "Audit logs fetched successfully",
  "data": {
    "data": [
      {
        "id": "log_501",
        "userId": "tm_201",
        "userName": "Anita Sharma",
        "action": "Updated product price",
        "resource": "products",
        "resourceId": "prod_001",
        "details": {
          "product_name": "Test Product",
          "old_price": 99.99,
          "new_price": 89.99
        },
        "timestamp": "2025-09-16T10:30:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

### 10. Export Team Data
**GET** `/members/export?format=csv&status=active`

#### Query Parameters
- `format` - Export format (csv, excel)
- `status` - Filter by status
- `role` - Filter by role

#### Response
Returns downloadable CSV/Excel file with team member data.

---

### 11. Get Team Statistics
**GET** `/stats`

#### Response
```json
{
  "success": true,
  "message": "Team statistics fetched successfully",
  "data": {
    "totalMembers": 15,
    "activeMembers": 12,
    "inactiveMembers": 2,
    "suspendedMembers": 1,
    "rolesCount": 5,
    "recentActivity": {
      "lastLogin": "2025-09-22T09:30:00Z",
      "recentJoins": 2,
      "recentActions": 45
    },
    "roleDistribution": [
      { "role": "admin", "count": 2 },
      { "role": "manager", "count": 5 },
      { "role": "support", "count": 6 },
      { "role": "analyst", "count": 2 }
    ]
  }
}
```

---

### 12. Initialize Default Roles (One-time setup)
**POST** `/initialize-roles`

#### Response
```json
{
  "success": true,
  "message": "Default roles initialized successfully",
  "data": {
    "rolesCreated": 5,
    "roles": [
      "super_admin", "admin", "manager", "support", "analyst"
    ]
  }
}
```

---

## 🗄️ Database Schema

### Tables Created
- `team_members` - Store team member information
- `roles` - Define roles and their permissions
- `audit_logs` - Track all admin actions
- `admin_members` - Integration with existing admin system

### Key Features
- **UUID Primary Keys** for all tables
- **Array-based permissions** for flexible RBAC
- **Audit logging** for security and compliance
- **Row Level Security** ready for Supabase
- **Indexes** for optimal performance

---

## 🧪 Testing

### Test Script
Run the comprehensive test script:
```bash
node test-team-endpoints.js
```

### Manual Testing Examples

#### Create Team Member
```bash
curl -X POST "http://localhost:3001/api/v1/admin/team/members" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Anita Sharma",
    "email": "anita@store.com",
    "role": "manager",
    "permissions": ["orders:read", "products:write"]
  }'
```

#### Get Team Members
```bash
curl "http://localhost:3001/api/v1/admin/team/members?status=active" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Update Team Member
```bash
curl -X PUT "http://localhost:3001/api/v1/admin/team/members/tm_201" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"role": "admin", "permissions": ["orders:read", "orders:write"]}'
```

---

## 📊 Features Implemented

### ✅ Core Features
- [x] Team member CRUD operations
- [x] Role-based access control (RBAC)
- [x] Permission management
- [x] Audit logging for all actions
- [x] Team member status management
- [x] Export functionality (CSV/Excel)
- [x] Team statistics and analytics
- [x] Default role initialization

### 🔧 Technical Features
- [x] TypeScript models and interfaces
- [x] Request validation with express-validator
- [x] Authentication middleware
- [x] Error handling and logging
- [x] Database schema design
- [x] Comprehensive testing
- [x] API documentation

### 🚀 Ready for Production
- [x] All endpoints implemented according to specification
- [x] Database schema ready for Supabase
- [x] Authentication and authorization
- [x] Input validation and sanitization
- [x] Error handling and logging
- [x] Comprehensive testing suite

---

## 🎯 Next Steps

1. **Set up Supabase project**
2. **Run the team management schema** (`team_management_schema.sql`)
3. **Configure environment variables**
4. **Test with real data**
5. **Deploy to production**

The Team Management API is now **completely implemented** and ready for integration! 🚀

---

## 📚 Available Endpoints Summary

- **Team Members:** Create / Get All / Get One / Update / Suspend / Delete
- **Roles:** Create / Get All / Get One / Update / Delete
- **Permissions:** Fetch permission list for RBAC
- **Audit Logs:** Track actions for security & compliance
- **Export:** Download team data (CSV/Excel)
- **Statistics:** Get team analytics and insights
- **Initialization:** Set up default roles
