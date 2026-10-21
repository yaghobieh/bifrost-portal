if (typeof (import.meta as any).env === 'undefined') {
  (import.meta as any).env = { ...process.env };
}

import test from 'node:test';
import assert from 'node:assert/strict';

test('Alloy AI CMS Agent — Acceptance Criteria (CMS-239)', async (t) => {
  const { AGENT_AVATAR_INITIALS } = await import(
    '../src/pages/Cms/CmsShell/cmsAgent.const'
  );

  await t.test('should brand agent with AL initials', () => {
    assert.equal(AGENT_AVATAR_INITIALS, 'AL');
  });

  await t.test('should parse structured cms-action blocks correctly', async () => {
    const rawAiResponse = `Here is your landing page draft:
\`\`\`cms-action
{
  "action": "create_page",
  "data": {
    "title": "Welcome Page",
    "slug": "welcome",
    "template": "landing",
    "content": "# Welcome to our site"
  }
}
\`\`\`
Let me know if you would like any edits.`;

    const match = /```cms-action\s*([\s\S]*?)\s*```/.exec(rawAiResponse);
    assert.ok(match, 'Should match action block');
    const parsed = JSON.parse(match[1]);
    assert.equal(parsed.action, 'create_page');
    assert.equal(parsed.data.title, 'Welcome Page');
    assert.equal(parsed.data.slug, 'welcome');
  });

  await t.test('should strictly name the model alloy alloy-1.5 flash', async () => {
    const { en } = await import('../src/i18n/en');
    assert.equal(en.cmsShell.chatAssistant, 'alloy alloy-1.5 flash');
    assert.equal(en.cmsShell.agentName, 'alloy alloy-1.5 flash');
    assert.ok(!en.cmsShell.chatHint.toLowerCase().includes('deepseek'));
    assert.ok(!en.cmsShell.chatPlaceholder.toLowerCase().includes('deepseek'));
  });
});
