export const fetchWithRetry = async (
    url: string,
    options?: RequestInit,
    retries = 5,
    delayMs = 5000
): Promise<Response> => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                ...options,
                // Ensure we timeout if Render is stuck for too long on a single request
                signal: AbortSignal.timeout(15000) 
            });

            // Check if the response is JSON (Render often returns HTML when spinning up or 502 Bad Gateway)
            const contentType = response.headers.get("content-type");
            const isJson = contentType && contentType.includes("application/json");

            // If the response is successful and is JSON, return it
            if (response.ok && isJson) {
                return response;
            }

            // If the response is a client error (e.g. 400 Bad Request) but still JSON, 
            // the service is awake but the request was invalid. Return it so the controller can handle it.
            if (!response.ok && response.status >= 400 && response.status < 500 && isJson) {
                return response;
            }

            console.log(`[Attempt ${i + 1}/${retries}] Service at ${url} returned non-JSON or 5xx error. Waiting...`);
        } catch (error) {
            console.log(`[Attempt ${i + 1}/${retries}] Network error/timeout for ${url}. Waiting...`);
        }

        // Wait before the next attempt
        await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    throw new Error(`Failed to fetch from ${url} after ${retries} attempts.`);
};
