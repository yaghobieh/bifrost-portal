import { useEffect, useRef, useState, type FC, type FormEvent } from 'react';
import { Button, Typography } from '@forgedevstack/bear';
import { useLingo } from '@forgedevstack/lingo';
import { DocShell } from '@components/DocShell';
import { EMPTY_STRING, CMS_ASK_AI_SLUG } from '@const/strings.const';
import { ASK_AI_MAX_CHARS } from '@const/numbers.const';
import { answerFromNav } from '@utils/askAi.utils';
import { usePublicPage } from '@hooks/usePublicPage';
import { PageLoader } from '@components/PageLoader';
import { PublicPageCanvas } from '@components/PublicPageCanvas';
import { ASK_AI_TAB } from './AskAi.const';
import { askAiPageFromItem, isAbortError } from './AskAi.utils';

export const AskAi: FC = () => {
  const { t } = useLingo();
  const { item, loading } = usePublicPage(CMS_ASK_AI_SLUG);
  const page = askAiPageFromItem({ item });
  const [question, setQuestion] = useState(EMPTY_STRING);
  const [answer, setAnswer] = useState(EMPTY_STRING);
  const askAbort = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      askAbort.current?.abort();
    },
    [],
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    askAbort.current?.abort();
    const controller = new AbortController();
    askAbort.current = controller;
    void answerFromNav(question, (key) => t(key as never), controller.signal)
      .then(setAnswer)
      .catch((error: unknown) => {
        if (isAbortError(error)) {
          return;
        }
        setAnswer(EMPTY_STRING);
      });
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!page) {
    return (
      <DocShell activeTab={ASK_AI_TAB}>
        <div className="Bp-content Bp-ask">
          <Typography variant="h1">{t('docsMissing')}</Typography>
        </div>
      </DocShell>
    );
  }

  return (
    <DocShell activeTab={ASK_AI_TAB}>
      <div className="Bp-content Bp-ask">
        <Typography variant="h1">{page.title}</Typography>
        <PublicPageCanvas payload={item?.payload} />
        <Typography variant="body1">{page.lead}</Typography>
        {page.note && (
          <div className="Bp-callout">
            <p>{page.note}</p>
          </div>
        )}
        <p className="Bp-p">{page.body}</p>
        <form onSubmit={onSubmit}>
          <textarea
            maxLength={ASK_AI_MAX_CHARS}
            value={question}
            placeholder={t('askAi.placeholder')}
            onChange={(event) => setQuestion(event.target.value)}
          />
          <Button variant="bifrost" type="submit">{t('askAi.submit')}</Button>
        </form>
        {answer && <div className="Bp-ask__out">{answer}</div>}
      </div>
    </DocShell>
  );
};
