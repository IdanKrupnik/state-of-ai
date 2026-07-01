import { screen } from '@testing-library/react';
import { TopNavBarDriver } from '../TopNavBar/TopNavBar.driver';
import { TelemetryTickerDriver } from '../TelemetryTicker/TelemetryTicker.driver';

import { SentimentPollDriver } from '../SentimentPoll/SentimentPoll.driver';
import { LatencyMapDriver } from '../LatencyMap/LatencyMap.driver';
import { FeedHeaderDriver } from '../FeedHeader/FeedHeader.driver';
import { FeedRowDriver } from '../FeedRow/FeedRow.driver';
import { FooterDriver } from '../Footer/Footer.driver';
import { AIBasicsDriver } from '../AIBasics/AIBasics.driver';
import { EventsDriver } from '../Events/Events.driver';
import { AboutDriver } from '../About/About.driver';

export class AppDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.firstElementChild as HTMLElement;
    } else {
      el = screen.queryByRole('main')?.parentElement as HTMLElement | null;
    }
    
    if (!el) {
      throw new Error('App element not found');
    }
    this.element = el;
    return el;
  }

  getTopNavBarDriver(): TopNavBarDriver {
    return new TopNavBarDriver(this.elementToUse);
  }

  getTelemetryTickerDriver(): TelemetryTickerDriver {
    return new TelemetryTickerDriver(this.elementToUse);
  }



  getSentimentPollDriver(): SentimentPollDriver {
    return new SentimentPollDriver(this.elementToUse);
  }

  getLatencyMapDriver(): LatencyMapDriver {
    return new LatencyMapDriver(this.elementToUse);
  }

  getFeedHeaderDriver(): FeedHeaderDriver {
    return new FeedHeaderDriver(this.elementToUse);
  }

  getArticleRowDrivers(): FeedRowDriver[] {
    const list = this.elementToUse.querySelector('[data-testid="articles-list"]');
    if (!list) return [];
    
    const children = Array.from(list.children) as HTMLElement[];
    const rowChildren = children.filter(c => c.getAttribute('data-testid') === 'feed-row');
    return rowChildren.map(el => new FeedRowDriver(el));
  }

  getFooterDriver(): FooterDriver {
    return new FooterDriver(this.elementToUse);
  }


  getAIBasicsDriver(): AIBasicsDriver {
    return new AIBasicsDriver(this.elementToUse);
  }

  getEventsDriver(): EventsDriver {
    return new EventsDriver(this.elementToUse);
  }

  getAboutDriver(): AboutDriver {
    return new AboutDriver(this.elementToUse);
  }

  getPlaceholderSection(tabId: string): HTMLElement | null {
    return this.elementToUse.querySelector(`[data-testid="placeholder-section-${tabId}"]`);
  }

  getPlaceholderTitle(tabId: string): string | null {
    const section = this.getPlaceholderSection(tabId);
    if (!section) return null;
    const title = section.querySelector('h2');
    return title ? title.textContent : null;
  }

  hasLoadMoreButton(): boolean {
    return !!this.elementToUse.querySelector('[data-testid="load-more-btn"]');
  }

  getLoadMoreButtonText(): string | null {
    const btn = this.elementToUse.querySelector('[data-testid="load-more-btn"]');
    return btn ? btn.textContent?.trim() || null : null;
  }

  clickLoadMoreButton(): this {
    const btn = this.elementToUse.querySelector('[data-testid="load-more-btn"]') as HTMLButtonElement | null;
    if (!btn) {
      throw new Error('Load More button not found');
    }
    btn.click();
    return this;
  }

  isLoadMoreButtonDisabled(): boolean {
    const btn = this.elementToUse.querySelector('[data-testid="load-more-btn"]') as HTMLButtonElement | null;
    if (!btn) {
      throw new Error('Load More button not found');
    }
    return btn.disabled;
  }
}

