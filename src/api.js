// AI面诊API服务

const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:3001';

/**
 * 压缩图片并转为 Base64
 */
async function compressImage(base64Image, maxWidth = 800, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // 转为 JPEG 格式
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = reject;
    img.src = base64Image;
  });
}

/**
 * 调用AI分析接口
 */
export async function analyzeFace(frontPhoto, sidePhoto) {
  try {
    console.log('📦 正在压缩图片...');
    
    // 压缩图片
    const compressedFront = await compressImage(frontPhoto, 800, 0.5);
    const compressedSide = sidePhoto ? await compressImage(sidePhoto, 800, 0.5) : null;
    
    console.log('✅ 图片压缩完成');
    console.log('📊 正面照大小:', Math.round(compressedFront.length / 1024), 'KB');
    if (compressedSide) {
      console.log('📊 侧面照大小:', Math.round(compressedSide.length / 1024), 'KB');
    }
    
    const url = import.meta.env.PROD 
      ? '/api/analyze' 
      : `${API_BASE_URL}/api/analyze`;
      
    console.log('📡 请求地址:', url);
    
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
    
    console.log('📥 响应状态:', response.status);
    
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
