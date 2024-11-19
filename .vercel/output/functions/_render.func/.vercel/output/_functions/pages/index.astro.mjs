/* empty css                                      */
import { c as createComponent, r as renderTemplate, f as renderComponent, e as createAstro, m as maybeRenderHead, a as addAttribute } from '../chunks/astro/server_QBnrvN_q.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DnTCzner.mjs';
import { f as getAuthUrl } from '../chunks/api_D5lN87jw.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const authUrl = getAuthUrl();
  const accessTokenCookie = Astro2.cookies.get("hubspot_access_token");
  const accessToken = accessTokenCookie ? accessTokenCookie.value : null;
  const portalIdCookie = Astro2.cookies.get("hubspot_portal_id");
  const portalId = portalIdCookie ? portalIdCookie.value : null;
  let isAuthenticated = true;
  if (!accessToken || !portalId) {
    isAuthenticated = false;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "HubSpot OAuth" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4"> <h1 class="text-4xl font-bold mb-6 text-orange-500">HubSpot Utils</h1> <div class="space-y-4"> <a${addAttribute(authUrl, "href")} class="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"> ${isAuthenticated ? "Change Portal" : "Authenticate with HubSpot"} </a> ${isAuthenticated && renderTemplate`<a href="/pages" class="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
View Pages
</a>`} </div> </main> ` })}`;
}, "C:/Users/bradhave/Documents/workspace/hubspot/api/changeTemplate/src/pages/index.astro", void 0);

const $$file = "C:/Users/bradhave/Documents/workspace/hubspot/api/changeTemplate/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
