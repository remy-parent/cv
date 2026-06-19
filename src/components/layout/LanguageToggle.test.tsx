import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import LanguageToggle from './LanguageToggle';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/:lang" element={<LanguageToggle />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('LanguageToggle', () => {
  it('marks the current language as pressed', () => {
    renderAt('/fr');
    expect(screen.getByRole('button', { name: 'FR' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders both language options', () => {
    renderAt('/en');
    expect(screen.getByRole('button', { name: 'FR' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true');
  });
});
