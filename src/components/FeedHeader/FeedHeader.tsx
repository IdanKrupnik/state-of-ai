import React from 'react';
import { MetadataTag } from '../ui/MetadataTag/MetadataTag';

export interface FeedHeaderProps {
  category: string;
  title: string;
  description: string;
}

export const FeedHeader: React.FC<FeedHeaderProps> = ({
  category,
  title,
  description,
}) => {
  return (
    <header 
      className="flex flex-col gap-3 items-start"
      data-testid="feed-header"
    >
      <MetadataTag>{category}</MetadataTag>
      <h1 className="text-3xl md:text-4xl font-bold font-inter tracking-tight text-brand-black leading-tight">
        {title}
      </h1>
      <p className="text-sm md:text-base text-brand-warm-grey font-inter max-w-[36rem] leading-relaxed">
        {description}
      </p>
    </header>
  );
};
