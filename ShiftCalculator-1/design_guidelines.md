# Shift Hours Calculator - Design Guidelines

## Design Approach
**System-Based Approach**: Inspired by productivity tools like Linear and Notion, prioritizing clarity, efficiency, and data hierarchy. This is a utility-focused application where precision and usability are paramount.

## Layout System

**Container Structure:**
- Single-column centered layout with max-w-2xl container
- Consistent spacing using Tailwind units: 2, 4, 6, 8, 12, 16
- Responsive padding: p-4 on mobile, p-8 on desktop
- Section spacing: space-y-8 between major sections

**Grid Organization:**
- Weekday shifts group: First three categories together
- Weekend shifts group: Last three categories together
- Each input row uses grid layout with label and input field
- Results section uses card-based display

## Typography

**Font Family:**
- Primary: Inter (Google Fonts) for clean, modern readability
- Monospace: JetBrains Mono for numerical displays

**Hierarchy:**
- Page Title: text-3xl, font-bold (App header)
- Section Headers: text-xl, font-semibold (Weekday/Weekend group headers)
- Input Labels: text-sm, font-medium (Shift category names)
- Results: text-2xl, font-bold for total hours
- Breakdown: text-base for individual calculations

## Component Library

**Form Inputs:**
- Number inputs with explicit step controls
- Input styling: border-2, rounded-lg, px-4, py-3
- Focus states with ring treatment
- Disabled state for read-only fields
- Helper text showing hours per shift (e.g., "10 hrs/shift")

**Results Display:**
- Primary card: Large total hours prominently displayed
- Breakdown section: List of categories with calculated hours
- Format: "Category Name: X shifts × Y hrs = Z total hrs"
- Visual separation between input and output sections

**Section Groups:**
- Weekday Shifts section with subtle background treatment
- Weekend Shifts section with matching treatment
- Clear visual distinction using border and rounded corners
- Compact spacing (space-y-4) within groups

**Buttons:**
- Reset/Clear button with secondary styling
- Calculate button (if not real-time) with primary prominence
- Medium size (px-6, py-3) for comfortable interaction

## Interaction Patterns

**Real-time Calculation:**
- Immediate updates as users type
- No submit button required
- Smooth transitions for number changes

**Input Validation:**
- Only accept non-negative numbers
- Visual feedback for invalid entries
- Min value of 0 enforced
- Decimal precision limited to 1 decimal place

**Breakdown Display:**
- Show calculations only for categories with entered shifts
- Hide zero-value categories from breakdown to reduce clutter
- Display running calculation formula for transparency

## Layout Specifications

**Header Section:**
- App title centered at top
- Optional subtitle explaining purpose: "Calculate total work hours across shift categories"
- Spacing: mb-8

**Input Section:**
- Two grouped sections with headers: "Weekday Shifts" and "Weekend Shifts"
- Each category row: Label (left) + Input field (right) in grid
- Grid: grid-cols-[1fr,120px] for label and compact input
- Row spacing: space-y-3 within each group

**Results Section:**
- Positioned below inputs with mt-12 separation
- Total hours in large, prominent card: p-8, text-center
- Breakdown list below total with p-6
- Clear visual hierarchy: Total > Breakdown items

## Accessibility

**Form Accessibility:**
- All inputs have associated labels with htmlFor
- ARIA labels for screen readers
- Logical tab order through form
- Clear focus indicators (ring-2)
- Sufficient contrast ratios throughout

**Numerical Precision:**
- Display totals with 1 decimal place (e.g., "42.5 hours")
- Consistent formatting across all numerical displays

## Visual Enhancements

**Micro-interactions:**
- Subtle scale on input focus
- Smooth number transitions in total display (no animation libraries needed)
- Gentle highlight on calculation update

**Visual Feedback:**
- Input borders respond to focus states
- Results card has subtle shadow for elevation
- Updated values briefly highlight to show change

## Responsive Behavior

**Mobile (< 768px):**
- Stack labels above inputs (grid-cols-1)
- Reduce padding: p-4
- Font sizes: Scale down title to text-2xl

**Desktop (≥ 768px):**
- Side-by-side label and input
- Full padding and spacing
- Optional: Show all breakdowns in two-column grid

**No Images Required**: This is a pure utility calculator with no hero section or imagery needs.