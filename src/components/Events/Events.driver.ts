import { screen } from '@testing-library/react';
import { EventCardDriver } from '../EventCard/EventCard.driver';

export class EventsDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.querySelector('[data-testid="events-section"]');
    } else {
      el = screen.queryByTestId('events-section');
    }
    
    if (!el) {
      throw new Error('Events element not found');
    }
    this.element = el;
    return el;
  }

  hasEventsSection(): boolean {
    return !!this.elementToUse;
  }



  getEventCardDrivers(): EventCardDriver[] {
    const cards = Array.from(this.elementToUse.querySelectorAll('[data-testid^="event-card-"]'));
    return cards.map((card) => {
      const id = card.getAttribute('data-testid')?.replace('event-card-', '') || undefined;
      return new EventCardDriver(this.elementToUse, id);
    });
  }
}
