# Wizard Builder System

## Overview

The Wizard Builder is a comprehensive system for creating professional knitting pattern generator wizards. The system uses modular "lego block" architecture with reusable components, shared calculation logic, and a unified olive green theme. Currently includes the Neckline/Shoulder Practice Wizard, Blanket Pattern Wizard, Rectangle/Square Wizard, Neckline Shaping Wizard, Boat Neck Sweater Wizard, and infrastructure to easily build additional wizards.

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
- **PanelSchematic**: Universal knitting panel schematic component displaying bottom-to-top orientation (cast-on at bottom, armhole/cap at top) for all sweater pieces
- **RadioGroup**: Styled radio groups with olive green accent color
- **SchematicWrapper**: Centered SVG diagram wrapper with consistent padding and proper sizing
- **SizeSelector**: Card-based size selector with category grouping and selection states
- **RoundIconButton**: 56px mobile-friendly icon buttons with labels
- **WizardActionBar**: Flex layout with warning box + action buttons
- **StickyActionButtons**: Sticky action buttons (Print, Download PDF, Start Over) that float at top with transparent background while scrolling
- **WarningBox**: Reusable warning message box with olive green styling for important notices
- **PrintOnlyTitle**: Print/PDF-only title section (hidden on screen, visible in print output)
- **PrintHeader**: Print-only header using "Shadows Into Light Two" Google Font with KnitbyMachine branding (#649841 green) and URL (hidden on screen, visible in print/PDF)
- **PrintFooter**: Print-only footer with copyright, URL, generation date, and page numbers (hidden on screen, visible in print/PDF)
- **useGaugeCalculations**: Hook for unit-aware gauge calculations (4" vs 10cm)
- **useSleeveDropShoulder**: Hook for drop shoulder sleeve pattern generation with external sizing data

All components use CSS variables for theming and are fully reusable across wizards.

### Component Structure
Individual wizards include:
- **NecklineWizard.tsx**: Neckline/shoulder practice calculator with SVG schematics
- **BlanketWizard.tsx**: Blanket pattern generator with yarn calculations and external JSON data loading
- **RectangleWizard.tsx**: Rectangle/square pattern calculator with customizable dimensions
- **NecklineShapingWizard.tsx**: Neckline shaping calculator for sweater construction
- **BoatNeckWizard.tsx**: Boat neck sweater pattern generator with optional sleeves using useSleeveDropShoulder hook
- **SleeveWizard.tsx**: Testing page for drop shoulder sleeve calculations
- **Gauge Input System**: Unit selection (inches/cm) with conversion from 4"/10cm to per-unit values  
- **Calculation Engine**: Shared calculation logic via hooks and utilities
- **Instruction Generator**: Clear step-by-step text output for knitting practice
- **SVG Schematic Generator**: Japanese-style technical diagrams with curved necklines
- **Validation System**: Prevents NaN errors and handles edge cases gracefully
- **Print/PDF System**: Print-only header/footer components with proper formatting for physical and PDF output

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
- **External Data Loading**: BlanketWizard fetches sizing data from external URL (https://sizing-data.knitbymachine.com/sizing_blankets.json) with cache-busting for easy updates without code changes
- **Print/PDF Generation**: Uses html2pdf.js for PDF generation with inline header/footer content to work around @media print limitations
- **Sticky UI Elements**: Action buttons stick to top of viewport while scrolling with transparent background for clean floating appearance
- **Print Optimization**: All build UI elements (gauge inputs, size cards, yarn calculator, buttons) hidden in print/PDF using `.no-print` class

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