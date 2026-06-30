import { screen } from '@testing-library/react';
import { ButtonDriver } from '../ui/Button/Button.driver';
import { InputFieldDriver } from '../ui/InputField/InputField.driver';
import { CardDriver } from '../ui/Card/Card.driver';
import { SidebarSourceSwitcherDriver } from '../ui/SidebarSourceSwitcher/SidebarSourceSwitcher.driver';

export class FeedContainerDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.firstElementChild as HTMLElement;
    } else {
      el = screen.queryByTestId('sidebar')?.parentElement as HTMLElement | null;
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

  getNewsletterEmailInputDriver(): InputFieldDriver {
    const el = this.elementToUse.querySelector('#newsletter-email')?.parentElement as HTMLElement;
    return new InputFieldDriver(el);
  }

  getNewsletterSubmitButtonDriver(): ButtonDriver {
    const form = this.elementToUse.querySelector('form') as HTMLElement;
    return new ButtonDriver(form);
  }

  getSidebarSourceSwitcherDriver(): SidebarSourceSwitcherDriver {
    const switcher = this.elementToUse.querySelector('[data-testid="sidebar"]') as HTMLElement;
    return new SidebarSourceSwitcherDriver(switcher);
  }

  getArticleCardDrivers(): CardDriver[] {
    const list = this.elementToUse.querySelector('[data-testid="articles-list"]');
    if (!list) return [];
    
    const children = Array.from(list.children) as HTMLElement[];
    // Filter out potential empty-state divs
    const cardChildren = children.filter(c => c.querySelector('h3') !== null);
    return cardChildren.map(el => new CardDriver(el));
  }
  
  getEmptyStateText(): string | null {
    const list = this.elementToUse.querySelector('[data-testid="articles-list"]');
    if (!list) return null;
    const firstChild = list.firstElementChild;
    if (firstChild && !firstChild.querySelector('h3')) {
      return firstChild.textContent;
    }
    return null;
  }
}
