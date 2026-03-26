import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Fixed "tracking wide" to "tracking-wide"
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive uppercase tracking-wide",
  {
    variants: {
      variant: {
        locked: "bg-neutral-200 text-primary-foreground hover:bg-neutral-200/90 border-neutral-400 border-b-4 active:border-b-0",
        default:
          "bg-white text-black border-slate-200 border-2 border-b-4 active:border-b-2 hover:bg-slate-100 text-slate-500",
        primary:
          "bg-sky-400 text-primary-foreground hover:bg-sky-400/90 border-sky-500 border-b-4 active:border-b-0",
        primaryoutline: "bg-white text-sky-500 hover:bg-slate-100",
        secondary:
          "bg-green-400 text-primary-foreground hover:bg-green-400/90 border-green-600 border-b-4 active:border-b-0",
        secondaryoutline: "bg-white text-green-500 hover:bg-slate-100",
        danger:
          "bg-red-400 text-primary-foreground hover:bg-red-400/90 border-red-600 border-b-4 active:border-b-0",
        dangeroutline: "bg-white text-rose-500 hover:bg-slate-100",
        super:
          "bg-indigo-400 text-primary-foreground hover:bg-indigo-500/90 border-indigo-600 border-b-4 active:border-b-0",
        superoutline: "bg-white text-indigo-500 hover:bg-slate-100",
        ghost: "bg-transparent text-slate-500 border-transparent border-0 hover:bg-slate-100",
        sidebar:
          // Removed duplicate "border-transparent" class
          "bg-transparent text-slate-500 border-transparent hover:bg-slate-100 transition-none",
        sidebaroutline:
          "bg-sky-500/15 text-sky-500 border-sky-300 border-2 hover:bg-sky-500/20 transition-none ",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3 ",
        lg: "h-11 px-8 ",
        rounded: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Define the ButtonProps type explicitly
// Switched to the standard React.ButtonHTMLAttributes for clearer typing
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
