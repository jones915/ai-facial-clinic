// AI面诊API服务

// Vercel部署时使用相对路径，本地开发使用完整URL
const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:3001';

/**
 * 调用AI分析接口
 * @param {string} frontPhoto - 正面照Base64
 * @param {string} sidePhoto - 侧面照Base64
 * @returns {Promise<Object>} 分析结果
 */
export async function analyzeFace(frontPhoto, sidePhoto) {
  try {
    const url = import.meta.env.PROD 
      ? '/api/analyze' 
      : `${API_BASE_URL}/api/analyze`;
      
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        frontPhoto,
        sidePhoto
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
