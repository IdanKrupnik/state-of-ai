import { screen, fireEvent } from '@testing-library/react';
import { InputFieldDriver } from '../ui/InputField/InputField.driver';
import { SidebarNewsletterDriver } from '../SidebarNewsletter/SidebarNewsletter.driver';
import { FeedHeaderDriver } from '../FeedHeader/FeedHeader.driver';
import { FeedRowDriver } from '../FeedRow/FeedRow.driver';

export class FeedContainerDriver {
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
      throw new Error('FeedContainer element not found');
    }
    this.element = el;
    return el;
  }

  getSearchInputDriver(): InputFieldDriver {
    const el = this.elementToUse.querySelector('#search-input')?.parentElement as HTMLElement;
    return new InputFieldDriver(el);
  }

  getSidebarNewsletterDriver(): SidebarNewsletterDriver {
    return new SidebarNewsletterDriver(this.elementToUse);
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
  
  getEmptyStateText(): string | null {
    const list = this.elementToUse.querySelector('[data-testid="articles-list"]');
    if (!list) return null;
    const firstChild = list.firstElementChild;
    if (firstChild && firstChild.getAttribute('data-testid') !== 'feed-row') {
      return firstChild.textContent;
    }
    return null;
  }

  isDrawerVisible(): boolean {
    const drawer = this.elementToUse.querySelector('[data-testid="side-drawer"]');
    if (!drawer) return false;
    return !drawer.className.includes('translate-x-full');
  }

  openDrawer(): this {
    const btn = screen.getByRole('button', { name: /tune filter/i });
    fireEvent.click(btn);
    return this;
  }

  closeDrawer(): this {
    const btn = this.elementToUse.querySelector('[data-testid="side-drawer"] button');
    if (!btn) throw new Error('Close button not found in drawer');
    fireEvent.click(btn);
    return this;
  }
}
