// 通义千问 VL 面诊分析 API (Vercel Serverless Function)
const QWEN_API_KEY = process.env.QWEN_API_KEY;
const QWEN_ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';
const QWEN_MODEL = 'qwen-vl-max';

// Vercel Serverless Function 配置
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '10mb',
  },
};

export default async function handler(req, res) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { frontPhoto, sidePhoto } = req.body;
    
    if (!frontPhoto) {
      return res.status(400).json({ error: '请上传正面照' });
    }
    
    // 检查图片大小（Base64 约为原文件的 1.37 倍）
    const frontSize = frontPhoto.length * 0.75 / 1024 / 1024; // MB
    const sideSize = sidePhoto ? sidePhoto.length * 0.75 / 1024 / 1024 : 0;
    
    console.log(`📊 图片大小: 正面 ${frontSize.toFixed(2)}MB, 侧面 ${sideSize.toFixed(2)}MB`);
    
    if (frontSize > 4 || sideSize > 4) {
      return res.status(400).json({ 
        error: '图片太大', 
        message: '请上传小于4MB的图片，或等待图片压缩完成' 
      });
    }
    
    console.log('🔬 开始调用通义千问 VL 分析...');
    
    // 调用通义千问 VL 分析
    const result = await analyzeWithQwenVL(frontPhoto, sidePhoto);
    
    console.log('✅ 分析完成');
    
    res.json({
      success: true,
      data: result,
      recordId: 'REC_' + Date.now(),
      duration: 3000
    });
    
  } catch (error) {
    console.error('❌ 分析错误:', error);
    res.status(500).json({ 
      error: '分析失败', 
      message: error.message 
    });
  }
}

async function analyzeWithQwenVL(frontPhoto, sidePhoto) {
  const prompt = `你是一位专业的医美面诊专家。请根据用户提供的面部照片进行全面的面诊分析。

请从以下几个维度进行专业分析，并以JSON格式返回结果：

## 分析维度

### 1. 皮肤状态分析 (评分 0-100)
- 痘痘/痤疮情况 (轻微/中度/严重)
- 色斑/暗沉程度 (轻微/中度/严重)  
- 皱纹/细纹情况 (轻微/中度/严重)
- 毛孔状态 (轻微/中度/严重)
- 肤质水润度 (良好/一般/需改善)

### 2. 五官轮廓分析 (评分 0-100)
- 脸型比例 (优秀/良好/一般)
- 五官对称性 (优秀/良好/一般)
- 下颌线条 (优秀/良好/一般)
- 颧骨高度 (优秀/良好/一般)

### 3. 抗衰老分析
- 法令纹情况 (无/轻微/中度/明显)
- 眼袋情况 (无/轻微/中度/明显)
- 下颌线清晰度 (清晰/一般/模糊)
- 皮肤弹性 (优秀/良好/一般)

### 4. 改善方案建议
根据分析结果，给出针对性的医美项目建议。

请严格按照以下JSON格式返回，不要包含任何其他文字：

{
  "scores": {
    "skin": {"value": 72, "level": "良好", "details": "简要说明"},
    "contour": {"value": 85, "level": "优秀", "details": "简要说明"},
    "antiAging": {"value": 68, "level": "良好", "details": "简要说明"}
  },
  "skinAnalysis": [
    {"name": "痘痘/痤疮", "level": "轻微", "suggestion": "建议"},
    {"name": "色斑/暗沉", "level": "中度", "suggestion": "建议"},
    {"name": "皱纹/细纹", "level": "轻微", "suggestion": "建议"},
    {"name": "毛孔粗大", "level": "中度", "suggestion": "建议"},
    {"name": "肤质水润度", "level": "良好", "suggestion": "建议"}
  ],
  "contourAnalysis": [
    {"name": "脸型比例", "level": "优秀", "suggestion": "建议"},
    {"name": "五官对称", "level": "良好", "suggestion": "建议"},
    {"name": "下颌线条", "level": "良好", "suggestion": "建议"},
    {"name": "颧骨高度", "level": "优秀", "suggestion": "建议"}
  ],
  "agingAnalysis": [
    {"name": "法令纹", "icon": "😔", "status": "轻微", "suggestion": "建议"},
    {"name": "眼袋", "icon": "👁️", "status": "无", "suggestion": "建议"},
    {"name": "下颌线", "icon": "📐", "status": "清晰", "suggestion": "建议"},
    {"name": "皮肤弹性", "icon": "✨", "status": "良好", "suggestion": "建议"}
  ],
  "recommendations": [
    {"title": "光子嫩肤", "description": "改善色斑暗沉", "priority": "强烈推荐", "estimatedSessions": "3-5次", "interval": "每月1次", "price": "800-2000元/次"},
    {"title": "水光针", "description": "深层补水", "priority": "推荐", "estimatedSessions": "3次起", "interval": "每月1次", "price": "1000-3000元/次"},
    {"title": "热玛吉", "description": "紧致提升", "priority": "建议", "estimatedSessions": "1-2次/年", "interval": "6-12个月", "price": "8000-20000元/次"},
    {"title": "日常护肤", "description": "防晒保湿", "priority": "基础", "estimatedSessions": "每日", "interval": "坚持", "price": "自行购买"}
  ],
  "overallAdvice": "综合建议内容"
}`;

  if (!QWEN_API_KEY) {
    console.error('⚠️ QWEN_API_KEY 未配置');
    throw new Error('API Key未配置，请在Vercel环境变量中设置QWEN_API_KEY');
  }

  try {
    const content = [
      { type: 'text', text: prompt },
      { type: 'image_url', image_url: { url: frontPhoto } }
    ];

    if (sidePhoto) {
      content.push({ type: 'image_url', image_url: { url: sidePhoto } });
    }

    console.log('📤 发送请求到通义千问...');
    
    const response = await fetch(QWEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QWEN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: QWEN_MODEL,
        input: {
          messages: [
            { role: 'user', content: content }
          ]
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok || data.code) {
      console.error('通义千问错误:', JSON.stringify(data));
      throw new Error(`通义千问API错误: ${data.message || data.msg || JSON.stringify(data)}`);
    }

    const output = data.output?.choices?.[0]?.message?.content || data.output?.text;
    console.log('📥 AI返回:', output?.substring(0, 200) + '...');
    
    // 提取JSON
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('无法解析AI返回结果');

  } catch (error) {
    console.error('通义千问 VL 调用失败:', error);
    throw error;
  }
}
