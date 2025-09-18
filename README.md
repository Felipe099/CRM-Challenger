# Mini Seller Console

A modern React application for lead management and sales opportunity conversion. Built with React, TypeScript, and Tailwind CSS, it offers an intuitive interface for salespeople to efficiently manage their pipeline.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Felipe099/CRM-teste.git
cd CRM-teste
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm install
```

Obs: The app should now be running at http://localhost:3000 (or the port specified by Vite).

## Implemented Features

#### 1. Lead List

-   **Data loading**: Local JSON with fallback to localStorage
-   **Full fields**: ID, name, company, email, source, score, status
-   **Filter features**:
    -   Search by name, company, or email (real-time search)
    -   Status filter (New, In Contact, Qualified, Disqualified, Closed)
    -   Sorting by score (ascending/descending)

#### 2. Lead Detail Panel

-   **Slide panel interface**: Responsive side panel
-   **Inline editing**: Editable status and email
-   **Robust validation**: Email format validation
-   **Operation states**: Save/cancel with visual feedback

#### 3. Conversion to Opportunity

-   **Conversion button**: "Convert Lead" with loading states
-   **Opportunity creation**: Complete structure with ID, name, stage, value, accountName
-   **Prospects table**: Dedicated view for converted leads
-   **Synchronization**: Automatic removal from the leads list after conversion

#### 4. UX/States

-   **Visual states**: Loading, empty, and error states implemented
-   **Performance**: Optimized for ~100 leads without performance impact
-   **Feedback**: Loading spinners, error messages with retry option

### Extra Features Implemented

#### Filter Persistence (localStorage)

-   Filters and sorting saved automatically
-   Preferences restored on page reload
-   Secure management with error handling

#### Fully Responsive Layout

-   Mobile-first design
-   Optimized breakpoints (sm, md, lg, xl)
-   Adaptive components for different screen sizes

## Architecture & Patterns

### Component Structure

src/
├── components/
│ ├── Header.tsx # Header with stats
│ ├── Table.tsx # Main leads table
│ ├── ClientsTable.tsx # Table for converted prospects
│ ├── SlidePanel.tsx # Side detail panel
│ └── LoadingComponents.tsx # Loading/error/empty states
├── context/
│ └── LeadsContext.tsx # Context API for global state
├── provider/
│ └── LeadsProvider.tsx # Provider with state logic
├── types.ts # TypeScript definitions
├── utils.ts # Utility functions
└── App.tsx # Main component

### Applied Patterns

#### 1. **Context API + Provider Pattern**

#### 2. **Custom Hooks and Memoization**

### State Management

#### Local vs Global State

-   **Global (Context)**: Lead data, CRUD operations, loading states
-   **Local (useState)**: UI-specific states (filters, modals, forms)

#### Synchronization

-   **Custom events**: For component communication
-   **localStorage**: Data and preference persistence
-   **Side effects**: useEffect for data synchronization

## Design System

### Reusable Components

-   **LoadingSpinner**: Loading indicators in 3 sizes
-   **ErrorMessage**: Error messages with retry action
-   **StatCard**: Stats cards with icons
-   **EmptyState**: Informative empty states

## Utilities

### Validations

-   **Email**: Regex pattern for format validation
-   **Status Colors**: Dynamic color mapping by status
-   **Score Colors**: Color system based on performance

## Performance

### Implemented Optimizations

-   **useMemo**: For filters and sorting calculations
-   **useCallback**: For functions passed as props
-   **Lazy loading**: Loading states for async operations
-   **Debounce**: In search filters (implicit via React)

### Performance Metrics

-   **~100 leads**: Smooth rendering with no noticeable lag
-   **Instant filters**: Real-time search without artificial debounce
-   **Smooth transitions**: Optimized CSS animations

## Data Flow

1. **Initialization**: Loads data from JSON or localStorage
2. **Filters**: Real-time application with memoization
3. **Conversion**: Lead → Prospect with synchronization
4. **Persistence**: Automatic saving in localStorage

## Conclusion

This project demonstrates a complete CRUD implementation in React, going beyond basic requirements with advanced UX features, optimized performance, and well-structured code. The chosen architecture enables easy maintenance and future extensibility while delivering a smooth and professional user experience.
