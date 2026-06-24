import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BeforeCode from './BeforeCode';

describe('BeforeCode', () => {
  it('renders the toggle collapsed and reveals the two entries on click', () => {
    render(
      <ul>
        <BeforeCode />
      </ul>,
    );

    const toggle = screen.getByRole('button', { name: /Et avant de coder/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    expect(screen.getByText('Auteur humoristique · Montréal')).toBeInTheDocument();
    expect(screen.getByText('Massothérapeute · Québec')).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });
});
