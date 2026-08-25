import { useState, type FC, type FormEvent } from 'react';
import { Button, Typography } from '@forgedevstack/bear';
import { DocShell } from '@components/DocShell';
import { useLingo } from '@forgedevstack/lingo';
import { EMPTY_STRING } from '@const/strings.const';
import { ASK_AI_MAX_CHARS } from '@const/numbers.const';
import { answerFromDocs } from '@utils/askAi.utils';

export const AskAi: FC = () => {
  const { t } = useLingo();
  const [question, setQuestion] = useState(EMPTY_STRING);
  const [answer, setAnswer] = useState(EMPTY_STRING);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setAnswer(answerFromDocs(question));
  };

  return (
    <DocShell activeTab="docs">
      <div className="Bp-content Bp-ask">
        <Typography variant="h1">{t('askAi.title')}</Typography>
        <Typography variant="body1">{t('askAi.lead')}</Typography>
        <div className="Bp-callout">
          <p>{t('askAi.callout')}</p>
        </div>
        <p className="Bp-p">{t('askAi.stub')}</p>
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
