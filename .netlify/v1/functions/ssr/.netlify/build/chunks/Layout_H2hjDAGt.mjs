import { c as createComponent, r as renderTemplate, a as addAttribute, f as renderHead, g as renderSlot, b as createAstro } from './astro/server_rCJ8By33.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="HubSpot OAuth Integration"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body class="bg-slate-900 text"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/bradhave/Documents/workspace/hubspot/api/hsUtils/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
