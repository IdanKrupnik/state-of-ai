import React, { useState } from 'react';
import { InputField } from '../ui/InputField/InputField';
import { Button } from '../ui/Button/Button';

export interface SidebarNewsletterProps {
  onSubscribe?: (email: string) => void;
}

export const SidebarNewsletter: React.FC<SidebarNewsletterProps> = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      if (onSubscribe) {
        onSubscribe(email);
      }
      setEmail('');
    }
  };

  return (
    <div 
      className="p-6 border-t border-brand-offwhite/10 bg-brand-offwhite/[0.02]"
      data-testid="sidebar-newsletter"
    >
      {subscribed ? (
        <div className="text-xs text-brand-neon-green font-geist-mono" data-testid="success-message">
          ✓ Subscribed successfully!
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
          <div className="text-[11px] font-geist-mono text-brand-offwhite/50 uppercase tracking-wider">
            Weekly Briefing
          </div>
          <InputField
            variant="bottom"
            type="email"
            placeholder="email@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-brand-offwhite placeholder-brand-offwhite/30 border-brand-offwhite/20 focus:border-brand-neon-green text-xs"
            required
            id="newsletter-email"
          />
          <Button type="submit" variant="secondary" className="text-xs py-1.5 border-brand-offwhite/30 text-brand-offwhite hover:bg-brand-offwhite/10">
            Subscribe
          </Button>
        </form>
      )}
    </div>
  );
};
