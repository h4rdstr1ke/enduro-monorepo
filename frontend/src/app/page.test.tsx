import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import Home from './page';

describe('Home Page', () => {
  it('рендерит заголовок и кнопку Ant Design', () => {
    render(<Home />);
    
    // Проверяем, что заголовок на месте
    const heading = screen.getByRole('heading', { name: /Эндуро Каталог/i });
    expect(heading).toBeInTheDocument();

    // Проверяем, что кнопка отрендерилась
    const button = screen.getByRole('button', { name: /Ant Design успешно подключен!/i });
    expect(button).toBeInTheDocument();
  });
});