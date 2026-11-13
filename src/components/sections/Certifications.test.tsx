import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Certifications from './Certifications';

describe('Certifications', () => {
  it('renders the certifications with external verify links', () => {
    render(
      <MemoryRouter initialEntries={['/fr']}>
        <Routes>
          <Route path="/:lang" element={<Certifications />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Claude Code 101' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Claude Code in Action' })).toBeInTheDocument();

    const verifyLinks = screen.getAllByRole('link', { name: /Vérifier/ });
    expect(verifyLinks).toHaveLength(6);
    expect(verifyLinks[0]).toHaveAttribute('href', 'https://verify.skilljar.com/c/9vnxrrovpbnx');
    expect(verifyLinks[5]).toHaveAttribute(
      'href',
      'https://www.udemy.com/certificate/UC-7e497c9d-99f1-425e-9549-3ae8c7c993ce/',
    );
    expect(verifyLinks[0]).toHaveAttribute('target', '_blank');
    expect(verifyLinks[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
