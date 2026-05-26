import { API_BASE_URL } from '@app/config/env';

export const uploadService = {
  async uploadDocument(file, docType, onProgress) {
    if (!API_BASE_URL) {
      onProgress?.(100);
      return { id: `mock-doc-${Date.now()}`, url: URL.createObjectURL(file) };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE_URL}/documents/upload`);

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress?.(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Upload network error'));
      xhr.send(formData);
    });
  },
};
