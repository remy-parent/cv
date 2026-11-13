import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('renders the source link in a new tab and the rights text', () => {
    render(<Footer />);

    const source = screen.getByRole('link', { name: /code source|source code/i });
    expect(source).toHaveAttribute('href', 'https://github.com/remy-parent/cv');
    expect(source).toHaveAttribute('target', '_blank');
    expect(source).toHaveAttribute('rel', expect.stringContaining('noreferrer'));

    expect(screen.getByText(/tous droits réservés|all rights reserved/i)).toBeInTheDocument();
  });
});
