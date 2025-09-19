# Sweater Planning Wizard Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern step-by-step interfaces like Notion setup wizards and Linear onboarding flows, emphasizing clarity and progressive disclosure for technical knitting calculations.

## Color Palette
- **Primary**: 210 85% 25% (Deep navy blue for trust and precision)
- **Secondary**: 210 15% 95% (Light gray for backgrounds)
- **Accent**: 165 75% 45% (Teal for progress indicators and highlights)
- **Text**: 210 20% 15% (Dark charcoal)
- **Success**: 145 70% 40% (Forest green for completed steps)

## Typography
- **Primary Font**: Inter via Google Fonts CDN
- **Headings**: Inter 600 (Semi-bold)
- **Body Text**: Inter 400 (Regular)
- **Labels**: Inter 500 (Medium)
- **Scale**: text-sm, text-base, text-lg, text-xl, text-2xl

## Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8 (p-4, m-6, gap-8)
- Consistent 6-unit spacing between major sections
- 4-unit spacing for form elements
- 2-unit spacing for tight groupings

## Component Library

### Core Components
- **Progress Indicator**: Horizontal stepper with numbered circles and connecting lines
- **Input Groups**: Labeled form fields with validation states
- **Result Cards**: Clean cards displaying calculations with visual hierarchy
- **Navigation Controls**: Primary/secondary button styling with clear CTAs

### Wizard Structure
- **Step 1**: Form-focused layout with gauge inputs and measurement selection
- **Step 2**: Results-oriented layout featuring the SVG diagram prominently
- **Fixed Footer**: Navigation controls always accessible

### Visual Hierarchy
- Large, clear step titles (text-2xl)
- Grouped form sections with subtle borders
- Prominent "Calculate" and navigation buttons
- Clean result presentation with calculated values highlighted

## Interactive Elements
- **Form Validation**: Inline error states with red borders and helper text
- **Progress Tracking**: Visual completion indicators
- **Responsive Behavior**: Mobile-first approach with stacked layouts on small screens

## SVG Diagram Specifications
- Clean line art style with minimal colors
- Measurement labels positioned clearly outside garment outline
- Consistent line weights and typography matching the interface
- Responsive sizing to container with maintained aspect ratio

The design emphasizes technical precision while maintaining approachability, using the provided CSS structure to create a professional knitting tool that feels both authoritative and user-friendly.