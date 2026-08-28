import type { FC } from 'react';
import { Button, Card, Flex, Typography } from '@forgedevstack/bear';
import type { PageStartProps } from './PageStart.types';

export const PageStart: FC<PageStartProps> = (props) => {
  const { cards, onStart } = props;
  return (
    <div className="bifrost-cms-page-start">
      {cards.map((card) => {
        let cardClass = 'bifrost-cms-page-start__card';
        if (card.recommended) {
          cardClass = 'bifrost-cms-page-start__card bifrost-cms-page-start__card--rec';
        }
        return (
          <Card key={card.id} padding="md" className={cardClass}>
            <Flex direction="column" gap={3}>
              {card.recommended && card.tag ? (
                <Typography variant="caption" className="bifrost-cms-page-start__tag mb-0">
                  {card.tag}
                </Typography>
              ) : null}
              <Typography variant="h4" className="mb-0">
                {card.title}
              </Typography>
              <Typography variant="body2" className="bifrost-cms__muted mb-0">
                {card.body}
              </Typography>
              <Button
                size="sm"
                variant={card.recommended ? 'primary' : 'outline'}
                onClick={() => onStart(card.id)}
              >
                {card.cta}
              </Button>
            </Flex>
          </Card>
        );
      })}
    </div>
  );
};
