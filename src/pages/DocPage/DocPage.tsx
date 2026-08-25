import type { FC, ReactNode } from 'react';
import { Link, useParams } from '@forgedevstack/forge-compass/react';
import { Typography } from '@forgedevstack/bear';
import { DocShell } from '@components/DocShell';
import { CodeBlock } from '@components/CodeBlock';
import { useLingo } from '@forgedevstack/lingo';
import { DOC_PAGES } from '@data/docs.data';
import { DEFAULT_DOC_SLUG, DOC_PATH } from '@const/routes.const';
import { GUIDE_SLUGS } from '@const/nav.const';
import { NUMBER_ZERO, NUMBER_ONE, NUMBER_TWO } from '@const/numbers.const';

const renderInline = (text: string): ReactNode => {
  const parts = text.split('`');
  return parts.map((part, index) =>
    index % NUMBER_TWO === NUMBER_ONE ? <code key={`${part}-${index}`}>{part}</code> : part,
  );
};

export const DocPage: FC = () => {
  const { t } = useLingo();
  const params = useParams<{ slug?: string }>();
  const slug = params.slug || DEFAULT_DOC_SLUG;
  const doc = DOC_PAGES[slug] ?? DOC_PAGES[DEFAULT_DOC_SLUG];
  const toc = doc.sections.map((section) => ({ id: section.id, label: section.heading }));
  const tab = GUIDE_SLUGS.includes(slug) ? 'guides' : 'docs';

  return (
    <DocShell toc={toc} activeToc={toc[NUMBER_ZERO]?.id} activeTab={tab}>
      <article className="Bp-content">
        <div className="Bp-crumb">
          {doc.crumb.split(' / ').slice(NUMBER_ZERO, -NUMBER_ONE).join(' / ')} / <b>{doc.title}</b>
        </div>
        <Typography variant="h1">{doc.title}</Typography>
        <Typography variant="body1">{doc.lead}</Typography>
        {doc.sections.map((section) => (
          <section key={section.id} id={section.id}>
            <Typography variant="h2">{section.heading}</Typography>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(NUMBER_ZERO, 24)} className="Bp-p">
                {renderInline(paragraph)}
              </p>
            ))}
            {section.callout && (
              <div className="Bp-callout">
                <p>{renderInline(section.callout)}</p>
              </div>
            )}
            {section.code && <CodeBlock lang={section.code.lang} source={section.code.source} />}
            {section.table && (
              <table className="Bp-table">
                <thead>
                  <tr>
                    {section.table.headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row) => (
                    <tr key={row.join('-')}>
                      {row.map((cell, index) => (
                        <td key={`${cell}-${index}`} className={index === row.length - NUMBER_ONE ? 'desc' : undefined}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        ))}
        <div className="Bp-foot">
          {doc.prev ? (
            <Link to={DOC_PATH(doc.prev.slug)} className="Bp-foot__card">
              <div className="Bp-foot__lbl">{t('previous')}</div>
              <div className="Bp-foot__title">{doc.prev.title}</div>
            </Link>
          ) : (
            <div />
          )}
          {doc.next && (
            <Link to={DOC_PATH(doc.next.slug)} className="Bp-foot__card is-next">
              <div className="Bp-foot__lbl">{t('next')}</div>
              <div className="Bp-foot__title">{doc.next.title}</div>
            </Link>
          )}
        </div>
      </article>
    </DocShell>
  );
};
