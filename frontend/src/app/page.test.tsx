import { describe, it, expect } from 'vitest';

describe('Home Page', () => {
  it('модуль Home экспортируется корректно', async () => {
    const Home = (await import('./page')).default;
    expect(Home).toBeDefined();
  });
});