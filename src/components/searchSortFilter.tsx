import { Fragment, useState } from 'react';
import '../sass/searchSortFilter.scss';
import {
  BlogFactory,
  BookFactory,
  type FactoryFn,
  type FactoryType,
  RecipeFactory,
  RecipeFilterCategories,
} from './factories';

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
    case 'recipe':
      factory = RecipeFactory;
      filterCategories = RecipeFilterCategories;
      break;
    case 'book':
      factory = BookFactory;
      break;
    default:
      console.error('unsupported factory type', type);
      return;
  }

  const doSort = (category: string) => {
    if (sortState.category === category) {
      if (sortState.state === 'desc') {
        setSortState({ category, state: 'asc' });
      } else {
        setSortState(defaultSort ?? { category: '', state: 'none' });
      }
    } else {
      setSortState({ category, state: 'desc' });
    }
  };

  const sortFn = (a: any, b: any) => {
    if (sortState.state === 'none') {
      return 0;
    }
    if (sortState.state === 'asc') {
      return a[sortState.category] > b[sortState.category] ? 1 : -1;
    } else {
      return a[sortState.category] < b[sortState.category] ? 1 : -1;
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
