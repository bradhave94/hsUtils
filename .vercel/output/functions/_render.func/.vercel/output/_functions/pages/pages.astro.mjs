/* empty css                                      */
import { c as createComponent, r as renderTemplate, m as maybeRenderHead, a as addAttribute, e as createAstro, g as defineScriptVars, f as renderComponent } from '../chunks/astro/server_QBnrvN_q.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_D4YqzTMS.mjs';
import 'clsx';
/* empty css                                 */
import { $ as $$TemplateModal, a as $$DomainModal } from '../chunks/DomainModal_BloStABa.mjs';
import { k as getSitePages, e as getDomains } from '../chunks/api_D5lN87jw.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$PageTree = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PageTree;
  const { pages } = Astro2.props;
  function buildPageTree(pages2) {
    const searchParams = new URLSearchParams(Astro2.url.search);
    const groupPages2 = searchParams.get("group") !== "false";
    const tree = groupPages2 ? { published: {}, draft: {}, archived: {} } : { all: {}, archived: {} };
    pages2.forEach((page) => {
      const templatePath = page.templatePath || "No Template";
      const [folder, ...templateParts] = templatePath.split("/");
      const template = templateParts.join("/") || "No Template";
      let section = "all";
      if (groupPages2) {
        if (page.state === "DRAFT" && !page.archived) {
          section = "draft";
        } else if (page.archived) {
          section = "archived";
        } else {
          section = "published";
        }
      } else {
        section = page.archived ? "archived" : "all";
      }
      if (!tree[section][folder]) {
        tree[section][folder] = {};
      }
      if (!tree[section][folder][template]) {
        tree[section][folder][template] = [];
      }
      tree[section][folder][template].push(page);
    });
    for (const section in tree) {
      tree[section] = Object.fromEntries(
        Object.entries(tree[section]).sort(([a], [b]) => a.localeCompare(b))
      );
    }
    return tree;
  }
  function getStatusLabel(page) {
    if (page.archivedAt && !page.archivedAt.includes("1970")) return "Archived";
    switch (page.state) {
      case "PUBLISHED":
        return "Published";
      case "DRAFT":
        return "Draft";
      case "SCHEDULED":
        return "Scheduled";
      case "PUBLISHED_OR_SCHEDULED":
        return "Published";
      default:
        return page.state;
    }
  }
  function getStatusClass(status) {
    switch (status.toLowerCase()) {
      case "published":
        return "text-green-500";
      case "draft":
        return "text-yellow-500";
      case "archived":
        return "text-red-500";
      case "scheduled":
        return "text-blue-500";
      default:
        return "text-red-500";
    }
  }
  function formatDate(dateString) {
    if (!dateString || dateString === "1970-01-01T00:00:00Z") {
      return "N/A";
    }
    return new Date(dateString).toLocaleString();
  }
  const pageTree = buildPageTree(pages);
  const portalId = Astro2.cookies.get("hubspot_portal_id")?.value;
  const groupPages = new URLSearchParams(Astro2.url.search).get("group") !== "false";
  return renderTemplate`${maybeRenderHead()}<div class="page-tree-container" data-astro-cid-35cxyesp> <div class="flex space-x-4 mb-4" data-astro-cid-35cxyesp> <button id="changeSelectedBtn" class="change-selected-btn bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled data-astro-cid-35cxyesp>Change Selected Template</button> <button id="changeSelectedDomainsBtn" class="change-selected-btn bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled data-astro-cid-35cxyesp>Change Selected Domains</button> <button id="changeSelectedSlugsBtn" class="change-selected-btn bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled data-astro-cid-35cxyesp>Change Selected Slugs</button> </div> ${(groupPages ? ["published", "draft", "archived"] : ["all", "archived"]).map((section) => renderTemplate`<div data-astro-cid-35cxyesp> <h2 class="text-3xl font-bold mb-6 mt-8 capitalize text-blue-200" data-astro-cid-35cxyesp> ${section === "all" ? "All Pages" : `${section} Pages`} </h2> <ul class="space-y-3" data-astro-cid-35cxyesp> ${Object.entries(pageTree[section]).map(([folder, templates]) => renderTemplate`<li class="folder-group" data-astro-cid-35cxyesp> <details class="bg-gray-800 rounded-lg p-4 open" data-astro-cid-35cxyesp> <summary class="flex items-center cursor-pointer" data-astro-cid-35cxyesp> <span class="mr-2 text-xl" data-astro-cid-35cxyesp>📁</span> <span class="text-xl font-semibold text-white" data-astro-cid-35cxyesp>${folder}</span> </summary> <ul class="mt-4 space-y-4" data-astro-cid-35cxyesp> ${Object.entries(templates).map(([templatePath, pages2]) => renderTemplate`<li class="template-group" data-astro-cid-35cxyesp> <details class="bg-gray-700 rounded-lg p-4 open" data-astro-cid-35cxyesp> <summary class="flex items-center justify-between cursor-pointer" data-astro-cid-35cxyesp> <div class="flex items-center" data-astro-cid-35cxyesp> <input type="checkbox" class="template-checkbox custom-checkbox mr-2"${addAttribute(`${folder}/${templatePath}`, "data-template-path")} data-astro-cid-35cxyesp> <span class="text-lg font-semibold text-white" data-astro-cid-35cxyesp>${templatePath}</span> </div> </summary> <ul class="mt-4 space-y-4" data-astro-cid-35cxyesp> ${pages2.map((page) => {
    const status = getStatusLabel(page);
    return renderTemplate`<li class="page bg-gray-600 rounded-lg p-4" data-astro-cid-35cxyesp> <div class="flex items-center justify-between" data-astro-cid-35cxyesp> <div class="flex-grow" data-astro-cid-35cxyesp> <div class="flex items-center" data-astro-cid-35cxyesp> <label class="flex items-center cursor-pointer" data-astro-cid-35cxyesp> <input type="checkbox" class="page-checkbox custom-checkbox mr-2"${addAttribute(page.id, "data-page-id")}${addAttribute(page.template_path, "data-template-path")} data-astro-cid-35cxyesp> <h3 class="text-2xl font-semibold text-blue-400" data-astro-cid-35cxyesp> ${page.name} </h3> </label> </div> <div class="mt-2 text-sm text-gray-300" data-astro-cid-35cxyesp> <p data-astro-cid-35cxyesp>URL: ${page.absolute_url}</p> <p data-astro-cid-35cxyesp>Status: <span${addAttribute(getStatusClass(status), "class")} data-astro-cid-35cxyesp>${status}</span></p> <p data-astro-cid-35cxyesp>Created: ${formatDate(page.createdAt)}</p> <p data-astro-cid-35cxyesp>Updated: ${formatDate(page.updatedAt)}</p> ${page.archivedAt && !page.archivedAt.includes("1970") && renderTemplate`<p data-astro-cid-35cxyesp>Archived At: ${formatDate(page.archivedAt)}</p>`} </div> </div> <div class="flex flex-col space-y-2" data-astro-cid-35cxyesp> <button class="change-template-btn bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded transition duration-300"${addAttribute(page.id, "data-page-id")}${addAttribute(page.template_path, "data-template-path")} data-astro-cid-35cxyesp>Change Template</button> <button class="change-domain-btn bg-red-600 hover:bg-blue-700 text-white py-1 px-3 rounded transition duration-300"${addAttribute(page.id, "data-page-id")} data-astro-cid-35cxyesp>Change Domain</button> <button class="change-slug-btn bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded transition duration-300"${addAttribute(page.id, "data-page-id")}${addAttribute(page.absolute_url, "data-current-url")} data-astro-cid-35cxyesp>Change Slug</button> <a${addAttribute(page.absolute_url, "href")} target="_blank" rel="noopener noreferrer" class="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded transition duration-300 text-center" data-astro-cid-35cxyesp>View Live Page</a> <a${addAttribute(`https://app.hubspot.com/pages/${portalId}/editor/${page.id}`, "href")} target="_blank" rel="noopener noreferrer" class="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded transition duration-300 text-center" data-astro-cid-35cxyesp>Edit in HubSpot</a> ${page.archived && renderTemplate`<button class="restore-page-btn bg-orange-500 hover:bg-orange-600 text-white py-1 px-3 rounded transition duration-300"${addAttribute(page.id, "data-page-id")} data-astro-cid-35cxyesp>Restore Page</button>`} </div> </div> </li>`;
  })} </ul> </details> </li>`)} </ul> </details> </li>`)} </ul> </div>`)} </div> <dialog id="slugModal" class="bg-gray-800 p-6 rounded-lg shadow-xl text-white w-[800px]" data-astro-cid-35cxyesp> <div class="flex justify-between items-center mb-4" data-astro-cid-35cxyesp> <h3 class="text-xl font-bold" data-astro-cid-35cxyesp>Change URL Slugs</h3> <button class="close-modal-btn text-gray-400 hover:text-white" data-astro-cid-35cxyesp>&times;</button> </div> <div class="space-y-4" data-astro-cid-35cxyesp> <div class="flex space-x-2" data-astro-cid-35cxyesp> <button class="pattern-btn bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded" data-pattern="#^(.*)$#subroute/$1" data-astro-cid-35cxyesp>Add Subroute</button> <button class="pattern-btn bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded" data-pattern="#^\/find(.*)$#/replace$1" data-astro-cid-35cxyesp>Replace Section</button> </div> <div data-astro-cid-35cxyesp> <label class="block text-sm font-medium mb-1" data-astro-cid-35cxyesp>Pattern</label> <input type="text" id="patternInput" class="w-full p-2 bg-gray-700 rounded" placeholder="#pattern#replacement" data-astro-cid-35cxyesp> <div class="mt-1 text-sm text-gray-400" data-astro-cid-35cxyesp>
Examples:
<ul class="list-disc list-inside ml-2 space-y-1" data-astro-cid-35cxyesp> <li data-astro-cid-35cxyesp>#^(.*)$#subroute/$1 → adds subroute/ to start</li> <li data-astro-cid-35cxyesp>#^\\/find(.*)$#/replace$1 → changes /find to /replace</li> <li data-astro-cid-35cxyesp>Use $1 to reference captured content</li> </ul> </div> </div> <div data-astro-cid-35cxyesp> <label class="block text-sm font-medium mb-1" data-astro-cid-35cxyesp>Current URLs</label> <textarea id="currentUrls" class="w-full h-32 p-2 bg-gray-700 rounded" readonly data-astro-cid-35cxyesp></textarea> <button class="copy-urls-btn mt-1 text-sm text-blue-400 hover:text-blue-300" data-astro-cid-35cxyesp>Copy URLs</button> </div> <div data-astro-cid-35cxyesp> <label class="block text-sm font-medium mb-1" data-astro-cid-35cxyesp>Preview</label> <textarea id="previewUrls" class="w-full h-32 p-2 bg-gray-700 rounded" readonly data-astro-cid-35cxyesp></textarea> </div> <div class="flex justify-end space-x-3 mt-4" data-astro-cid-35cxyesp> <button class="close-modal-btn bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded" data-astro-cid-35cxyesp>Cancel</button> <button id="applyChangesBtn" class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded" data-astro-cid-35cxyesp>Apply Changes</button> </div> </div> </dialog>  `;
}, "C:/Users/bradhave/Documents/workspace/hubspot/api/hsUtils/src/components/PageTree.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const prerender = false;
const $$Pages = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Pages;
  let pages = [];
  let error = "";
  const accessTokenCookie = Astro2.cookies.get("hubspot_access_token");
  const accessToken = accessTokenCookie ? accessTokenCookie.value : null;
  const portalIdCookie = Astro2.cookies.get("hubspot_portal_id");
  const portalId = portalIdCookie ? portalIdCookie.value : null;
  if (!accessToken || !portalId) {
    return Astro2.redirect("/?error=missing_credentials");
  }
  try {
    pages = await getSitePages(accessToken);
    pages.sort((a, b) => {
      const statusOrder = { PUBLISHED: 0, DRAFT: 1, ARCHIVED: 2 };
      const aStatus = a.archived ? "ARCHIVED" : a.state || "DRAFT";
      const bStatus = b.archived ? "ARCHIVED" : b.state || "DRAFT";
      return statusOrder[aStatus] - statusOrder[bStatus] || (a.name || "").localeCompare(b.name || "");
    });
  } catch (err) {
    console.error("Error fetching pages:", err);
    error = `Failed to fetch pages: ${err instanceof Error ? err.message : "Unknown error"}`;
  }
  function buildPageTree(pages2) {
    const tree = { published: {}, draft: {}, archived: {} };
    pages2.forEach((page) => {
      const [folder, ...templateParts] = (page.templatePath || "No Template").split("/");
      const template = templateParts.join("/") || "No Template";
      const section = page.archived ? "archived" : page.state === "DRAFT" ? "draft" : "published";
      tree[section][folder] = tree[section][folder] || {};
      tree[section][folder][template] = tree[section][folder][template] || [];
      tree[section][folder][template].push(page);
    });
    for (const section in tree) {
      tree[section] = Object.fromEntries(
        Object.entries(tree[section]).sort(([a], [b]) => a.localeCompare(b))
      );
    }
    return tree;
  }
  pages.length > 0 ? buildPageTree(pages) : null;
  const API_ENDPOINTS = {
    changeTemplate: "/api/templates/change",
    updateBatch: "/api/pages/update-batch",
    restorePage: "/api/pages/restore"
  };
  await getDomains(accessToken);
  return renderTemplate(_a || (_a = __template(["", " <script>(function(){", "\n    document.addEventListener('DOMContentLoaded', () => {\n        // Helper function for API calls\n        async function apiCall(endpoint, data) {\n            const response = await fetch(endpoint, {\n                method: 'POST',\n                headers: { 'Content-Type': 'application/json' },\n                body: JSON.stringify(data),\n            });\n            if (!response.ok) throw new Error('API call failed');\n            return response.json();\n        }\n\n        // Event listener for changing a single template\n        document.querySelectorAll('.change-template-btn').forEach(btn => {\n            btn.addEventListener('click', async () => {\n                const { pageId, templatePath: currentTemplatePath } = btn.dataset;\n                const newTemplatePath = await window.openTemplateModal(pageId, currentTemplatePath);\n                if (newTemplatePath) {\n                    try {\n                        await apiCall(API_ENDPOINTS.changeTemplate, { pageId, templatePath: newTemplatePath });\n                        alert('Template updated successfully!');\n                        location.reload();\n                    } catch (error) {\n                        handleError('Failed to update template. Please try again.');\n                    }\n                }\n            });\n        });\n\n        // Event listener for changing multiple templates\n        document.querySelectorAll('.change-all-templates-btn').forEach(btn => {\n            btn.addEventListener('click', async (e) => {\n                e.stopPropagation();\n                const { templatePath } = btn.dataset;\n                const pageIds = Array.from(btn.closest('details').querySelectorAll('.change-template-btn'))\n                    .map(btn => btn.getAttribute('data-page-id'));\n\n                const newTemplatePath = await window.openTemplateModal(pageIds, templatePath);\n                if (newTemplatePath) {\n                    try {\n                        await apiCall(API_ENDPOINTS.updateBatch, {\n                            inputs: pageIds.map(id => ({ id, templatePath: newTemplatePath }))\n                        });\n                        alert('Templates updated successfully!');\n                        location.reload();\n                    } catch (error) {\n                        handleError('Failed to update templates. Please try again.');\n                    }\n                }\n            });\n        });\n\n        // Event listener for restoring pages\n        document.querySelectorAll('.restore-page-btn').forEach(btn => {\n            btn.addEventListener('click', async () => {\n                const { pageId } = btn.dataset;\n                if (pageId) {\n                    try {\n                        const result = await apiCall(API_ENDPOINTS.restorePage, { pageId });\n                        if (result.success) {\n                            alert('Page restored successfully!');\n                            location.reload();\n                        } else {\n                            throw new Error(result.error || 'Failed to restore page');\n                        }\n                    } catch (error) {\n                        handleError('Failed to restore page. Please try again.');\n                    }\n                }\n            });\n        });\n    });\n})();<\/script>"])), renderComponent($$result, "Layout", $$Layout, { "title": "HubSpot Site Pages" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto max-w-4xl px-4 py-8"> <h1 class="text-4xl font-bold mb-8 text-blue-200">HubSpot Site Pages <span class="text-xl text-blue-500">(${pages.length} pages)</span></h1> <p class="text-sm max-w-xl mb-6 text-blue-100">Click a template to change all pages in that template. Click a page to change that page's template. Click <span class="text-orange-300">Restore Page</span> to restore an archived page.</p> ${error && renderTemplate`<p class="text-red-500 mb-6 p-4 bg-red-100 rounded-lg">${error}</p>`} ${pages.length === 0 ? renderTemplate`<p class="text-gray-400 text-xl">No pages found. ${error ? "An error occurred while fetching pages." : ""}</p>` : renderTemplate`${renderComponent($$result2, "PageTree", $$PageTree, { "pages": pages })}`} <a href="/" class="inline-block mt-8 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300">Back to Home</a> </main> ${renderComponent($$result2, "TemplateModal", $$TemplateModal, {})} ${renderComponent($$result2, "DomainModal", $$DomainModal, {})} ` }), defineScriptVars({ API_ENDPOINTS }));
}, "C:/Users/bradhave/Documents/workspace/hubspot/api/hsUtils/src/pages/pages.astro", void 0);

const $$file = "C:/Users/bradhave/Documents/workspace/hubspot/api/hsUtils/src/pages/pages.astro";
const $$url = "/pages";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Pages,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
