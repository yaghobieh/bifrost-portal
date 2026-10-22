if (typeof (import.meta as any).env === 'undefined') {
  (import.meta as any).env = { ...process.env };
}

import test from 'node:test';
import assert from 'node:assert/strict';

test('CMS-94: Real Writable AI Assistant Chat & Streaming Replies', async (t) => {
  const {
    loadChatHistory,
    saveChatHistory,
    generateContextualAiResponse,
    completeCmsChat,
    executeCmsAction,
  } = await import('../src/pages/Cms/CmsShell/CmsChat.utils');

  const {
    CMS_CHAT_HISTORY_LIMIT,
  } = await import('../src/pages/Cms/CmsShell/CmsChat.const');

  // Mock localStorage for node test environment
  const mockStorage: Record<string, string> = {};
  if (typeof globalThis.localStorage === 'undefined') {
    (globalThis as any).localStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, val: string) => {
        mockStorage[key] = val;
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      clear: () => {
        for (const k of Object.keys(mockStorage)) {
          delete mockStorage[k];
        }
      },
    };
  }

  await t.test('should persist chat history to storage and cap to history limit', () => {
    const messages = Array.from({ length: CMS_CHAT_HISTORY_LIMIT + 10 }, (_, i) => ({
      id: `msg-${i}`,
      role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
      text: `Message number ${i}`,
    }));

    saveChatHistory(messages);
    const loaded = loadChatHistory();
    assert.equal(loaded.length, CMS_CHAT_HISTORY_LIMIT);
    assert.equal(loaded[loaded.length - 1].id, `msg-${CMS_CHAT_HISTORY_LIMIT + 9}`);
  });

  await t.test('should generate structured landing page action proposal for page prompts', () => {
    const response = generateContextualAiResponse('Draft modern SaaS landing page');
    assert.equal(response.ok, true);
    assert.ok(response.text.includes('landing page'));
    assert.ok(response.action);
    assert.equal(response.action.action, 'create_page');
    assert.ok(response.action.data.title.includes('Draft'));
    assert.ok(response.usage);
    assert.ok(response.usage.totalTokens > 0);
  });

  await t.test('should generate structured article proposal for blog prompts', () => {
    const response = generateContextualAiResponse('Write a blog article on API design');
    assert.equal(response.ok, true);
    assert.ok(response.text.includes('blog article'));
    assert.ok(response.action);
    assert.equal(response.action.action, 'create_article');
    assert.ok(response.action.data.slug.startsWith('blog-'));
  });

  await t.test('should complete chat without token using local fallback simulation', async () => {
    const response = await completeCmsChat(undefined, 'Help me build a documentation site');
    assert.equal(response.ok, true);
    assert.ok(response.text.length > 20);
    assert.ok(response.usage?.totalTokens);
  });

  await t.test('should execute proposal actions in simulation or demo mode', async () => {
    const result = await executeCmsAction('demo-token', {
      action: 'create_page',
      data: {
        title: 'New Product Page',
        slug: 'new-product-page',
        content: '# New Product',
      },
    });

    assert.equal(result.ok, true);
    assert.ok(result.id);
  });
});
