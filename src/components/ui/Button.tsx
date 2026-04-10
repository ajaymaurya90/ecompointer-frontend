"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-primary text-textInverse hover:bg-primaryHover shadow-sm",
    secondary: "bg-card text-textPrimary hover:bg-cardMuted shadow-sm",
    ghost: "bg-transparent text-textPrimary hover:bg-cardMuted",
    danger: "bg-danger text-textInverse hover:opacity-90 shadow-sm",
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-9 px-3 text-sm rounded-xl",
    md: "h-11 px-4 text-sm rounded-xl",
    lg: "h-12 px-5 text-sm rounded-2xl",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            className,
            variant = "primary",
            size = "md",
            type = "button",
            fullWidth = false,
            loading = false,
            disabled,
            leftIcon,
            rightIcon,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || loading;

        return (
            <button
                ref={ref}
                type={type}
                disabled={isDisabled}
                className={cn(
                    "interactive-button inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
                    "transition-all duration-base ease-in-out",
                    "focus:outline-none focus:ring-2 focus:ring-borderFocus/30",
                    "disabled:cursor-not-allowed disabled:bg-disabledBg disabled:text-textDisabled disabled:shadow-none disabled:hover:transform-none",
                    variantClasses[variant],
                    sizeClasses[size],
                    fullWidth && "w-full",
                    className
                )}
                {...props}
            >
                {loading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : leftIcon ? (
                    <span className="flex items-center">{leftIcon}</span>
                ) : null}

                <span>{children}</span>

                {!loading && rightIcon ? (
                    <span className="flex items-center">{rightIcon}</span>
                ) : null}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;