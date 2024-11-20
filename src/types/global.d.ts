interface Window {
    openDomainModal: (pageId: string) => Promise<string | null>;
    openTemplateModal: (pageId: string | string[], currentTemplatePath?: string) => Promise<string | null>;
    openSlugModal: (pages: Array<{ pageId: string; currentUrl: string }>) => Promise<string | null>;
    selectedPages: Array<{ pageId: string; currentUrl: string }>;
}