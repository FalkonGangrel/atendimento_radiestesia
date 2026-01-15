// src/components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority"; // Importe 'type VariantProps'
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/variants"; // Importa do novo arquivo!

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, // Estende as props HTML nativas
    VariantProps<typeof buttonVariants> // Usa interseção de tipos para as props de variante
{
  asChild?: boolean; // Adicionado para flexibilidade com Radix UI
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

export { Button }; // Exporta apenas o componente Button
