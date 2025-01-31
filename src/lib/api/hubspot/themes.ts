import { ApiClient } from './client';
import { API_ENDPOINTS } from './constants';

export type Environment = 'draft' | 'published';

interface ExtractResponse {
  id: string;
}

interface ExtractStatusResponse {
  status: 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED' | string;
  error?: string;
}

export async function uploadTheme(
  accessToken: string,
  file: File | Blob,
  environment: Environment = 'published',
  path: string,
  refreshToken?: string
): Promise<Response> {
  const client = new ApiClient(accessToken);
  const url = API_ENDPOINTS.themes.upload(environment, path);
  return client.uploadFile(url, file, refreshToken);
}

export async function extractTheme(
  accessToken: string,
  path: string,
  refreshToken?: string
): Promise<ExtractResponse> {
  const client = new ApiClient(accessToken);
  // Get the folder name by removing .zip extension
  const targetFolder = path.replace('.zip', '');
  return client.post<ExtractResponse>(API_ENDPOINTS.themes.extract, {
    path,
    targetFolder,  // Add the target folder for extraction
  }, refreshToken);
}

export async function getExtractStatus(
  accessToken: string,
  taskId: string,
  refreshToken?: string
): Promise<ExtractStatusResponse> {
  const client = new ApiClient(accessToken);
  try {
    const response = await client.get<ExtractStatusResponse>(API_ENDPOINTS.themes.extractStatus(taskId), refreshToken);
    return response;
  } catch (error) {
    // If we get a 404, it means the task is complete (HubSpot behavior)
    if (error instanceof Error && error.message.includes('404')) {
      return { status: 'DONE' };
    }
    throw error;
  }
}

export async function waitForExtraction(
  accessToken: string,
  taskId: string,
  refreshToken?: string,
  maxAttempts = 60,
  delayMs = 2000,
  onStatusUpdate?: (status: string) => void
): Promise<void> {
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      const status = await getExtractStatus(accessToken, taskId, refreshToken);
      
      if (onStatusUpdate) {
        switch (status.status) {
          case 'PENDING':
            onStatusUpdate('Waiting for extraction to start...');
            break;
          case 'PROCESSING':
            onStatusUpdate('Extracting theme files...');
            break;
          case 'DONE':
            onStatusUpdate('Theme extraction complete');
            return;
          case 'FAILED':
            onStatusUpdate('Theme extraction failed');
            throw new Error(status.error || 'Theme extraction failed');
          default:
            // If we get an unknown status, assume it's done (HubSpot sometimes returns different statuses)
            onStatusUpdate('Theme extraction complete');
            return;
        }
      }
      
      if (status.status === 'DONE' || !['PENDING', 'PROCESSING'].includes(status.status)) {
        return;
      }
      
      if (status.status === 'FAILED') {
        throw new Error(status.error || 'Theme extraction failed');
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, delayMs));
      attempts++;
    } catch (error) {
      // If we get a 404, it means the task is complete
      if (error instanceof Error && error.message.includes('404')) {
        if (onStatusUpdate) {
          onStatusUpdate('Theme extraction complete');
        }
        return;
      }
      throw error;
    }
  }
  
  throw new Error('Theme extraction timed out');
}

export async function deleteThemeFile(
  accessToken: string,
  environment: Environment = 'published',
  path: string,
  refreshToken?: string
): Promise<Response> {
  const client = new ApiClient(accessToken);
  const url = API_ENDPOINTS.themes.delete(environment, path);
  return client.delete(url, refreshToken);
} 