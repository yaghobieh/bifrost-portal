import { useEffect, useState, type FC } from 'react';
import { useParams } from '@forgedevstack/forge-compass/react';
import { Button, Flex, Typography } from '@forgedevstack/bear';
import { useLingo } from '@forgedevstack/lingo';
import { PortalNav } from '@components/PortalNav';
import { EMPTY_STRING } from '@const/strings.const';
import { fetchPublicBlogPost } from '@data/blog.api';
import { htmlFromPayload } from '@pages/Cms/ContentEdit/ContentEdit.utils';
import type { ContentItem } from '@sdk/modules/content';

export const BlogPost: FC = () => {
  const { t } = useLingo();
  const params = useParams<{ slug?: string }>();
  const slug = params.slug || EMPTY_STRING;
  const [item, setItem] = useState<ContentItem | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) {
      return;
    }
    void fetchPublicBlogPost(slug).then(setItem);
  }, [slug]);

  const onShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ url, title: item?.title });
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
  };

  return (
    <div className="Bl">
      <PortalNav showProductLink />
      <main className="Bl-blog Bl-blog--post">
        {!item ? (
          <Typography variant="h1">{t('blog.empty')}</Typography>
        ) : (
          <>
            <Flex justify="between" align="center" gap={3} className="flex-wrap">
              <Typography variant="h1">{item.title}</Typography>
              <Button size="sm" variant="outline" onClick={() => void onShare()}>
                {copied ? t('blog.shareCopied') : t('blog.share')}
              </Button>
            </Flex>
            <article
              className="Bl-blog__body"
              dangerouslySetInnerHTML={{ __html: htmlFromPayload(item.payload) }}
            />
          </>
        )}
      </main>
    </div>
  );
};
