import type { APIRoute } from 'astro';
import { uploadTheme, extractTheme, deleteThemeFile, waitForExtraction } from '@/lib/api/hubspot/themes';
import { checkAuth } from '@/lib/middleware/auth';
import type { AstroCookies } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const POST: APIRoute = async ({ request }) => {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const cookies = request.headers.get('cookie');
        if (!cookies) {
          controller.enqueue(encoder.encode('data: ' + JSON.stringify({ error: 'Unauthorized' }) + '\n\n'));
          controller.close();
          return;
        }

        const cookieObj: AstroCookies = {
          get: (name: string) => ({
            value: cookies.match(new RegExp(`${name}=([^;]+)`))?.at(1) || '',
            json() { return this.value; },
            number() { return Number(this.value); },
            boolean() { return Boolean(this.value); },
            toString() { return this.value; }
          })
        } as AstroCookies;

        const { isAuthenticated, accessToken, refreshToken } = await checkAuth(cookieObj);
        
        if (!isAuthenticated || !accessToken) {
          controller.enqueue(encoder.encode('data: ' + JSON.stringify({ error: 'Unauthorized' }) + '\n\n'));
          controller.close();
          return;
        }

        const formData = await request.formData();
        const themeFileName = formData.get('themeFile') as string;

        if (!themeFileName) {
          controller.enqueue(encoder.encode('data: ' + JSON.stringify({ error: 'Missing required fields' }) + '\n\n'));
          controller.close();
          return;
        }

        // Send status update
        const sendStatus = (status: string) => {
          controller.enqueue(encoder.encode('data: ' + JSON.stringify({ status }) + '\n\n'));
        };

        // Read the theme file from the server
        const themePath = path.join(process.cwd(), 'public', 'themes', themeFileName);
        const fileBuffer = await fs.readFile(themePath);
        const file = new Blob([fileBuffer], { type: 'application/zip' });

        // Get the folder name by removing .zip extension
        const folderName = themeFileName.replace('.zip', '');
        const hubspotPath = themeFileName;  // Upload ZIP file to root

        // 1. Upload the theme file
        sendStatus('Uploading theme file...');
        const uploadResponse = await uploadTheme(
          accessToken,
          file,
          'published',
          hubspotPath,
          refreshToken
        );

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          controller.enqueue(encoder.encode('data: ' + JSON.stringify({ error: error.message || 'Failed to upload theme' }) + '\n\n'));
          controller.close();
          return;
        }

        // 2. Extract the theme
        try {
          sendStatus('Starting theme extraction...');
          const extractResult = await extractTheme(
            accessToken,
            hubspotPath,  // Pass the full path of the uploaded ZIP file
            refreshToken
          );

          // Add debug logging
          console.log('Extract response:', extractResult);

          // Wait for extraction to complete
          await waitForExtraction(
            accessToken,
            extractResult.id,
            refreshToken,
            60,
            2000,
            (status) => {
              console.log('Extraction status:', status);  // Add debug logging
              sendStatus(status);
            }
          );

          // 3. Delete the ZIP file
          sendStatus('Deleting uploaded ZIP file...');
          const deleteResponse = await deleteThemeFile(
            accessToken,
            'published',
            hubspotPath,  // Delete the ZIP from root
            refreshToken
          );

          if (!deleteResponse.ok) {
            const error = await deleteResponse.json();
            console.error('Failed to delete ZIP file:', error);
            sendStatus('Warning: Failed to delete ZIP file, but theme was extracted successfully');
          }

          sendStatus('Theme installation complete!');
          controller.close();
        } catch (error) {
          controller.enqueue(encoder.encode('data: ' + JSON.stringify({ 
            error: error instanceof Error ? error.message : 'Failed to extract theme'
          }) + '\n\n'));
          controller.close();
        }
      } catch (error) {
        controller.enqueue(encoder.encode('data: ' + JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Internal server error'
        }) + '\n\n'));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  });
}; 