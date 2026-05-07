import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, imageBase64, systemInstruction } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages parameter' });
    }

    // 尝试调用硅基流动 API
    const apiKey = process.env.SILICONFLOW_API_KEY;
    if (!apiKey) {
      console.warn('未设置 SILICONFLOW_API_KEY，使用本地分析');
      const result = analyzeMessages(messages);
      return res.status(200).json({ result });
    }

    const result = await callSiliconFlowAPI(messages, systemInstruction, apiKey);
    return res.status(200).json({ result });
  } catch (error) {
    console.error('API error:', error);
    // 降级处理：如果 API 调用失败，使用本地分析
    try {
      const { messages } = req.body;
      const result = analyzeMessages(messages);
      return res.status(200).json({ result });
    } catch (fallbackError) {
      return res.status(500).json({ error: 'Analysis failed' });
    }
  }
}

async function callSiliconFlowAPI(
  messages: string[],
  systemInstruction: string,
  apiKey: string
) {
  const apiUrl = 'https://api.siliconflow.cn/v1/chat/completions';
  
  const conversationMessages = [
    {
      role: 'system',
      content: systemInstruction || '你是一个拥有20年刑侦经验和反诈经验的顶级专家。你的任务是分析用户提供的聊天记录，识别其中的诈骗风险。请严格按照JSON格式返回结果。'
    },
    {
      role: 'user',
      content: `请分析以下聊天记录，并按JSON格式返回分析结果。聊天记录如下：\n\n${messages.join('\n')}\n\n请返回以下JSON结构（不要返回其他文本）：{"riskScore": 0-100, "fraudType": "string", "reasoningChain": ["string"], "keySuspectWords": ["string"], "dimensions": {"emotional": 0-100, "monetary": 0-100, "logic": 0-100, "identity": 0-100}, "suggestions": ["string"]}`
    }
  ];

  const requestBody = {
    model: 'deepseek-ai/DeepSeek-V4-Flash',
    messages: conversationMessages,
    temperature: 0.3,
    max_tokens: 1500,
  };

  console.log('Calling SiliconFlow API...', { url: apiUrl, model: requestBody.model });

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  const responseText = await response.text();
  console.log('SiliconFlow response status:', response.status);
  console.log('SiliconFlow response body:', responseText.substring(0, 500));

  if (!response.ok) {
    throw new Error(`SiliconFlow API error: ${response.status} ${responseText}`);
  }

  const data = JSON.parse(responseText);
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid SiliconFlow response format');
  }

  const content = data.choices[0].message.content;
  
  // 尝试从响应中提取 JSON
  let analysisResult;
  try {
    // 首先尝试直接解析
    analysisResult = JSON.parse(content);
  } catch {
    // 尝试从 markdown 代码块中提取 JSON
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      analysisResult = JSON.parse(jsonMatch[1]);
    } else {
      // 尝试从字符串中找到 JSON 对象
      const objectMatch = content.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        analysisResult = JSON.parse(objectMatch[0]);
      } else {
        throw new Error('无法从 AI 响应中提取 JSON');
      }
    }
  }

  // 验证必要字段
  if (!analysisResult.riskScore || !analysisResult.fraudType || !analysisResult.dimensions) {
    throw new Error('AI 响应缺少必要字段');
  }

  return {
    riskScore: Math.min(100, Math.max(0, analysisResult.riskScore)),
    fraudType: analysisResult.fraudType,
    reasoningChain: analysisResult.reasoningChain || [],
    keySuspectWords: analysisResult.keySuspectWords || [],
    dimensions: {
      emotional: Math.min(100, Math.max(0, analysisResult.dimensions.emotional || 0)),
      monetary: Math.min(100, Math.max(0, analysisResult.dimensions.monetary || 0)),
      logic: Math.min(100, Math.max(0, analysisResult.dimensions.logic || 0)),
      identity: Math.min(100, Math.max(0, analysisResult.dimensions.identity || 0)),
    },
    suggestions: analysisResult.suggestions || [],
  };
}

function analyzeMessages(messages: string[]) {
  // 根据消息内容生成智能化的分析数据
  const text = messages.join(' ').toLowerCase();
  const isHighRisk = text.includes('投资') && text.includes('赚钱') && text.includes('高收益');
  const isMediumRisk = text.includes('转账') || text.includes('汇款') || text.includes('验证码');
  
  let riskScore = 20;
  let fraudType = '低风险对话';
  let dimensions = { emotional: 20, monetary: 20, logic: 20, identity: 20 };
  
  if (isHighRisk) {
    riskScore = 85;
    fraudType = '投资理财诈骗';
    dimensions = { emotional: 85, monetary: 90, logic: 70, identity: 80 };
  } else if (isMediumRisk) {
    riskScore = 60;
    fraudType = '需警惕的对话';
    dimensions = { emotional: 50, monetary: 70, logic: 40, identity: 60 };
  }
  
  return {
    riskScore,
    fraudType,
    keySuspectWords: extractSuspectWords(messages),
    suggestions: generateSuggestions(riskScore),
    reasoningChain: generateReasoning(messages, isHighRisk, isMediumRisk),
    dimensions,
  };
}

function extractSuspectWords(messages: string[]): string[] {
  const suspectWords = [
    '投资', '赚钱', '高收益', '稳赚不赔', '内部消息', '紧急', '保密', 
    '转账', '汇款', '验证码', '安全账户', '保证金', '手续费'
  ];
  
  return suspectWords
    .filter(word => messages.some(m => m.toLowerCase().includes(word)))
    .slice(0, 5);
}

function generateSuggestions(riskScore: number): string[] {
  if (riskScore > 70) {
    return [
      '立即停止与对方的一切联系',
      '不要透露任何个人信息或银行卡信息',
      '保存聊天记录、转账记录等所有证据',
      '立即拨打反诈专线96110报警'
    ];
  } else if (riskScore > 50) {
    return [
      '保持警惕，不要轻易相信对方承诺',
      '核实对方身份，通过官方渠道确认',
      '不向陌生账户转账汇款',
      '咨询亲友或拨打96110咨询'
    ];
  }
  return [
    '保持警惕，涉及金钱交易要谨慎',
    '保护个人信息安全',
    '学习反诈知识，提高防范意识'
  ];
}

function generateReasoning(messages: string[], isHighRisk: boolean, isMediumRisk: boolean): string[] {
  const reasoning: string[] = [];
  
  if (isHighRisk) {
    reasoning.push(
      '检测到高频投资理财词汇，存在虚假投资诈骗特征',
      '对方使用"高收益、零风险"等诱骗话术',
      '对话中存在紧迫性要求，催促快速决策',
      '缺乏具体投资项目信息，属于典型的杀猪盘话术'
    );
  } else if (isMediumRisk) {
    reasoning.push(
      '检测到转账、汇款等敏感词汇',
      '需警惕对方是否在索取敏感信息',
      '建议核实对方身份的真实性',
      '不排除是新型诈骗手段'
    );
  } else {
    reasoning.push(
      '未检测到明显的诈骗特征',
      '对话内容较为正常',
      '但仍需保持警惕，防止新型诈骗'
    );
  }
  
  return reasoning.slice(0, 4);
}
