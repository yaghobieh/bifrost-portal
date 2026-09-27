import { useState, type FC } from 'react';
import { Badge, Button, Flex, Switch, Typography } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import { downloadPostmanCollection } from '../../DeveloperPages.utils';

export const ApiEndpointsView: FC = () => {
  const { t } = useI18n();
  const [devMode, setDevMode] = useState(true);
  const [copied, setCopied] = useState(false);

  const exampleJson = `{
  "data": [
    {
      "id": 1042,
      "title": "Getting started with GraphQL",
      "slug": "getting-started-graphql",
      "status": "published",
      "locale": "en",
      "updatedAt": "2026-09-27T08:12:00Z"
    }
  ],
  "meta": { "page": 1, "pageSize": 25, "total": 96 }
}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(exampleJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="anchor-api-view">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-1">
            API Reference &amp; Endpoints
          </Typography>
          <Typography variant="body2" className="text-sm text-gray-500">
            Every content type is exposed automatically over REST and GraphQL.
          </Typography>
        </div>
        <Flex gap={3} align="center" className="flex-wrap">
          <Flex gap={2} align="center" className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
            <Typography variant="caption" className="text-xs font-semibold text-gray-700">
              Dev Mode
            </Typography>
            <Switch
              id="cms-dev-mode-toggle"
              checked={devMode}
              onCheckedChange={setDevMode}
            />
          </Flex>
          {devMode && (
            <Button
              variant="primary"
              size="sm"
              onClick={downloadPostmanCollection}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold"
            >
              📥 Download Postman Collection (.json)
            </Button>
          )}
          <Button variant="outline" size="sm">
            View full reference
          </Button>
        </Flex>
      </div>

      {devMode && (
        <div className="mb-6 p-4 rounded-lg bg-pink-50 border border-pink-200 flex items-center justify-between">
          <Flex gap={2} align="center">
            <Badge variant="info">Dev Mode Active</Badge>
            <Typography variant="body2" className="text-sm text-pink-900">
              Postman collection v2.1 with environments and live headers is ready for export.
            </Typography>
          </Flex>
          <Button
            size="sm"
            variant="ghost"
            onClick={downloadPostmanCollection}
            className="text-pink-700 font-medium"
          >
            Export Collection (.json)
          </Button>
        </div>
      )}

      {/* REST Endpoints panel */}
      <div className="anchor-panel mb-6">
        <div className="anchor-panel-head">
          <h3>REST Endpoints</h3>
        </div>
        <div className="anchor-endpoint-row">
          <span className="anchor-method get">GET</span>
          <div>
            <div className="path">/api/articles</div>
            <div className="desc">List articles, with filtering, sorting, and pagination</div>
          </div>
        </div>
        <div className="anchor-endpoint-row">
          <span className="anchor-method get">GET</span>
          <div>
            <div className="path">/api/articles/:id</div>
            <div className="desc">Fetch a single article by ID</div>
          </div>
        </div>
        <div className="anchor-endpoint-row">
          <span className="anchor-method post">POST</span>
          <div>
            <div className="path">/api/articles</div>
            <div className="desc">Create a new article entry</div>
          </div>
        </div>
        <div className="anchor-endpoint-row">
          <span className="anchor-method put">PUT</span>
          <div>
            <div className="path">/api/articles/:id</div>
            <div className="desc">Update an existing article</div>
          </div>
        </div>
        <div className="anchor-endpoint-row">
          <span className="anchor-method delete">DELETE</span>
          <div>
            <div className="path">/api/articles/:id</div>
            <div className="desc">Remove an article from database</div>
          </div>
        </div>
      </div>

      {/* Example Response code block */}
      <div className="anchor-panel mb-6">
        <div className="anchor-panel-head">
          <h3>Example Response</h3>
        </div>
        <div className="p-4">
          <div className="anchor-code-block">
            <button
              type="button"
              className="copy-btn"
              onClick={() => void onCopy()}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <div className="text-pink-300 font-bold mb-2">
              GET /api/articles?locale=en&amp;status=published
            </div>
            <pre className="m-0 font-mono text-xs">{exampleJson}</pre>
          </div>
        </div>
      </div>

      {/* API Tokens */}
      <div className="anchor-panel mb-6">
        <div className="anchor-panel-head">
          <h3>API Tokens</h3>
          <Button size="sm" variant="primary" className="bg-pink-600 hover:bg-pink-700 text-white">
            ＋ Generate Token
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Access</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Last used</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-semibold text-gray-900">Storefront — read only</div>
                  <div className="text-xs text-gray-400 font-mono">tk_live_4f2a…c91b</div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="info">Read-only</Badge>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs">3 hours ago</td>
                <td className="py-3 px-4 text-gray-500 text-xs">2 minutes ago</td>
                <td className="py-3 px-4 text-right">
                  <Button size="sm" variant="ghost">✎</Button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-semibold text-gray-900">Marketing site</div>
                  <div className="text-xs text-gray-400 font-mono">tk_live_88e1…40aa</div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="info">Read-only</Badge>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs">2 weeks ago</td>
                <td className="py-3 px-4 text-gray-500 text-xs">1 hour ago</td>
                <td className="py-3 px-4 text-right">
                  <Button size="sm" variant="ghost">✎</Button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-semibold text-gray-900">CI Pipeline</div>
                  <div className="text-xs text-gray-400 font-mono">tk_live_99d3…aa52</div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="success">Full Access</Badge>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs">1 month ago</td>
                <td className="py-3 px-4 text-gray-500 text-xs">Yesterday</td>
                <td className="py-3 px-4 text-right">
                  <Button size="sm" variant="ghost">✎</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
