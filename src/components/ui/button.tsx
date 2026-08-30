import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-pill text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-cream-paper text-charcoal border-[1.5px] border-charcoal shadow-subtle hover:bg-dew-drop active:scale-95",
        primary:
          "bg-primary-container text-on-primary-container border-[1.5px] border-charcoal hard-shadow-hover active:scale-95 font-semibold",
        secondary:
          "bg-secondary-container text-on-secondary-container border border-outline hover:bg-secondary-fixed active:scale-95",
        outline:
          "border border-outline bg-transparent hover:bg-surface-container-high text-on-surface active:scale-95",
        ghost:
          "hover:bg-surface-container-high text-on-surface hover:text-on-surface active:scale-95",
        link:
          "text-primary underline-offset-4 hover:underline",
        sticker:
          "bg-sky-sticker text-white border border-charcoal hard-shadow-hover rounded-xl text-xs font-bold uppercase tracking-wider",
      },
      size: {
        default: "h-9 px-5 py-2",
        sm: "h-7 rounded-pill px-3 text-xs",
        lg: "h-11 rounded-pill px-8 text-base",
        icon: "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
