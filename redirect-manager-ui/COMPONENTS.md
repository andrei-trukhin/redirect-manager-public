# UI Component Library

A collection of reusable UI components built with React, TypeScript, and Tailwind CSS following Atomic Design principles.

## Architecture

The component library follows the Atomic Design methodology:

- **Atoms**: Basic building blocks (Button, Badge, Input)
- **Molecules**: Simple combinations of atoms (Alert, Card, FormField)
- **Organisms**: Complex UI components (Modal, Menu, Notification)
- **Templates**: Page-level layouts (to be implemented)
- **Pages**: Specific instances of templates (ComponentShowcase)

## Installation

The components are already set up in this project. To use them in your code:

```tsx
import { Button, Card, Modal } from './components';
```

## Components

### Atoms

#### Button
Interactive button component with multiple variants and sizes.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `children`: React.ReactNode
- All standard HTML button attributes

**Example:**
```tsx
<Button variant="primary" size="md" onClick={() => console.log('clicked')}>
  Click Me
</Button>
```

#### Badge
Status indicators and labels.

**Props:**
- `variant`: 'default' | 'success' | 'warning' | 'danger' | 'info' (default: 'default')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `children`: React.ReactNode
- `className`: string (optional)

**Example:**
```tsx
<Badge variant="success" size="sm">Active</Badge>
```

#### Input
Text input field with label and validation support.

**Props:**
- `label`: string (optional)
- `error`: string (optional)
- `helperText`: string (optional)
- All standard HTML input attributes

**Example:**
```tsx
<Input 
  label="Email" 
  type="email" 
  placeholder="Enter your email"
  error="Invalid email format"
/>
```

### Molecules

#### Alert
Contextual feedback messages with icons.

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'error' (default: 'info')
- `title`: string (optional)
- `children`: React.ReactNode
- `onClose`: () => void (optional)
- `className`: string (optional)

**Example:**
```tsx
<Alert variant="success" title="Success!" onClose={() => console.log('closed')}>
  Your changes have been saved.
</Alert>
```

#### Card
Container component for grouping related content.

**Props:**
- `title`: string (optional)
- `subtitle`: string (optional)
- `children`: React.ReactNode
- `footer`: React.ReactNode (optional)
- `variant`: 'default' | 'bordered' | 'elevated' (default: 'default')
- `className`: string (optional)

**Example:**
```tsx
<Card 
  title="User Profile" 
  subtitle="Manage your account"
  footer={<Button>Save Changes</Button>}
>
  <p>Card content goes here</p>
</Card>
```

#### FormField
Enhanced input component with required field indicator.

**Props:**
- `name`: string (required)
- `label`: string (optional)
- `required`: boolean (default: false)
- All Input component props

**Example:**
```tsx
<FormField 
  name="username" 
  label="Username" 
  required 
  placeholder="Enter username"
/>
```

### Organisms

#### Modal
Dialog overlay for focused interactions.

**Props:**
- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `title`: string (optional)
- `children`: React.ReactNode
- `footer`: React.ReactNode (optional)
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')

**Example:**
```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

#### Menu
Dropdown menu with actions.

**Props:**
- `items`: MenuItem[] (required)
- `trigger`: React.ReactNode (required)
- `position`: 'left' | 'right' (default: 'left')

**MenuItem Interface:**
- `label`: string
- `onClick`: () => void (optional)
- `href`: string (optional)
- `icon`: React.ReactNode (optional)
- `disabled`: boolean (optional)
- `divider`: boolean (optional)

**Example:**
```tsx
const menuItems = [
  { label: 'Profile', onClick: () => navigate('/profile') },
  { label: 'Settings', onClick: () => navigate('/settings') },
  { divider: true },
  { label: 'Logout', onClick: handleLogout },
];

<Menu 
  items={menuItems}
  trigger={<Button>Options</Button>}
  position="right"
/>
```

#### Notification
Toast-style notifications with auto-dismiss.

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'error' (default: 'info')
- `title`: string (required)
- `message`: string (optional)
- `duration`: number (default: 5000, set to 0 for no auto-dismiss)
- `onClose`: () => void (optional)
- `position`: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' (default: 'top-right')

**Example:**
```tsx
const [showNotification, setShowNotification] = useState(false);

{showNotification && (
  <Notification
    variant="success"
    title="Success!"
    message="Your changes have been saved."
    duration={5000}
    onClose={() => setShowNotification(false)}
    position="top-right"
  />
)}
```

## Styling

All components use Tailwind CSS for styling. The design system includes:

- **Colors**: Blue (primary), Gray (secondary), Green (success), Yellow (warning), Red (danger/error)
- **Spacing**: Consistent padding and margins using Tailwind's spacing scale
- **Typography**: System font stack with responsive sizing
- **Shadows**: Subtle shadows for elevation
- **Borders**: Rounded corners with consistent border radius
- **Transitions**: Smooth hover and focus states

## Customization

Components accept a `className` prop for additional styling:

```tsx
<Button className="w-full mt-4">Full Width Button</Button>
```

## Development

To view all components in action, run the development server:

```bash
npm run dev
```

The ComponentShowcase page displays all available components with interactive examples.

## TypeScript Support

All components are fully typed with TypeScript interfaces exported alongside the components:

```tsx
import { Button, ButtonProps } from './components';
```

## Future Enhancements

- Add more atom components (Checkbox, Radio, Select, Textarea)
- Create template components for common layouts
- Add animation variants
- Implement dark mode support
- Add accessibility improvements (ARIA labels, keyboard navigation)
- Create Storybook documentation
