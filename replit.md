# Wizard Builder System

## Overview

The Wizard Builder is a comprehensive system for creating professional knitting pattern generator wizards. The system uses modular "lego block" architecture with reusable components, shared calculation logic, and a unified olive green theme. Currently includes the Neckline/Shoulder Practice Wizard and Blanket Pattern Wizard, with infrastructure to easily build additional wizards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables and design tokens
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks for local state, TanStack Query for server state management

### Lego Block Architecture
The system provides reusable wizard components in `client/src/components/lego/`:
- **GaugeInputs**: Gauge measurement inputs with dynamic placeholders (per 4"/10cm)
- **RadioGroup**: Styled radio groups with olive green accent color
- **SizeSelector**: Card-based size selector with category grouping and selection states
- **RoundIconButton**: 56px mobile-friendly icon buttons with labels
- **WizardActionBar**: Flex layout with warning box + action buttons
- **useGaugeCalculations**: Hook for unit-aware gauge calculations (4" vs 10cm)

All components use CSS variables for theming and are fully reusable across wizards.

### Component Structure
Individual wizards include:
- **NecklineWizard.tsx**: Neckline/shoulder practice calculator with SVG schematics
- **BlanketWizard.tsx**: Blanket pattern generator with yarn calculations
- **Gauge Input System**: Unit selection (inches/cm) with conversion from 4"/10cm to per-unit values  
- **Calculation Engine**: Shared calculation logic via hooks and utilities
- **Instruction Generator**: Clear step-by-step text output for knitting practice
- **SVG Schematic Generator**: Japanese-style technical diagrams with curved necklines
- **Validation System**: Prevents NaN errors and handles edge cases gracefully

### Design System
- **CSS Integration**: Uses existing sweater_planner_css.css for consistent styling
- **Typography**: Inter font family via Google Fonts with clean, readable interface
- **Layout**: Single-page design with gauge inputs, instructions, and schematic sections
- **Visual Hierarchy**: Well-structured sections with clear headings and organized content
- **Professional Styling**: Uses wizard-container, well_white, and text-primary CSS classes

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Development**: Hot module replacement via Vite integration
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **API Structure**: RESTful endpoints with JSON responses

### Data Management
- **Client-Side Calculator**: No database persistence needed - pure calculation tool
- **Dynamic Updates**: All calculations update in real-time as gauge inputs change
- **Validation**: Robust input validation prevents calculation errors
- **Template System**: SVG uses placeholder replacement for dynamic values

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