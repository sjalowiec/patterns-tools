# Wizard Builder System

## Overview

The Wizard Builder is a comprehensive system for creating professional knitting pattern generator wizards. It utilizes a modular "lego block" architecture with reusable components, shared calculation logic, and a unified olive green theme. The system currently includes wizards for Neckline/Shoulder Practice, Blanket Patterns, Rectangle/Square, Neckline Shaping, Boat Neck Sweaters, and a Gauge Calculator, with infrastructure to easily build additional tools. Its purpose is to provide knitters with precise, customizable patterns and calculations, improving efficiency and accuracy in knitting projects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite.
- **UI Library**: Radix UI components with shadcn/ui styling.
- **Styling**: Tailwind CSS with custom CSS variables.
- **Routing**: Wouter.
- **State Management**: React hooks for local state, TanStack Query for server state.

### Lego Block Architecture
The system employs reusable components in `client/src/components/lego/` for modularity and consistency across wizards. Key components include:
- **SiteHeader/SiteFooter**: Fetches and displays global header/footer HTML with script re-execution for interactivity.
- **GaugeInputs**: Standardized gauge measurement inputs.
- **PanelSchematic**: Universal schematic component displaying knitting panels, supporting both rectangular and trapezoidal shapes for body and sleeve pieces.
- **SizeSelector**: Card-based size selection with category grouping.
- **Print/PDF Components**: `PrintOnlyTitle`, `PrintHeader`, `PrintFooter` for formatted output.
- **Hooks**: `useGaugeCalculations` for unit-aware gauge logic and `useSleeveDropShoulder` for drop shoulder sleeve pattern generation, including row-based instructions for machine knitters.

This architecture ensures that changes to a lego block affect all wizards, promoting efficiency.

### Component Structure
Individual wizards are independent files, each focusing on a specific pattern generation task (e.g., `BoatNeckWizard.tsx`, `BlanketWizard.tsx`). They leverage the shared lego blocks, a central calculation engine, an instruction generator, and an SVG schematic generator for visual output.

### Design System
- **CSS Integration**: Uses `sweater_planner_css.css` for consistent styling.
- **Typography**: Inter font family from Google Fonts.
- **Layout**: Single-page design with clear sections for inputs, instructions, and schematics.
- **Professional Styling**: Utilizes `wizard-container`, `well_white`, and `text-primary` CSS classes.

### Backend Architecture
- **Server**: Express.js with TypeScript.
- **Storage Interface**: Abstracted storage layer (in-memory implementation).
- **API Structure**: RESTful endpoints with JSON responses.

### Data Management
- **Client-Side Calculation**: Pure calculation tool with no database persistence.
- **Dynamic Updates**: Real-time calculation updates.
- **Validation**: Robust input validation.
- **External Data Loading**: Wizards like `BlanketWizard` fetch sizing data from external URLs (e.g., `https://sizing-data.knitbymachine.com/sizing_blankets.json`) for easy updates.
- **Print/PDF Generation**: Uses html2pdf.js for creating PDF outputs, including inline header/footer content.
- **UI Optimization**: Build UI elements are hidden in print/PDF output using the `.no-print` class.

### Build and Development
- **Development Server**: Vite for hot reload and error overlay.
- **Production Build**: ESBuild for server bundling, Vite for client assets.
- **TypeScript**: Strict mode with path mapping and shared types.
- **Code Quality**: Configured with proper TypeScript compiler options.

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting.
- **Drizzle ORM**: Type-safe database queries.

### UI and Styling
- **Radix UI**: Component primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Google Fonts**: For typography (Inter font).
- **Lucide Icons**: Icon library.

### Development Tools
- **Vite**: Build tool.
- **TanStack Query**: Server state management.
- **React Hook Form**: Form validation.
- **Wouter**: Routing library.

### Session and Authentication
- **Express Session**: Session management.
- **Crypto**: Node.js built-in for UUID generation.

### Validation and Types
- **Zod**: Runtime type validation.
- **Drizzle Zod**: Integration for Drizzle schemas.
- **TypeScript**: For type safety.