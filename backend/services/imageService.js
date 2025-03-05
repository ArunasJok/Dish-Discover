// services/imageService.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Downloads an image from the given URL and saves it locally.
 * @param {string} imageUrl - The URL of the image.
 * @param {string} fileName - Desired file name.
 * @returns {Promise<string>} - Resolves with the local file path.
 */
async function downloadImage(imageUrl, fileName) {
  const localDir = path.resolve(__dirname, '../uploads');
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir);
  }
  const localPath = path.join(localDir, fileName);
  const response = await axios({
    url: imageUrl,
    method: 'GET',
    responseType: 'stream'
  });
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(localPath);
    response.data.pipe(writer);
    writer.on('finish', () => resolve(localPath));
    writer.on('error', reject);
  });
}

module.exports = { downloadImage };
