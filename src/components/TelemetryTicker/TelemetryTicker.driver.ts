import { screen } from '@testing-library/react';
import { SystemStatusDriver } from '../ui/SystemStatus/SystemStatus.driver';

export class TelemetryTickerDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.firstElementChild as HTMLElement;
    } else {
      el = screen.queryByText(/Best Model:/i)?.parentElement?.parentElement as HTMLElement | null;
    }
    
    if (!el) {
      throw new Error('TelemetryTicker element not found');
    }
    this.element = el;
    return el;
  }

  getSystemStatusDriver(): SystemStatusDriver {
    return new SystemStatusDriver(this.elementToUse);
  }

  getTickerText(): string | null {
    return this.elementToUse.textContent;
  }
}
