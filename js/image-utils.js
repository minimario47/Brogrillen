/**
 * Image utility functions
 * Handles image processing and thumbnail creation
 */

/**
 * Creates a thumbnail from an image file
 * @param {File} file - Original image file
 * @param {number} maxWidth - Maximum width for thumbnail (default: 800)
 * @param {number} maxHeight - Maximum height for thumbnail (default: 600)
 * @param {number} maxSizeKB - Maximum file size in KB (default: 100)
 * @returns {Promise<File>} The thumbnail file
 */
async function createThumbnail(file, maxWidth = 800, maxHeight = 600, maxSizeKB = 100) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) {
        reject(new Error('Failed to read file'));
        return;
      }

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width > height) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          } else {
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }
        }

        // Create canvas and resize
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }

            // If blob is still too large, compress further
            if (blob.size > maxSizeKB * 1024) {
              compressBlob(blob, maxSizeKB)
                .then((compressedBlob) => {
                  const thumbnailFile = new File(
                    [compressedBlob],
                    `thumb_${file.name}`,
                    { type: 'image/jpeg' }
                  );
                  resolve(thumbnailFile);
                })
                .catch(reject);
            } else {
              const thumbnailFile = new File(
                [blob],
                `thumb_${file.name}`,
                { type: 'image/jpeg' }
              );
              resolve(thumbnailFile);
            }
          },
          'image/jpeg',
          0.85 // Start with 85% quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses an image blob to meet size requirements
 * @param {Blob} blob - Original image blob
 * @param {number} maxSizeKB - Maximum file size in KB
 * @returns {Promise<Blob>} Compressed blob
 */
async function compressBlob(blob, maxSizeKB) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) {
        reject(new Error('Failed to read blob'));
        return;
      }

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);

        // Try different quality levels
        let quality = 0.7;
        const minQuality = 0.3;

        const tryCompress = () => {
          canvas.toBlob(
            (compressedBlob) => {
              if (!compressedBlob) {
                reject(new Error('Failed to compress'));
                return;
              }

              if (compressedBlob.size <= maxSizeKB * 1024 || quality <= minQuality) {
                resolve(compressedBlob);
              } else {
                quality -= 0.1;
                tryCompress();
              }
            },
            'image/jpeg',
            quality
          );
        };

        tryCompress();
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
}

