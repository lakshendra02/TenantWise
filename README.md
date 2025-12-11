# TenantWise - Multi-Tenant Material Inventory API

A multi-tenant backend implementation designed to strictly isolate data between different companies (tenants) using a shared database approach. This system manages materials, stocks, and transactions while enforcing plan limits (Free vs Pro).

## Approach

I implemented a **Shared Database, Shared Schema** architecture where all tenants share the same tables, distinguished by a `tenant_id` column (Row-Level Isolation). A custom middleware extracts the `x-tenant-id` header to identify the current tenant context for every request. To ensure strict data security, the Model layer automatically appends a `WHERE tenant_id` clause to every database query. This guarantees that data remains logically isolated, preventing any tenant from accessing or modifying another's inventory, regardless of the operation.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Architecture:** Layered (Controllers, Models, Services)

---

## Multi-Tenant Approach (Architecture)

This project uses a **Shared Database, Shared Schema** strategy with **Row-Level Isolation**.

1.  **Identification:** Every request identifies the tenant via the `x-tenant-id` header.
2.  **Isolation:** A dedicated middleware (`tenantMiddleware`) validates the tenant exists and attaches context to the request.
3.  **Data Security:** Every database query (Model layer) automatically appends `WHERE tenant_id = $1`. This ensures that one tenant can strictly never access another tenant's data, even if they guess a resource ID.
4.  **RBAC:** Role-Based Access Control is implemented to distinguish between Admin and Standard users within a specific tenant.

---

## Project Structure

```
carboledger-backend/
├── src/
│   ├── config/          # Database connection
│   ├── controllers/     # Request logic
│   ├── middlewares/     # Tenant & Role validation
│   ├── models/          # DB queries (Isolation logic lives here)
│   ├── routes/          # API endpoints
│   ├── scripts/         # Automation (Migrations)
│   └── app.js           # Entry point
├── database/
│   └── schema.sql       # Database structure
└── .env                 # Env variables
```

---

## Setup & Installation

### 1. Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- pgAdmin (Optional, for viewing data via GUI)

### 2. Configuration

```bash
git clone https://github.com/lakshendra02/TenantWise.git
cd TenantWise
npm install
```

- Create a .env file in the root directory and add your database credentials:

```bash
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=carboledger
DB_PORT=5432
```

### 3. Database Setup

- Option A:

1.  Log in to your Postgres terminal: `psql -U postgres` (You will be prompted to Enter the password)
2.  Run the following commands found in `database/schema.sql` to create the database and tables:
    - Create DB: `CREATE DATABASE carboledger;`
    - Connect: `\c carboledger`
    - Run the rest of the table creation scripts from `database/schema.sql`.

- Option B:

1. Open pgAdmin (or your preferred SQL tool) and create a new empty database named `carboledger`.
2. Run the migration script to automatically create all tables and enums:

```
npm run migrate
```

### 4. Run the Server

```
npm start
```
