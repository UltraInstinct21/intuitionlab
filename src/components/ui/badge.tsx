import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none lowercase tracking-tight",
  {
    variants: {
      variant: {
        default:
          "border-charcoal bg-surface-container-high text-on-surface shadow-[1px_1px_0px_0px_rgba(23,23,23,0.1)]",
        easy:
          "border-[#22c55e] bg-[#22c55e]/15 text-[#166534] font-bold shadow-[1px_1px_0px_0px_rgba(34,197,94,0.3)]",
        medium:
          "border-marker-orange bg-primary-fixed-dim/40 text-burnt-sienna font-bold shadow-[1px_1px_0px_0px_rgba(255,111,30,0.3)]",
        hard:
          "border-[#ba1a1a] bg-[#ffdad6] text-[#93000a] font-bold shadow-[1px_1px_0px_0px_rgba(186,26,26,0.3)]",
        sticker:
          "border-charcoal bg-sky-sticker text-white shadow-[2px_2px_0px_0px_rgba(23,23,23,0.2)]",
        pink:
          "border-charcoal bg-bubblegum-sticker text-white shadow-[2px_2px_0px_0px_rgba(23,23,23,0.2)]",
        outline: "border-outline text-on-surface-variant bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
