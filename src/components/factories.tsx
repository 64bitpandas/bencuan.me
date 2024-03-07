import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBowlRice, faClock, faLocationDot, faPepperHot, faSprout, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactNode } from 'react';
import '../sass/searchSortFilter.scss';
import { ILink, XLink } from './links';

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
  rating: number; // number of stars
  price?: string; // can be any string, typically some number of $'s
  spicy?: number; // number of chilis
  veg?: number; // 0 for omni, 1 for vegetarian, 2 for vegan
  asian?: boolean; // true if it requires asian grocery
};

export type Book = {
  title: string;
  author: string;
  image: string;
  rating: number;
  description: string;
  date: Date;
  genres?: string;
  place?: string;
  placeUrl?: string;
};

type iconProps = {
  icon: IconProp;
  count: number;
  className?: string;
};

// Creates `count` number of FontAwesome icons.
export const IconList = ({ icon, count, className }: iconProps) => {
  const icons = [];
  for (let i = 0; i < count; i++) {
    icons.push(
      <FontAwesomeIcon key={i} icon={icon} className={className ? className + ' recipe-icon' : 'recipe-icon'} />,
    );
  }
  return icons;
};

export const ToDateString = (date: Date, pretty?: boolean): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
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
    <IconList icon={faClock} count={recipe.time <= 15 ? 1 : 0} className="clock" />
    <IconList icon={faStar} count={recipe.rating} className="star" />
    <IconList icon={faSprout} count={recipe.veg ?? 0} className="sprout" />
    <IconList icon={faBowlRice} count={recipe.asian ? 1 : 0} className="" />
    <IconList icon={faPepperHot} count={recipe.spicy ?? 0} className="pepper" />
    {/* <span className="ssf-recipe-description">{recipe.description}</span> */}
  </div>
);

export const RecipeFilterCategories = {
  vegetarian: (item: Recipe) => (item.veg ? item.veg >= 1 : false),
  vegan: (item: Recipe) => (item.veg ? item.veg === 2 : false),
  'no asian grocery': (item: Recipe) => !item.asian,
  quick: (item: Recipe) => item.time <= 15,
};

export const BookFactory = (book: Book): ReactNode => (
  <div className="book-container">
    <img src={`/img/books/${book.image}`} alt={book.title} />
    <div className="book-right">
      <div>
        <span className="book-title">{book.title}</span>
        <span className="book-author">by {book.author}</span>
      </div>

      <div>
        {book.genres && (
          <span className="book-genres">
            {book.genres}
            {' // '}
          </span>
        )}
        {book.place && (
          <span className="book-place">
            <FontAwesomeIcon icon={faLocationDot} className="pin" />
            {book.placeUrl ? (
              <XLink href={book.placeUrl} label={book.place} className="link blue-link">
                {book.place}
              </XLink>
            ) : (
              book.place
            )}
          </span>
        )}
      </div>

      <div>
        <IconList icon={faStar} count={book.rating} className={`intro-star star${book.rating}`} />
      </div>

      <p className="book-description">{book.description}</p>
    </div>
  </div>
);
