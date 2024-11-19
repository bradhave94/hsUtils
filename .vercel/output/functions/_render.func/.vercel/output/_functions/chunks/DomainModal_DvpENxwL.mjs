import { c as createComponent, r as renderTemplate, m as maybeRenderHead, f as renderComponent, e as createAstro, u as unescapeHTML, F as Fragment, a as addAttribute } from './astro/server_QBnrvN_q.mjs';
import 'kleur/colors';
import { d as getTemplates, e as getDomains } from './api_D5lN87jw.mjs';
/* empty css                              */
import 'clsx';

const $$Astro$1 = createAstro();
const $$TemplateModal = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$TemplateModal;
  let templates = null;
  const accessTokenCookie = Astro2.cookies.get("hubspot_access_token");
  const accessToken = accessTokenCookie ? accessTokenCookie.value : null;
  if (accessToken) {
    try {
      templates = await getTemplates(accessToken);
      templates.sort((a, b) => a.path.localeCompare(b.path));
    } catch (err) {
      console.error("Error fetching templates:", err);
      templates = null;
    }
  }
  function buildFileTree(templates2) {
    const tree = {};
    templates2.forEach((template) => {
      const parts = template.path.split("/");
      let currentLevel = tree;
      parts.forEach((part, index) => {
        if (!currentLevel[part]) {
          if (index === parts.length - 1) {
            currentLevel[part] = template;
          } else {
            currentLevel[part] = {};
          }
        }
        currentLevel = currentLevel[part];
      });
    });
    return tree;
  }
  function renderFileTree(tree) {
    let html = "";
    for (const [name, subtree] of Object.entries(tree)) {
      if (subtree.path) {
        html += `
            <li class="file bg-gray-600 rounded-lg p-4 cursor-pointer" data-template-path="${subtree.path}">
                <div class="flex items-center justify-between">
                    <div class="flex-grow">
                        <h3 class="text-lg font-semibold text-white">${subtree.label || subtree.filename}</h3>
                        <div class="mt-2 text-sm text-gray-300">
                            <p>Full Path: ${subtree.path}</p>
                        </div>
                    </div>
                </div>
            </li>`;
      } else {
        html += `
            <li class="folder-group">
                <details class="bg-gray-800 rounded-lg p-4 open">
                    <summary class="flex items-center cursor-pointer">
                        <span class="mr-2 text-xl">\u{1F4C1}</span>
                        <span class="text-xl font-semibold text-white">${name}</span>
                    </summary>
                    <ul class="mt-4 space-y-4">
                        ${renderFileTree(subtree)}
                    </ul>
                </details>
            </li>`;
      }
    }
    return html;
  }
  const fileTree = templates ? buildFileTree(templates) : null;
  return renderTemplate`${maybeRenderHead()}<div id="templateModal" class="modal fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center p-4" role="dialog" aria-labelledby="modalTitle" aria-modal="true"> <div class="modal-content bg-gray-900 text-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col h-[90vh]"> <div class="p-6 sm:p-8"> <h2 id="modalTitle" class="text-2xl sm:text-3xl font-bold mb-4 text-orange-500">Change Template</h2> <p id="modalDescription" class="mb-4 text-gray-300 text-sm sm:text-base"></p> </div> <div class="file-tree-container flex-grow overflow-y-auto px-6 sm:px-8" role="tree"> <ul class="space-y-3"> ${fileTree && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(renderFileTree(fileTree))}` })}`} </ul> </div> <div class="modal-actions p-4 bg-gray-800 flex justify-end space-x-4 sticky bottom-0"> <button id="cancelTemplateChange" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm sm:text-base" aria-label="Cancel template change">Cancel</button> <button id="confirmTemplateChange" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm sm:text-base" disabled aria-label="Confirm template change">Confirm</button> </div> </div> </div>  `;
}, "C:/Users/bradhave/Documents/workspace/hubspot/api/changeTemplate/src/components/TemplateModal.astro", void 0);

const $$Astro = createAstro();
const $$DomainModal = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DomainModal;
  const accessTokenCookie = Astro2.cookies.get("hubspot_access_token");
  const accessToken = accessTokenCookie ? accessTokenCookie.value : null;
  const domains = await getDomains(accessToken);
  return renderTemplate`${maybeRenderHead()}<div id="domainModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50"> <div class="bg-gray-800 p-6 rounded-lg max-w-lg w-full"> <h2 class="text-2xl font-bold mb-4 text-white">Select Domain</h2> <select id="domainSelect" class="w-full p-2 mb-4 bg-gray-700 text-white rounded border border-gray-600"> ${domains.map((domain) => renderTemplate`<option${addAttribute(domain.domain, "value")}>${domain.domain}</option>`)} </select> <div class="flex justify-end space-x-2"> <button id="cancelDomainBtn" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
Cancel
</button> <button id="confirmDomainBtn" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
Confirm
</button> </div> </div> </div> `;
}, "C:/Users/bradhave/Documents/workspace/hubspot/api/changeTemplate/src/components/DomainModal.astro", void 0);

export { $$TemplateModal as $, $$DomainModal as a };
