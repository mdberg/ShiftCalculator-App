# PCCM Clinical Work Calculator

## Overview

The PCCM Clinical Work Calculator is a web application designed to help medical professionals calculate total hours worked across shift types and predict future assignments to reach cFTE goal. The application calculates hours for Service, 4th Attending, and Jeopardy shifts, separately tracking weekday and weekend shifts with different hourly rates. Users can input their FTE (Full-Time Equivalent) status to see progress against expected annual hours (1750 hours for full-time).

## Recent Changes

**November 2, 2025:**
- Added FTE (Full-Time Equivalent) input field at the top of the calculator
- FTE accepts decimal values (e.g., 0.8 for 80% of full-time employment)
- Implemented expected annual hours calculation based on FTE × 1750 hours
- Added progress tracking showing:
  - Expected annual hours based on FTE
  - Progress percentage (total hours / expected hours × 100)
  - Remaining hours to meet annual expectation
- Reset button now also resets FTE to default value of 1.0
- Changed 4th Attending Weekday from 10 hours/shift to 2.5 hours/shift
- Added new "Jeopardy and 4th Attending Conversions" section with two fields:
  - Jeopardy: 10 hours/shift
  - 4th Attending: 10 hours/shift
- Added "Call Night" (16 hours/shift) to both Weekday Shifts and Weekend Shifts
- Added new "John Muir" section with one field:
  - Shift: 12 hours/shift
- Updated Weekend Shifts labels to include "Day" suffix (Service Weekend Day, 4th Attending Weekend Day, Jeopardy Weekend Day)
- Implemented "Predictive Analytics" component that suggests shifts needed to complete remaining hours:
  - Service Week (5 Days): 50 hours/shift
  - Service Weekend (2 days): 20 hours/shift
  - Jeopardy OR 4th Attending Week (5 days): 12.5 hours/shift
  - Jeopardy OR 4th Attending Weekend (2 days): 5 hours/shift
  - Call Night: 16 hours/shift
  - John Muir: 12 hours/shift
  - Algorithm allocates Service Week/Weekend in equal cycles (70 hrs per cycle), then routes remaining hours to Jeopardy Week, then Call Night, then John Muir, then Jeopardy Weekend
  - Shows "Remaining after suggestions" when there are leftover hours less than the smallest shift size
  - All predictive fields are editable - users can adjust suggested shifts to plan their schedules flexibly
  - Displays "Over Allocation" warning in red when total suggested hours exceed remaining hours

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework and Build System:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- React Router (Wouter) for lightweight client-side routing
- Single-page application architecture with minimal routing (home page and 404)

**UI Component Library:**
- Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- "New York" style variant with neutral base color scheme
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for theme customization (light/dark mode support)

**Design System:**
- System-based approach inspired by Linear and Notion for clarity and efficiency
- Single-column centered layout (max-w-2xl container)
- Consistent spacing scale (2, 4, 6, 8, 12, 16 Tailwind units)
- Typography hierarchy using Inter font (primary) and JetBrains Mono (numerical displays)
- Responsive design with mobile-first considerations

**State Management:**
- Local component state with React hooks (useState) for form inputs
  - FTE (Full-Time Equivalent) decimal value (default: 1.0)
  - Weekday shift counts (4 categories)
  - Weekend shift counts (4 categories)
  - Conversion shift counts (2 categories)
  - John Muir shift count (1 category)
- TanStack Query (React Query) configured for server state management (though not actively used for API calls)
- No global state management library needed due to simple application scope

**Core Features:**
- Ten shift categories organized in three sections:
  - Weekday Shifts:
    - Service Weekday: 10 hours/shift
    - 4th Attending Weekday: 2.5 hours/shift
    - Jeopardy Weekday: 2.5 hours/shift
    - Call Night: 16 hours/shift
  - Weekend Shifts:
    - Service Weekend: 10 hours/shift
    - 4th Attending Weekend: 2.5 hours/shift
    - Jeopardy Weekend: 2.5 hours/shift
    - Call Night: 16 hours/shift
  - Jeopardy and 4th Attending Conversions:
    - Jeopardy: 10 hours/shift
    - 4th Attending: 10 hours/shift
