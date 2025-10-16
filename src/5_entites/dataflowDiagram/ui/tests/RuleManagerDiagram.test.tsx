import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { DataflowDiagram } from '../DataflowDiagram';

describe('DataflowDiagram', () => {
  vi.mock('chart.js');
  it('should render successfully', () => {
    const { baseElement } = render(<DataflowDiagram />);
    expect(baseElement).toBeTruthy();
  });
});
