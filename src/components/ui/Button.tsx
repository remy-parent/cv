import type { AnchorHTMLAttributes } from 'react';

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary';
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors';
  const variants = {
    primary: 'bg-accent text-bg hover:bg-amber-400',
    secondary: 'border border-border text-text hover:border-accent hover:text-accent',
  };

  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </a>
  );
}
