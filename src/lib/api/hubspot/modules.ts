import type { HubSpotModule } from './types';
import { ApiClient } from './client';
import { API_ENDPOINTS } from './constants';

const PAGE_LIMIT = 100;

export async function getModules(accessToken: string, refreshToken?: string): Promise<HubSpotModule[]> {
    const client = new ApiClient(accessToken);

    try {
        const response = await client.get<{ objects: HubSpotModule[] }>(
            `${API_ENDPOINTS.modules.list}?limit=${PAGE_LIMIT}`, 
            refreshToken
        );

        if (response?.objects && Array.isArray(response.objects)) {
            return response.objects.map(mapHubSpotModule);
        }

        return [];
    } catch (error) {
        console.error('Error fetching modules:', error);
        throw error;
    }
}

export async function getModule(accessToken: string, moduleId: string, refreshToken?: string): Promise<HubSpotModule> {
    const client = new ApiClient(accessToken);
    const response = await client.get<HubSpotModule>(API_ENDPOINTS.modules.get(moduleId), refreshToken);
    return mapHubSpotModule(response);
}

function mapHubSpotModule(module: HubSpotModule): HubSpotModule {
    return {
        id: module.id,
        name: module.name,
        path: module.path || '',
        folderPath: module.folderPath || '',
        folderId: module.folderId || 0,
        fields: module.fields || [],
        created: module.created || 0,
        updated: module.updated || 0,
        authorAt: module.authorAt || 0,
        contentTypes: module.contentTypes || [],
        isAvailableForNewContent: module.isAvailableForNewContent || false,
        deleted: module.deleted || false,
        deletedAt: module.deletedAt || 0,
        global: module.global || false,
        source: module.source || '',
        css: module.css || '',
    };
} 