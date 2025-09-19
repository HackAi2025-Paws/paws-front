import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md",
        destructive:
          "bg-red-500 text-white hover:bg-red-600",
        outline:
          "border-2 border-red-500 text-red-600 bg-background hover:bg-red-50",
        secondary:
          "bg-pink-400 text-dark-900 hover:bg-pink-500",
        ghost: "hover:bg-cream-200 hover:text-red-600",
        link: "text-red-600 underline-offset-4 hover:underline",
        soft: "bg-orange-100 text-orange-700 hover:bg-orange-200",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-xl px-4 py-2",
        lg: "h-14 rounded-2xl px-8 py-4",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
