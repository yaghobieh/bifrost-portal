import type { ReactNode } from 'react';
import { Link } from '@forgedevstack/forge-compass/react';
import { NUMBER_ONE, NUMBER_TWO } from '@const/numbers.const';
import { BACKTICK } from '@const/strings.const';
import { DOC_PATH } from '@const/routes.const';
import { GUIDE_SLUGS } from '@const/nav.const';
import { DOC_FOOT_NEXT_MODIFIER, DOC_TAB_DOCS, DOC_TAB_GUIDES } from './DocPage.const';
import type { DocFootLinkParams, DocPageTab } from './DocPage.types';

export const docPageTab = (slug: string): DocPageTab => {
  if (GUIDE_SLUGS.includes(slug)) {
    return DOC_TAB_GUIDES;
  }
  return DOC_TAB_DOCS;
};

export const renderInline = (text: string): ReactNode => {
  const parts = text.split(BACKTICK);
  return parts.map((part, index) => {
    const isCode = index % NUMBER_TWO === NUMBER_ONE;
    if (isCode) {
      return <code key={`${part}-${index}`}>{part}</code>;
    }
    return part;
  });
};

export const renderDocFootLink = (params: DocFootLinkParams): ReactNode => {
  const { href, label, title, modifier } = params;
  let className = 'Bp-foot__card';
  if (modifier) {
    className = `${className} ${modifier}`;
  }
  return (
    <Link to={href} className={className}>
      <div className="Bp-foot__lbl">{label}</div>
      <div className="Bp-foot__title">{title}</div>
    </Link>
  );
};

export const renderDocPrev = (params: {
  slug?: string;
  title?: string;
  previousLabel: string;
}): ReactNode => {
  const { slug, title, previousLabel } = params;
  if (!slug || !title) {
    return <div />;
  }
  return renderDocFootLink({
    href: DOC_PATH(slug),
    label: previousLabel,
    title,
  });
};

export const renderDocNext = (params: {
  slug?: string;
  title?: string;
  nextLabel: string;
}): ReactNode => {
  const { slug, title, nextLabel } = params;
  if (!slug || !title) {
    return null;
  }
  return renderDocFootLink({
    href: DOC_PATH(slug),
    label: nextLabel,
    title,
    modifier: DOC_FOOT_NEXT_MODIFIER,
  });
};
