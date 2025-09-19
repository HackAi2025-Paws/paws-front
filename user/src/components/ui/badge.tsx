import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-red-100 text-red-700 hover:bg-red-200",
        secondary:
          "border-transparent bg-pink-200 text-pink-700 hover:bg-pink-300",
        destructive:
          "border-transparent bg-red-200 text-red-800 hover:bg-red-300",
        outline: "border-red-200 text-red-600 hover:bg-red-50",
        success: "border-transparent bg-green-100 text-green-700 hover:bg-green-200",
        warning: "border-transparent bg-orange-200 text-orange-800 hover:bg-orange-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
