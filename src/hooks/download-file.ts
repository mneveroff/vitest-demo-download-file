import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Function to generate random data (gibberish)
const generateRandomData = (sizeInBytes: number): Uint8Array => {
    const buffer = new Uint8Array(sizeInBytes);
    for (let i = 0; i < sizeInBytes; i++) {
        // Fill with random byte values (0-255)
        buffer[i] = Math.floor(Math.random() * 256);
    }
    return buffer;
};

export const useDownloadGeneratedFile = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // We're imitating a real download by waiting 1 second and then creating a blob
    const downloadFile = async ({
        filename = uuidv4(), 
        timeout = 0, 
        shouldFail = false, 
        shouldFailWithNonError = false
    } = {}) => {
        setIsDownloading(true);
        setError(null);
        let objectUrl: string | null = null;

        // Wait for 1 second to simulate a download
        await new Promise(resolve => setTimeout(resolve, timeout));

        try {
            if (shouldFail) {
                throw new Error("Simulated download generation failure");
            }
            if (shouldFailWithNonError) {
                // Throw something that is not an instance of Error
                throw { message: "Simulated non-error failure", code: 500 };
            }
            const fileSizeInBytes = 1 * 1024 * 1024; // (1 MB = 1024 * 1024 bytes)

            const randomData = generateRandomData(fileSizeInBytes);
            const blob = new Blob([randomData], { type: 'application/octet-stream' });
            objectUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (e: unknown) {
            console.error("Download generation failed:", e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred');
        } finally {
            setIsDownloading(false);
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        }
    };

    return { isDownloading, error, downloadFile };
};