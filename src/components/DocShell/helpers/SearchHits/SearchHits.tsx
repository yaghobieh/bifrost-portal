import { Link } from '@forgedevstack/forge-compass/react';
import { DOC_PATH } from '@const/routes.const';
import type { FC } from 'react';

export interface SearchHitsProps {
  hits: { slug: string; title: string }[];
  empty: string;
  onPick: () => void;
}

export const SearchHits: FC<SearchHitsProps> = (props) => {
  const { hits, empty, onPick } = props;
  if (!hits.length) {
    return <div className="Bp-search__hit">{empty}</div>;
  }
  return (
    <>
      {hits.map((hit) => (
        <Link key={hit.slug} to={DOC_PATH(hit.slug)} className="Bp-search__hit" onClick={onPick}>
          {hit.title}
        </Link>
      ))}
    </>
  );
};
