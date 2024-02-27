import type { ReactNode } from 'react';
import '../sass/searchSortFilter.scss';
import { ILink } from './links';

// Contains some common conversion functions.

type Blog = {
  title: string;
  date: Date;
  slug: string;
};

export type Recipe = {
  title: string;
  slug: string;
  description: string;
  category: string;
  time: number;
  difficulty: number;
  rating: number;
  price?: string;
  spicy?: number;
  veg?: number;
  asian?: boolean;
};

export const ToDateString = (date: Date, pretty?: boolean): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return pretty ? date.toLocaleDateString('en-us', options) : date.toISOString().split('T')[0];
};

export const BlogFactory = (blog: Blog): ReactNode => (
  <div key={blog.slug}>
    <ILink href={blog.slug}>{blog.title}</ILink> | <span>{ToDateString(blog.date)}</span>
  </div>
);

export const RecipeFactory = (recipe: Recipe): ReactNode => (
  <div key={recipe.slug} className="recipe-container">
    <ILink href={recipe.slug} className="internal-link recipe-link">
      {recipe.title}
    </ILink>{' '}
    <span className="ssf-recipe-description">{recipe.description}</span>
  </div>
);

export const RecipeFilterCategories = {
  vegetarian: (item: Recipe) => (item.veg ? item.veg >= 1 : false),
  vegan: (item: Recipe) => (item.veg ? item.veg === 2 : false),
  'no asian grocery': (item: Recipe) => !item.asian,
};
