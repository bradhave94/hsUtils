/* empty css                                      */
import { c as createComponent, r as renderTemplate, f as renderComponent, e as createAstro, m as maybeRenderHead } from '../chunks/astro/server_QBnrvN_q.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_D4YqzTMS.mjs';
import { c as getAccessTokenFromCode } from '../chunks/api_D5lN87jw.mjs';
/* empty css                                    */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Callback = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Callback;
  let message = "";
  if (Astro2.request.method === "GET") {
    const url = new URL(Astro2.request.url);
    const code = url.searchParams.get("code");
    if (code) {
      try {
        const { accessToken, portalId } = await getAccessTokenFromCode(code);
        Astro2.cookies.set("hubspot_access_token", accessToken, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 2
          // 2 hours
        });
        Astro2.cookies.set("hubspot_portal_id", portalId, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 2
          // 2 hours
        });
        return Astro2.redirect("/pages");
      } catch (error) {
        message = `Authentication failed: ${error.message}`;
      }
    } else {
      message = "No authorization code received.";
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "HubSpot OAuth Callback", "data-astro-cid-62g22v6u": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-62g22v6u> <h1 data-astro-cid-62g22v6u>HubSpot OAuth Callback</h1> <p data-astro-cid-62g22v6u>${message}</p> <a href="/" class="button" data-astro-cid-62g22v6u>Back to Home</a> </main> ` })} `;
}, "C:/Users/bradhave/Documents/workspace/hubspot/api/hsUtils/src/pages/callback.astro", void 0);

const $$file = "C:/Users/bradhave/Documents/workspace/hubspot/api/hsUtils/src/pages/callback.astro";
const $$url = "/callback";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Callback,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
