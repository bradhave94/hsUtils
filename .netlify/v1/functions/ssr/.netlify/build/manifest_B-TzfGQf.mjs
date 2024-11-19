import 'cookie';
import 'kleur/colors';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_HEADER, h as decodeKey } from './chunks/astro/server_rCJ8By33.mjs';
import 'clsx';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = (ctx, next) => {
  ctx.request.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return next();
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/bradhave/Documents/workspace/hubspot/api/hsUtils/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/blog-posts/restore","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/blog-posts\\/restore\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"blog-posts","dynamic":false,"spread":false}],[{"content":"restore","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/blog-posts/restore.js","pathname":"/api/blog-posts/restore","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/blog-posts/update-batch","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/blog-posts\\/update-batch\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"blog-posts","dynamic":false,"spread":false}],[{"content":"update-batch","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/blog-posts/update-batch.js","pathname":"/api/blog-posts/update-batch","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/blog-posts/update-slug","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/blog-posts\\/update-slug\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"blog-posts","dynamic":false,"spread":false}],[{"content":"update-slug","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/blog-posts/update-slug.js","pathname":"/api/blog-posts/update-slug","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/domains/change","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/domains\\/change\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"domains","dynamic":false,"spread":false}],[{"content":"change","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/domains/change.js","pathname":"/api/domains/change","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/pages/change-domain","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/pages\\/change-domain\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"pages","dynamic":false,"spread":false}],[{"content":"change-domain","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/pages/change-domain.js","pathname":"/api/pages/change-domain","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/pages/restore","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/pages\\/restore\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"pages","dynamic":false,"spread":false}],[{"content":"restore","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/pages/restore.js","pathname":"/api/pages/restore","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/pages/update-batch","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/pages\\/update-batch\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"pages","dynamic":false,"spread":false}],[{"content":"update-batch","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/pages/update-batch.js","pathname":"/api/pages/update-batch","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/pages/update-slug","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/pages\\/update-slug\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"pages","dynamic":false,"spread":false}],[{"content":"update-slug","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/pages/update-slug.js","pathname":"/api/pages/update-slug","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/templates/change","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/templates\\/change\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"templates","dynamic":false,"spread":false}],[{"content":"change","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/templates/change.js","pathname":"/api/templates/change","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/templates/change-blog","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/templates\\/change-blog\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"templates","dynamic":false,"spread":false}],[{"content":"change-blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/templates/change-blog.js","pathname":"/api/templates/change-blog","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Dh8oDUM8.js"}],"styles":[{"type":"external","src":"/_astro/blog-posts.NVD_cYSi.css"},{"type":"inline","content":".custom-checkbox[data-astro-cid-bf55uk7y]{-moz-appearance:none;appearance:none;-webkit-appearance:none;width:1.5rem;height:1.5rem;border:2px solid #4a5568;border-radius:.25rem;background-color:#2d3748;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;margin-right:.5rem;transition:all .2s ease-in-out}.custom-checkbox[data-astro-cid-bf55uk7y]:checked{--tw-border-opacity: 1;border-color:rgb(96 165 250 / var(--tw-border-opacity));--tw-bg-opacity: 1;background-color:rgb(37 99 235 / var(--tw-bg-opacity))}.custom-checkbox[data-astro-cid-bf55uk7y]:checked:after{content:\"✔\";color:#fff;font-size:14px;font-weight:700}.custom-checkbox[data-astro-cid-bf55uk7y]:focus{outline:none;box-shadow:0 0 0 3px #4299e180}.custom-checkbox[data-astro-cid-bf55uk7y]:hover{border-color:#4299e1}\n.modal{display:none}.modal-content{max-height:90vh}.file-tree-container{scrollbar-width:thin;scrollbar-color:#4B5563 #1F2937}.file-tree-container::-webkit-scrollbar{width:8px}.file-tree-container::-webkit-scrollbar-track{background:#1f2937}.file-tree-container::-webkit-scrollbar-thumb{background-color:#4b5563;border-radius:4px}.file,.folder>details{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.3s}.current-template{background-color:rgb(124 45 18 / var(--tw-bg-opacity));--tw-bg-opacity: .5}.selected-template{background-color:rgb(20 83 45 / var(--tw-bg-opacity));--tw-bg-opacity: .5}#confirmTemplateChange:disabled{cursor:not-allowed;opacity:.5}@media (max-width: 640px){.modal-content{max-height:95vh}}\n"}],"routeData":{"route":"/blog-posts","isIndex":false,"type":"page","pattern":"^\\/blog-posts\\/?$","segments":[[{"content":"blog-posts","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog-posts.astro","pathname":"/blog-posts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/blog-posts.NVD_cYSi.css"},{"type":"inline","content":"main[data-astro-cid-62g22v6u]{margin:auto;padding:1rem;width:800px;max-width:calc(100% - 2rem);color:#fff;font-size:20px;line-height:1.6}.button[data-astro-cid-62g22v6u]{display:inline-block;padding:10px 20px;background-color:#ff7a59;color:#fff;text-decoration:none;border-radius:5px;font-weight:700}\n"}],"routeData":{"route":"/callback","isIndex":false,"type":"page","pattern":"^\\/callback\\/?$","segments":[[{"content":"callback","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/callback.astro","pathname":"/callback","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.CxNipRHz.js"}],"styles":[{"type":"external","src":"/_astro/blog-posts.NVD_cYSi.css"},{"type":"inline","content":".custom-checkbox[data-astro-cid-35cxyesp]{-moz-appearance:none;appearance:none;-webkit-appearance:none;width:1.5rem;height:1.5rem;border:2px solid #4a5568;border-radius:.25rem;background-color:#2d3748;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;margin-right:.5rem;transition:all .2s ease-in-out}.custom-checkbox[data-astro-cid-35cxyesp]:checked{--tw-border-opacity: 1;border-color:rgb(192 132 252 / var(--tw-border-opacity));--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.custom-checkbox[data-astro-cid-35cxyesp]:checked:after{content:\"✔\";color:#fff;font-size:14px;font-weight:700}.custom-checkbox[data-astro-cid-35cxyesp]:focus{outline:none;box-shadow:0 0 0 3px #4299e180}.custom-checkbox[data-astro-cid-35cxyesp]:hover{border-color:#4299e1}\n.modal{display:none}.modal-content{max-height:90vh}.file-tree-container{scrollbar-width:thin;scrollbar-color:#4B5563 #1F2937}.file-tree-container::-webkit-scrollbar{width:8px}.file-tree-container::-webkit-scrollbar-track{background:#1f2937}.file-tree-container::-webkit-scrollbar-thumb{background-color:#4b5563;border-radius:4px}.file,.folder>details{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.3s}.current-template{background-color:rgb(124 45 18 / var(--tw-bg-opacity));--tw-bg-opacity: .5}.selected-template{background-color:rgb(20 83 45 / var(--tw-bg-opacity));--tw-bg-opacity: .5}#confirmTemplateChange:disabled{cursor:not-allowed;opacity:.5}@media (max-width: 640px){.modal-content{max-height:95vh}}\n"}],"routeData":{"route":"/pages","isIndex":false,"type":"page","pattern":"^\\/pages\\/?$","segments":[[{"content":"pages","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/pages.astro","pathname":"/pages","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/blog-posts.NVD_cYSi.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/bradhave/Documents/workspace/hubspot/api/hsUtils/src/pages/blog-posts.astro",{"propagation":"none","containsHead":true}],["C:/Users/bradhave/Documents/workspace/hubspot/api/hsUtils/src/pages/callback.astro",{"propagation":"none","containsHead":true}],["C:/Users/bradhave/Documents/workspace/hubspot/api/hsUtils/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/bradhave/Documents/workspace/hubspot/api/hsUtils/src/pages/pages.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/blog-posts/restore@_@js":"pages/api/blog-posts/restore.astro.mjs","\u0000@astro-page:src/pages/api/blog-posts/update-batch@_@js":"pages/api/blog-posts/update-batch.astro.mjs","\u0000@astro-page:src/pages/api/blog-posts/update-slug@_@js":"pages/api/blog-posts/update-slug.astro.mjs","\u0000@astro-page:src/pages/api/domains/change@_@js":"pages/api/domains/change.astro.mjs","\u0000@astro-page:src/pages/api/pages/change-domain@_@js":"pages/api/pages/change-domain.astro.mjs","\u0000@astro-page:src/pages/api/pages/restore@_@js":"pages/api/pages/restore.astro.mjs","\u0000@astro-page:src/pages/api/pages/update-batch@_@js":"pages/api/pages/update-batch.astro.mjs","\u0000@astro-page:src/pages/api/pages/update-slug@_@js":"pages/api/pages/update-slug.astro.mjs","\u0000@astro-page:src/pages/api/templates/change@_@js":"pages/api/templates/change.astro.mjs","\u0000@astro-page:src/pages/api/templates/change-blog@_@js":"pages/api/templates/change-blog.astro.mjs","\u0000@astro-page:src/pages/blog-posts@_@astro":"pages/blog-posts.astro.mjs","\u0000@astro-page:src/pages/callback@_@astro":"pages/callback.astro.mjs","\u0000@astro-page:src/pages/pages@_@astro":"pages/pages.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_B-TzfGQf.mjs","/astro/hoisted.js?q=1":"_astro/hoisted.CxNipRHz.js","/astro/hoisted.js?q=0":"_astro/hoisted.Dh8oDUM8.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/blog-posts.NVD_cYSi.css","/favicon.svg","/_astro/hoisted.CxNipRHz.js","/_astro/hoisted.Dh8oDUM8.js"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"bwvr++5/coqMoX6KbR56EpVXS3gIHUxzJpwxr9EhpA4=","experimentalEnvGetSecretEnabled":false});

export { manifest };
