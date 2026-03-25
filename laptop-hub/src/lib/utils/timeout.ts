/**
 * Utility to wrap any promise with a timeout and optional retry logic.
 */
export const withTimeout = <T>(
    promiseFn: () => Promise<T>, 
    timeoutMs: number, 
    errorMessage: string,
    retries: number = 2
): Promise<T> => {
    const execute = async (attempt: number): Promise<T> => {
        try {
            return await Promise.race([
                promiseFn(),
                new Promise<T>((_, reject) =>
                    setTimeout(() => reject(new Error(`${errorMessage} (Attempt ${attempt + 1}/${retries + 1} timed out after ${timeoutMs/1000}s)`)), timeoutMs)
                )
            ]);
        } catch (error: any) {
            // Check if it's a timeout error and if we have retries left
            const isTimeout = error.message?.includes('Attempt') || error.message?.includes('timeout') || error.message === errorMessage;
            
            if (attempt < retries && isTimeout) {
                console.warn(`Request timed out. Retrying attempt ${attempt + 2}/${retries + 1}...`);
                // Progressive backoff: wait longer between retries
                await new Promise(resolve => setTimeout(resolve, 1500 * (attempt + 1)));
                return execute(attempt + 1);
            }
            throw error;
        }
    };

    return execute(0);
};
