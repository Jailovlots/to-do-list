# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### To-Do List Mobile App (`artifacts/todo-app`)
- **Type**: Expo (React Native) mobile app
- **Preview Path**: `/`
- **Tech**: Expo Router, React Native, AsyncStorage
- **Features**:
  - Main Menu with Add, View, Update, Delete, Exit
  - Add Task screen with title, description, due date
  - View Tasks with filter by All / Pending / Completed
  - Edit Task screen with status toggle (pending/completed)
  - Delete confirmation dialogs
  - AsyncStorage persistence
  - Overdue date detection
  - Task stats on main menu
  - Goodbye screen
- **Colors**: Indigo/violet purple theme (`#6c63ff`)
- **Packages added**: `@react-native-async-storage/async-storage`, `@react-native-community/datetimepicker`
