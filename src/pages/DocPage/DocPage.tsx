import type { FC } from 'react';
import { useParams } from '@forgedevstack/forge-compass/react';
import { Typography } from '@forgedevstack/bear';
import { DocShell } from '@components/DocShell';
import { CodeBlock } from '@components/CodeBlock';
import { useLingo } from '@forgedevstack/lingo';
import { DEFAULT_DOC_SLUG } from '@const/routes.const';
import { NUMBER_ZERO, NUMBER_ONE } from '@const/numbers.const';
import { usePublicPage } from '@hooks/usePublicPage';
import { mapCmsDoc } from '@data/docs.mapper';
import { PageLoader } from '@components/PageLoader';
import { StageCanvas, readCanvas } from '@components/StageCanvas';
import { DOC_CRUMB_SEP } from './DocPage.const';
import { docPageTab, renderDocNext, renderDocPrev, renderInline } from './DocPage.utils';

export const DocPage: FC = () => {
  const { t } = useLingo();
  const params = useParams<{ slug?: string }>();
  const slug = params.slug || DEFAULT_DOC_SLUG;
  const { item, loading } = usePublicPage(slug);
  const doc = item ? mapCmsDoc({ slug: item.slug, title: item.title, payload: item.payload }) : null;
  const canvas = item ? readCanvas(item.payload) : [];
  const tab = docPageTab(slug);

  if (loading) {
    return <PageLoader />;
  }

  if (!doc) {
    return (
      <DocShell activeTab={tab}>
        <article className="Bp-content">
          <Typography variant="h1">{t('docsMissing')}</Typography>
        </article>
      </DocShell>
    );
  }

  const toc = doc.sections.map((section) => ({ id: section.id, label: section.heading }));

  return (
    <DocShell toc={toc} activeToc={toc[NUMBER_ZERO]?.id} activeTab={tab}>
      <article className="Bp-content">
        <div className="Bp-crumb">
          {doc.crumb.split(DOC_CRUMB_SEP).slice(NUMBER_ZERO, -NUMBER_ONE).join(DOC_CRUMB_SEP)}
          {DOC_CRUMB_SEP}
          <b>{doc.title}</b>
        </div>
        <Typography variant="h1">{doc.title}</Typography>
        <Typography variant="body1">{doc.lead}</Typography>
        {canvas.length > NUMBER_ZERO && (
          <div className="Bp-stage">
            <StageCanvas nodes={canvas} />
          </div>
        )}
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
          {renderDocPrev({
            slug: doc.prev?.slug,
            title: doc.prev?.title,
            previousLabel: t('previous'),
          })}
          {renderDocNext({
            slug: doc.next?.slug,
            title: doc.next?.title,
            nextLabel: t('next'),
          })}
        </div>
      </article>
    </DocShell>
  );
};
