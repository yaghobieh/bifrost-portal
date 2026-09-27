import type { FC } from 'react';
import type { BlogCategoryChipsProps } from './BlogCategoryChips.types';

export const BlogCategoryChips: FC<BlogCategoryChipsProps> = (props) => {
  const { ids, active, labelFor, onSelect } = props;
  return (
    <div className="Bl-blog__chips">
      {ids.map((id) => {
        const chipClass = id === active ? 'Bl-blog__chip is-active' : 'Bl-blog__chip';
        return (
          <button key={id} type="button" className={chipClass} onClick={() => onSelect(id)}>
            {labelFor(id)}
          </button>
        );
      })}
    </div>
  );
};
