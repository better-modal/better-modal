# Better Modal

A type-safe modal manager.

## Installation

```bash
npm install better-modal
```

## Quick Start

### 1. Define your modals

```tsx
// modals/init.ts
import { betterModal } from "better-modal";
import { MyCustomDialogVariant } from "./dialog";
import { MyComponent } from "./component";

const m = betterModal({
  // Variants are the shells that render your modal content
  variants: {
    dialog: MyCustomDialogVariant,
  },
});

export const modals = m.modals({
  invoice: {
    add: m.modal(MyComponent, "dialog"),
  },
});
```

#### 1.1 Default Values

You can pass default values to your components and variants by using `withDefaults()` so you no longer have to provide them when calling `.open()`

```tsx
const InvoiceModal = m.modal(MyInvoiceComponent, "dialog").withDefaults({
  variant: {...}
  component: {...}
})
```

### 2. Create your React Provider

```ts
// modals/react.ts
"use client";

import { createBetterModalReact } from "better-modal/react";
import { modals } from "./modals";

export const { BetterModalProvider } = createBetterModalReact(modals);
```

### 3. Add the provider to your app (e.g. Next.js Layouts)

```tsx
import { BetterModalProvider } from "./modals/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <BetterModalProvider />
      </body>
    </html>
  );
}
```

### 4. Use modals in your components

```tsx
// components/MyButton.tsx
import { modals } from "./modals/init";

export function MyButton() {
  return (
    <button
      onClick={() => {
        modals.modals.invoice.add.open(/* props */);
      }}
    >
      Open Modal
    </button>
  );
}
```
