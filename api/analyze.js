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
    const { frontPhoto, sidePhoto, userId } = req.body;
    
    if (!frontPhoto || !sidePhoto) {
      return res.status(400).json({ error: '请上传正面照和侧面照' });
    }
    
    // 模拟AI分析
    const result = generateMockResult();
    
    res.json({
      success: true,
      data: result,
      recordId: 'REC_' + Date.now(),
      duration: 2000
    });
    
  } catch (error) {
    console.error('分析错误:', error);
    res.status(500).json({ 
      error: '分析失败', 
      message: error.message 
    });
  }
}

function generateMockResult() {
  const skinScore = Math.floor(Math.random() * 20) + 65;
  const contourScore = Math.floor(Math.random() * 20) + 75;
  const antiAgingScore = Math.floor(Math.random() * 25) + 55;
  
  return {
    scores: {
      skin: {
        value: skinScore,
        level: skinScore >= 80 ? '优秀' : skinScore >= 60 ? '良好' : '需改善'
      },
      contour: {
        value: contourScore,
        level: contourScore >= 80 ? '优秀' : contourScore >= 60 ? '良好' : '需改善'
      },
      antiAging: {
        value: antiAgingScore,
        level: antiAgingScore >= 80 ? '优秀' : antiAgingScore >= 60 ? '良好' : '需改善'
      }
    },
    skinAnalysis: [
      { name: '痘痘/痤疮', level: '轻微', suggestion: '注意清洁' },
      { name: '色斑/暗沉', level: '中度', suggestion: '光子嫩肤' },
      { name: '皱纹/细纹', level: '轻微', suggestion: '眼周护理' },
      { name: '毛孔粗大', level: '中度', suggestion: '水光针' },
      { name: '肤质水润度', level: '良好', suggestion: '保持补水' }
    ],
    contourAnalysis: [
      { name: '脸型比例', level: '优秀', suggestion: '轮廓流畅' },
      { name: '五官对称', level: '良好', suggestion: '基本对称' },
      { name: '下颌线条', level: '良好', suggestion: '线条清晰' },
      { name: '颧骨高度', level: '优秀', suggestion: '位置适中' }
    ],
    agingAnalysis: [
      { name: '法令纹', icon: '😔', status: '轻微', suggestion: '玻尿酸填充' },
      { name: '眼袋', icon: '👁️', status: '无', suggestion: '保持作息' },
      { name: '下颌线', icon: '📐', status: '清晰', suggestion: '紧致护理' },
      { name: '皮肤弹性', icon: '✨', status: '良好', suggestion: '定期护理' }
    ],
    recommendations: [
      { title: '光子嫩肤', description: '改善色斑、暗沉', priority: '强烈推荐', estimatedSessions: '3-5次', interval: '每月1次', price: '800-2000元/次' },
      { title: '水光针', description: '深层补水', priority: '推荐', estimatedSessions: '3次起', interval: '每月1次', price: '1000-3000元/次' },
      { title: '热玛吉', description: '紧致提升', priority: '建议', estimatedSessions: '1-2次/年', interval: '6-12个月', price: '8000-20000元/次' },
      { title: '日常护肤', description: '防晒保湿', priority: '基础', estimatedSessions: '每日', interval: '坚持', price: '自行购买' }
    ],
    overallAdvice: '建议重点关注肤色提亮和抗衰老护理。'
  };
}
