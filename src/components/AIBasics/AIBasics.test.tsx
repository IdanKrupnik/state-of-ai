import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AIBasics } from './AIBasics';
import { AIBasicsDriver } from './AIBasics.driver';

describe('AIBasics Component', () => {
  it('should render header and educational concepts cards', () => {
    const { container } = render(<AIBasics />);
    const driver = new AIBasicsDriver(container);

    expect(driver.getTitle()).toBe('AI Fundamentals Primer');
    expect(driver.getSubtitle()).toBe('A minimalist introduction to standard structural architectures.');

    expect(driver.getConceptTitle('neural-networks')).toBe('Neural Networks');
    expect(driver.getConceptDescription('neural-networks')).toBe(
      'Layered nodes processing computational signals similar to biological synapses.'
    );

    expect(driver.getConceptTitle('weights-biases')).toBe('Weights & Biases');
    expect(driver.getConceptDescription('weights-biases')).toBe(
      'Numerical parameters adjusting node activation strength during model tuning.'
    );

    expect(driver.getConceptTitle('cost-optimization')).toBe('Cost & Optimization');
    expect(driver.getConceptDescription('cost-optimization')).toBe(
      'Mathematical loss minimization algorithms ensuring target model calibration.'
    );
  });
});
