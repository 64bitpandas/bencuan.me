import { Fragment, type ReactNode, useState } from 'react';
import '../sass/searchSortFilter.scss';
import { BlogFactory } from './blog';

// Contains some common conversion functions.
export type FactoryType = 'blog';

// MUST return a ReactNode with the key prop, or bad things will happen
export type FactoryFn = (item: any) => ReactNode;

type props = {
  items: any[];
  type: FactoryType;
  itemCategories?: string[];
  sortCategories?: string[];
  useSearch?: boolean;
  defaultSort?: SortState;
};

type SortState = {
  category: string;
  state: 'asc' | 'desc' | 'none';
};

/**
 * A generic component that allows for sorting, searching, and filtering.
 */
const SearchSortFilter = ({ sortCategories, items, type, useSearch, itemCategories, defaultSort }: props) => {
  const [sortState, setSortState] = useState<SortState>(defaultSort ?? { category: '', state: 'none' });
  const [filterState, setFilterState] = useState<Record<string, (item: any) => boolean>>({});
  let filterCategories: Record<string, (item: any) => boolean> | undefined;
  var factory: FactoryFn;
  switch (type) {
    case 'blog':
      factory = BlogFactory;
      break;
    default:
      console.error('unsupported factory type', type);
      return;
  }

  const doSort = (category: string) => {
    if (sortState.category === category) {
      // Cycle through: initial state → opposite state → back to default
      if (category === 'title') {
        // Title: asc → desc → default
        if (sortState.state === 'asc') {
          setSortState({ category, state: 'desc' });
        } else {
          setSortState(defaultSort ?? { category: '', state: 'none' });
        }
      } else {
        // Other categories (like date): desc → asc → default
        if (sortState.state === 'desc') {
          setSortState({ category, state: 'asc' });
        } else {
          setSortState(defaultSort ?? { category: '', state: 'none' });
        }
      }
    } else {
      // Title starts ascending, other categories start descending
      const initialState = category === 'title' ? 'asc' : 'desc';
      setSortState({ category, state: initialState });
    }
  };

  const sortFn = (a: any, b: any) => {
    if (sortState.state === 'none') {
      return 0;
    }

    // Get values to compare
    let aVal = a[sortState.category];
    let bVal = b[sortState.category];

    // For title sorting, make it case-insensitive
    if (sortState.category === 'title' && typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortState.state === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  };

  const sortButtons = (
    <>
      {sortCategories &&
        sortCategories
          .map(category => (
            <span
              className={`category-btn ${sortState.category === category ? 'category-selected' : ''}`}
              key={category}
              onClick={() => doSort(category)}
            >
              {category}
              {sortState.category === category && (sortState.state === 'asc' ? '↑' : '↓')}
            </span>
          ))
          //@ts-ignore mixed use of string and Element
          .reduce((prev, curr) => [prev, '|', curr])}
    </>
  );
  const filterButtons = filterCategories
    ? Object.keys(filterCategories)
        .map(name => {
          return (
            <span
              className={filterState[name] ? 'filter-btn category-selected' : 'filter-btn '}
              key={name}
              onClick={() => {
                if (!filterCategories) return;
                let newFilterState = { ...filterState };
                if (filterState[name]) {
                  delete newFilterState[name];
                } else {
                  newFilterState[name] = filterCategories[name];
                }
                setFilterState(newFilterState);
              }}
            >
              {name}
            </span>
          );
        })
        //@ts-ignore mixed use of string and Element
        .reduce((prev, curr) => [prev, '|', curr])
    : undefined;

  let filteredItems = items;
  for (const key of Object.keys(filterState)) {
    filteredItems = filteredItems.filter(filterState[key]);
  }
  return (
    <>
      {sortCategories && <div className="sort">sort by: {sortButtons}</div>}
      {filterCategories && <div className="filter">filter by: {filterButtons}</div>}
      {itemCategories
        ? itemCategories.map((category, id) => (
            <Fragment key={id}>
              <h3>{category}</h3>
              {filteredItems
                .filter((item: any) => item.category === category)
                .sort(sortFn)
                .map(factory)}
            </Fragment>
          ))
        : filteredItems.sort(sortFn).map(factory)}
    </>
  );
};

export default SearchSortFilter;
