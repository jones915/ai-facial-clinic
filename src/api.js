// AI面诊API服务

// Vercel部署时使用相对路径，本地开发使用完整URL
const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:3001';

/**
 * 压缩图片
 * @param {string} base64Image - Base64图片
 * @param {number} maxWidth - 最大宽度
 * @param {number} quality - 质量 0-1
 * @returns {Promise<string>} 压缩后的Base64
 */
async function compressImage(base64Image, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // 按比例缩放
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // 转为JPEG格式压缩
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = reject;
    img.src = base64Image;
  });
}

/**
 * 调用AI分析接口
 * @param {string} frontPhoto - 正面照Base64
 * @param {string} sidePhoto - 侧面照Base64
 * @returns {Promise<Object>} 分析结果
 */
export async function analyzeFace(frontPhoto, sidePhoto) {
  try {
    // 压缩图片
    console.log('📦 正在压缩图片...');
    const compressedFront = await compressImage(frontPhoto, 800, 0.6);
    const compressedSide = sidePhoto ? await compressImage(sidePhoto, 800, 0.6) : null;
    console.log('✅ 图片压缩完成');
    
    const url = import.meta.env.PROD 
      ? '/api/analyze' 
      : `${API_BASE_URL}/api/analyze`;
      
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        frontPhoto: compressedFront,
        sidePhoto: compressedSide
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API错误:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('API调用失败:', error);
    throw error;
  }
}

/**
 * 健康检查
 */
export async function healthCheck() {
  try {
    const url = import.meta.env.PROD 
      ? '/api/health' 
      : `${API_BASE_URL}/api/health`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('健康检查失败:', error);
    return { status: 'error' };
  }
}
