import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AnimatedSection from './AnimatedSection';

describe('AnimatedSection', () => {
  it('renders its children', () => {
    render(
      <AnimatedSection id="test-section">
        <p>Hello</p>
      </AnimatedSection>,
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(document.getElementById('test-section')).toBeInTheDocument();
  });
});
