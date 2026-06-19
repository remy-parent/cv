import '@testing-library/jest-dom';
import '../i18n/i18n';
import { vi } from 'vitest';

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly scrollMargin = '';
  readonly thresholds = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