- Real-time calculation of total hours worked
- FTE-based expected annual hours tracking (FTE × 1750 hours baseline)
- Progress indicators showing completion percentage and remaining hours
- Breakdown display showing calculation details for each shift category
- Predictive Analytics: Suggests optimal shift combinations to meet remaining hours target
- Reset functionality to clear all inputs

**Project Structure:**
- `/client` - Frontend application root
  - `/src/components` - React components (calculator, inputs, results display)
  - `/src/components/ui` - Shadcn/ui component library
  - `/src/pages` - Route-level page components
  - `/src/lib` - Utility functions and query client configuration
  - `/src/hooks` - Custom React hooks

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for API server
- HTTP server creation using Node's built-in `http` module
- Middleware stack includes JSON parsing and logging

**Development Environment:**
- Vite middleware integration for hot module replacement in development
- Custom error overlay plugin for runtime error display
- Replit-specific development tools (cartographer, dev banner) for Replit environment

**API Design:**
- RESTful API structure with `/api` prefix convention
- Currently minimal backend functionality (placeholder routes)
- Request/response logging middleware for debugging

**Project Structure:**
- `/server` - Backend application root
  - `index.ts` - Express server setup and middleware configuration
  - `routes.ts` - API route registration
  - `storage.ts` - Data access layer interface
  - `vite.ts` - Vite development server integration

### Data Storage Solutions

**Current Implementation:**
- In-memory storage using Map data structure (MemStorage class)
- Simple user management interface (getUser, getUserByUsername, createUser)
- UUID-based user ID generation

**Database Configuration (Prepared but Not Active):**
- Drizzle ORM configured for PostgreSQL integration
- Neon serverless PostgreSQL adapter included in dependencies
- Schema defined for users table with username/password fields
- Connection pooling via `connect-pg-simple` for session management
- Migrations directory structure in place (`./migrations`)

**Rationale:**
- In-memory storage chosen for simplicity and immediate functionality
- Database infrastructure prepared for future data persistence needs
- Drizzle ORM provides type-safe database queries when activated

### External Dependencies

**UI and Component Libraries:**
- Radix UI - Unstyled, accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- Shadcn/ui - Pre-styled component implementations built on Radix
- Lucide React - Icon library for consistent iconography
- CMDK - Command palette component
- Embla Carousel - Carousel/slider functionality
- Vaul - Drawer component for mobile interactions

**Styling:**
- Tailwind CSS - Utility-first CSS framework
- PostCSS - CSS processing and autoprefixing
- Class Variance Authority (CVA) - Type-safe component variant styling
- clsx & tailwind-merge - Class name utilities

**Form Handling:**
- React Hook Form - Form state management and validation
- Hookform Resolvers - Validation schema integration
- Zod - Runtime type validation
- Drizzle-Zod - Database schema to Zod validation conversion

**Data Fetching:**
- TanStack Query (React Query) - Server state management
- Built-in fetch API for HTTP requests

**Date Utilities:**
- date-fns - Date manipulation and formatting

**Development Tools:**
- TypeScript - Static type checking
- ESBuild - Fast JavaScript bundling for production
- TSX - TypeScript execution for development server
- Drizzle Kit - Database migration and schema management tools
- Replit plugins - Development environment enhancements (error overlay, cartographer, dev banner)

**Database (Configured, Not Implemented):**
- @neondatabase/serverless - Serverless PostgreSQL client
- Drizzle ORM - Type-safe database ORM
- connect-pg-simple - PostgreSQL session store

**Fonts:**
- Google Fonts API - Inter (primary UI) and JetBrains Mono (monospace for numbers)