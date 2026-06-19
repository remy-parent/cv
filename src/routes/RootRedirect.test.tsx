import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RootRedirect from './RootRedirect';

function renderRedirect() {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/fr" element={<p>landed-fr</p>} />
        <Route path="/en" element={<p>landed-en</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RootRedirect', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('redirects to the stored language preference', () => {
    localStorage.setItem('preferred-lang', 'en');
    renderRedirect();
    expect(screen.getByText('landed-en')).toBeInTheDocument();
  });

  it('falls back to detecting the browser language when nothing is stored', () => {
    vi.stubGlobal('navigator', { ...navigator, language: 'fr-FR' });
    renderRedirect();
    expect(screen.getByText('landed-fr')).toBeInTheDocument();
  });
});
