import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import CurrentlyWorkingOn from './CurrentlyWorkingOn';

describe('CurrentlyWorkingOn', () => {
  it('renders both certifications with external verify links', () => {
    render(
      <MemoryRouter initialEntries={['/fr']}>
        <Routes>
          <Route path="/:lang" element={<CurrentlyWorkingOn />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Claude Code 101' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Claude Code in Action' })).toBeInTheDocument();

    const verifyLinks = screen.getAllByRole('link', { name: /Vérifier/ });
    expect(verifyLinks).toHaveLength(5);
    expect(verifyLinks[0]).toHaveAttribute('href', 'https://verify.skilljar.com/c/9vnxrrovpbnx');
    expect(verifyLinks[0]).toHaveAttribute('target', '_blank');
    expect(verifyLinks[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
