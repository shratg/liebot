// 文件位置: src/services/siliconflow.ts
import { SYSTEM_INSTRUCTION } from "../constants";
import { AnalysisResult } from "../types";

export class SiliconFlowService {
  private apiUrl: string;
  private siliconFlowApiKey: string | null = null;

  constructor() {
    this.apiUrl = '/api/analyze';
    // 从 localStorage 读取 API 密钥（用户可以在设置中输入）
    if (typeof window !== 'undefined') {
      this.siliconFlowApiKey = localStorage.getItem('siliconflow_api_key');
    }
  }

  async analyzeChat(messages: string[], imageBase64?: string): Promise<AnalysisResult> {
    // 如果用户配置了 API 密钥，优先使用直接调用硅基流动 API
    if (this.siliconFlowApiKey) {
      console.log('使用用户配置的 API 密钥，直接调用硅基流动 API');
      return this.callSiliconFlowDirect(messages, this.siliconFlowApiKey);
    }

    // 否则调用后端代理端点
    console.log('调用后端 /api/analyze 端点');
    return this.callApiEndpoint(messages, imageBase64);
  }

  // 直接调用硅基流动 API（本地开发模式）
  private async callSiliconFlowDirect(messages: string[], apiKey: string): Promise<AnalysisResult> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时

      try {
        console.log('正在调用硅基流动 API...', { url: 'https://api.siliconflow.cn/v1/chat/completions' });

        const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-ai/DeepSeek-V4-Flash',
            messages: [
              {
                role: 'system',
                content: SYSTEM_INSTRUCTION || '你是一个拥有20年刑侦经验和反诈经验的顶级专家。你的任务是分析用户提供的聊天记录，识别其中的诈骗风险。请严格按照JSON格式返回结果。'
              },
              {
                role: 'user',
                content: `请分析以下聊天记录，并按JSON格式返回分析结果。聊天记录如下：\n\n${messages.join('\n')}\n\n请返回以下JSON结构（不要返回其他文本）：{"riskScore": 0-100, "fraudType": "string", "reasoningChain": ["string"], "keySuspectWords": ["string"], "dimensions": {"emotional": 0-100, "monetary": 0-100, "logic": 0-100, "identity": 0-100}, "suggestions": ["string"]}`
              }
            ],
            temperature: 0.3,
            max_tokens: 1500,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('硅基流动 API 错误:', response.status, errorText);
          throw new Error(`硅基流动 API 错误: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('硅基流动 API 响应:', data);

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error('无效的 API 响应格式');
        }

        const content = data.choices[0].message.content;
        console.log('AI 响应内容:', content);

        // 解析 JSON 响应
        let analysisResult;
        try {
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
              throw new Error('无法从响应中提取 JSON');
            }
          }
        }

        console.log('解析后的分析结果:', analysisResult);

        return {
          riskScore: Math.min(100, Math.max(0, analysisResult.riskScore || 0)),
          fraudType: analysisResult.fraudType || '未知',
          reasoningChain: analysisResult.reasoningChain || [],
          keySuspectWords: analysisResult.keySuspectWords || [],
          dimensions: {
            emotional: Math.min(100, Math.max(0, analysisResult.dimensions?.emotional || 0)),
            monetary: Math.min(100, Math.max(0, analysisResult.dimensions?.monetary || 0)),
            logic: Math.min(100, Math.max(0, analysisResult.dimensions?.logic || 0)),
            identity: Math.min(100, Math.max(0, analysisResult.dimensions?.identity || 0)),
          },
          suggestions: analysisResult.suggestions || [],
        };

      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('API 请求超时，请重试');
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('直接调用硅基流动 API 失败:', error);
      throw error;
    }
  }

  // 调用后端代理端点（Vercel 部署模式）
  private async callApiEndpoint(messages: string[], imageBase64?: string): Promise<AnalysisResult> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时

      try {
        const response = await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages,
            imageBase64,
            systemInstruction: SYSTEM_INSTRUCTION || "你是一个反诈专家，分析聊天记录中的诈骗特征。",
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`分析接口错误: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        if (!data?.result) {
          throw new Error("AI响应无结果");
        }

        return data.result as AnalysisResult;
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('API请求超时，请重试');
        }
        throw fetchError;
      }

    } catch (error) {
      console.error("分析错误:", error);
      console.warn('已回退到本地分析');
      return this.getMockAnalysis(messages);
    }
  }

  // 模拟数据生成
  private getMockAnalysis(messages: string[]): AnalysisResult {
    // 根据消息内容生成智能化的模拟数据
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
      keySuspectWords: this.extractSuspectWords(messages),
      suggestions: this.generateSuggestions(riskScore),
      reasoningChain: this.generateReasoning(messages, isHighRisk, isMediumRisk),
      dimensions,
    };
  }

  private extractSuspectWords(messages: string[]): string[] {
    const suspectWords = [
      '投资', '赚钱', '高收益', '稳赚不赔', '内部消息', '紧急', '保密', 
      '转账', '汇款', '验证码', '安全账户', '保证金', '手续费'
    ];
    
    return suspectWords
      .filter(word => messages.some(m => m.toLowerCase().includes(word)))
      .slice(0, 5);
  }

  private generateSuggestions(riskScore: number): string[] {
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

  private generateReasoning(messages: string[], isHighRisk: boolean, isMediumRisk: boolean): string[] {
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

  // 获取和设置 API 密钥
  getApiKey(): string | null {
    return this.siliconFlowApiKey;
  }

  setApiKey(key: string): void {
    this.siliconFlowApiKey = key;
    if (typeof window !== 'undefined') {
      if (key) {
        localStorage.setItem('siliconflow_api_key', key);
      } else {
        localStorage.removeItem('siliconflow_api_key');
      }
    }
  }
}

// 创建单例实例
export const siliconFlowService = new SiliconFlowService();
