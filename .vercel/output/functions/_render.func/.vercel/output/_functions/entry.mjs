import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_DNVE612S.mjs';
import { manifest } from './manifest_CMuEsLjG.mjs';
import { onRequest } from './_noop-middleware.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/blog-posts/restore.astro.mjs');
const _page2 = () => import('./pages/api/blog-posts/update-batch.astro.mjs');
const _page3 = () => import('./pages/api/blog-posts/update-slug.astro.mjs');
const _page4 = () => import('./pages/api/domains/change.astro.mjs');
const _page5 = () => import('./pages/api/pages/restore.astro.mjs');
const _page6 = () => import('./pages/api/pages/update-batch.astro.mjs');
const _page7 = () => import('./pages/api/pages/update-slug.astro.mjs');
const _page8 = () => import('./pages/api/templates/change.astro.mjs');
const _page9 = () => import('./pages/api/templates/change-blog.astro.mjs');
const _page10 = () => import('./pages/blog-posts.astro.mjs');
const _page11 = () => import('./pages/callback.astro.mjs');
const _page12 = () => import('./pages/pages.astro.mjs');
const _page13 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/blog-posts/restore.js", _page1],
    ["src/pages/api/blog-posts/update-batch.js", _page2],
    ["src/pages/api/blog-posts/update-slug.js", _page3],
    ["src/pages/api/domains/change.js", _page4],
    ["src/pages/api/pages/restore.js", _page5],
    ["src/pages/api/pages/update-batch.js", _page6],
    ["src/pages/api/pages/update-slug.js", _page7],
    ["src/pages/api/templates/change.js", _page8],
    ["src/pages/api/templates/change-blog.js", _page9],
    ["src/pages/blog-posts.astro", _page10],
    ["src/pages/callback.astro", _page11],
    ["src/pages/pages.astro", _page12],
    ["src/pages/index.astro", _page13]
]);
const serverIslandMap = new Map();

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: onRequest
});
const _args = {
    "middlewareSecret": "6468151b-998c-414f-be2e-edb17580cd6f",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
