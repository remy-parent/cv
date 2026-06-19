import type { ReactNode } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface AnimatedSectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export default function AnimatedSection({ id, children, className = '' }: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </section>
  );
}
