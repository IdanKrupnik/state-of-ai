import { screen } from '@testing-library/react';
import { TopNavBarDriver } from '../TopNavBar/TopNavBar.driver';
import { TelemetryTickerDriver } from '../TelemetryTicker/TelemetryTicker.driver';
import { CollapsibleFundamentalsDriver } from '../CollapsibleFundamentals/CollapsibleFundamentals.driver';
import { SentimentPollDriver } from '../SentimentPoll/SentimentPoll.driver';
import { LatencyMapDriver } from '../LatencyMap/LatencyMap.driver';
import { FeedHeaderDriver } from '../FeedHeader/FeedHeader.driver';
import { InputFieldDriver } from '../ui/InputField/InputField.driver';
import { FeedRowDriver } from '../FeedRow/FeedRow.driver';
import { FooterDriver } from '../Footer/Footer.driver';
import { TuningDrawerDriver } from '../TuningDrawer/TuningDrawer.driver';

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

  getCollapsibleFundamentalsDriver(): CollapsibleFundamentalsDriver {
    return new CollapsibleFundamentalsDriver(this.elementToUse);
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

  getSearchInputDriver(): InputFieldDriver {
    const el = this.elementToUse.querySelector('#search-input')?.parentElement as HTMLElement;
    return new InputFieldDriver(el);
  }

  getArticleRowDrivers(): FeedRowDriver[] {
    const list = this.elementToUse.querySelector('[data-testid="articles-list"]');
    if (!list) return [];
    
    const children = Array.from(list.children) as HTMLElement[];
    const rowChildren = children.filter(c => c.getAttribute('data-testid') === 'feed-row');
    return rowChildren.map(el => new FeedRowDriver(el));
  }
  
  getEmptyStateText(): string | null {
    const list = this.elementToUse.querySelector('[data-testid="articles-list"]');
    if (!list) return null;
    const firstChild = list.firstElementChild;
    if (firstChild && firstChild.getAttribute('data-testid') !== 'feed-row') {
      return firstChild.textContent;
    }
    return null;
  }

  getFooterDriver(): FooterDriver {
    return new FooterDriver(this.elementToUse);
  }

  getTuningDrawerDriver(): TuningDrawerDriver {
    return new TuningDrawerDriver(this.elementToUse);
  }
}
