import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "hub:inline-flex hub:items-center hub:justify-center hub:gap-2 hub:whitespace-nowrap hub:rounded-md hub:text-sm hub:font-medium hub:transition-all hub:disabled:pointer-events-none hub:disabled:opacity-50 hub:[&_svg]:pointer-events-none hub:[&_svg:not([class*=size-])]:size-4 hub:shrink-0 hub:[&_svg]:shrink-0 hub:outline-none hub:focus-visible:border-ring hub:focus-visible:ring-ring/50 hub:focus-visible:ring-[3px] hub:aria-invalid:ring-destructive/20 hub:dark:aria-invalid:ring-destructive/40 hub:aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "hub:bg-primary hub:text-primary-foreground hub:shadow-xs hub:hover:bg-primary/90",
        destructive:
          "hub:bg-destructive hub:text-white hub:shadow-xs hub:hover:bg-destructive/90 hub:focus-visible:ring-destructive/20 hub:dark:focus-visible:ring-destructive/40 hub:dark:bg-destructive/60",
        outline:
          "hub:border hub:bg-background hub:shadow-xs hub:hover:bg-accent hub:hover:text-accent-foreground hub:dark:bg-input/30 hub:dark:border-input hub:dark:hover:bg-input/50",
        secondary:
          "hub:bg-secondary hub:text-secondary-foreground hub:shadow-xs hub:hover:bg-secondary/80",
        ghost:
          "hub:hover:bg-accent hub:hover:text-accent-foreground hub:dark:hover:bg-accent/50",
        link: "hub:text-primary hub:underline-offset-4 hub:hover:underline",
      },
      size: {
        default: "hub:h-9 hub:px-4 hub:py-2 hub:has-[>svg]:px-3",
        sm: "hub:h-8 hub:rounded-md hub:gap-1.5 hub:px-3 hub:has-[>svg]:px-2.5",
        lg: "hub:h-10 hub:rounded-md hub:px-6 hub:has-[>svg]:px-4",
        icon: "hub:size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
