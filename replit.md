# Sweater Planning Wizard

## Overview

The Sweater Planning Wizard is a web-based knitting calculator that helps users determine stitch counts and shaping instructions for sweater construction. The application provides a step-by-step wizard interface where users input their gauge measurements and receive calculated stitch counts, row counts, and detailed neckline shaping instructions with visual SVG diagrams.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables and design tokens
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks for local state, TanStack Query for server state management

### Component Structure
The application follows a modular component architecture with:
- **Wizard Components**: Step-by-step form navigation with progress tracking
- **Form Components**: Gauge input forms with validation
- **Visualization Components**: SVG-based sweater diagrams with responsive design
- **UI Components**: Comprehensive component library based on Radix UI primitives

### Design System
- **Color Palette**: Navy blue primary (#2c5282), teal accents (#4299e1), with semantic color tokens
- **Typography**: Inter font family via Google Fonts with consistent scale
- **Layout**: Mobile-first responsive design with Tailwind spacing primitives
- **Visual Hierarchy**: Card-based layouts with subtle borders and shadows

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Development**: Hot module replacement via Vite integration
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **API Structure**: RESTful endpoints with JSON responses

### Data Management
- **Database**: PostgreSQL configured via Drizzle ORM
- **Schema**: User authentication system with username/password
- **Migrations**: Drizzle Kit for schema management and migrations
- **Connection**: Neon Database serverless PostgreSQL integration

### Build and Development
- **Development Server**: Vite with hot reload and error overlay
- **Production Build**: ESBuild for server bundling, Vite for client assets
- **TypeScript**: Strict mode with path mapping and shared types
- **Code Quality**: Configured with proper TypeScript compiler options

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting via `@neondatabase/serverless`
- **Drizzle ORM**: Type-safe database queries and schema management

### UI and Styling
- **Radix UI**: Comprehensive component primitives for accessible UI elements
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Google Fonts**: Inter font family for consistent typography
- **Lucide Icons**: Icon library for UI elements

### Development Tools
- **Vite**: Build tool with React plugin and runtime error handling
- **TanStack Query**: Server state management and data fetching
- **React Hook Form**: Form validation with Zod schema integration
- **Wouter**: Lightweight routing library

### Session and Authentication
- **Express Session**: Session management with PostgreSQL store via `connect-pg-simple`
- **Crypto**: Built-in Node.js crypto for UUID generation

### Validation and Types
- **Zod**: Runtime type validation and schema definition
- **Drizzle Zod**: Integration between Drizzle schemas and Zod validation
- **TypeScript**: Full type safety across client and server