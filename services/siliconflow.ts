// 文件位置: src/services/siliconflow.ts
import { SYSTEM_INSTRUCTION } from "../constants";
import { AnalysisResult } from "../types";

export class SiliconFlowService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    // 注意：在浏览器端需要使用 import.meta.env
    this.apiKey = import.meta.env.VITE_SILICONFLOW_API_KEY || '';
    this.baseURL = 'https://api.siliconflow.cn/v1';
    
    if (!this.apiKey && import.meta.env.MODE === 'development') {
      console.warn('⚠️ 未找到SiliconFlow API密钥，将使用模拟数据');
    }
  }

  async analyzeChat(messages: string[], imageBase64?: string): Promise<AnalysisResult> {
    // 如果没有API密钥，使用模拟数据
    if (!this.apiKey) {
      console.log('使用模拟数据（无API密钥）');
      return this.getMockAnalysis(messages);
    }

    try {
      // 1. 构建用户消息
      const userContent: any[] = [
        {
          type: "text",
          text: `请分析以下聊天记录，判断是否为诈骗：\n${messages.join('\n')}`,
        },
      ];

      // 2. 如果存在图片，添加到消息中
      if (imageBase64) {
        userContent.push({
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${imageBase64}`,
          },
        });
      }

      // 3. 准备请求体
      const requestBody = {
        model: "deepseek-ai/DeepSeek-V3.2", // 免费模型
        messages: [
          {
            role: "system",
            content: SYSTEM_INSTRUCTION || "你是一个反诈专家，分析聊天记录中的诈骗特征。",
          },
          {
            role: "user",
            content: userContent,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 2000,
      };

      // 4. 发起API请求
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API错误:', response.status, errorText);
        return this.getMockAnalysis(messages);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error("AI响应无内容");
      }

      return JSON.parse(content) as AnalysisResult;

    } catch (error) {
      console.error("SiliconFlow分析错误:", error);
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
}

// 创建单例实例
export const siliconFlowService = new SiliconFlowService();


// import { GoogleGenAI, Type } from "@google/genai";
// import { SYSTEM_INSTRUCTION } from "../constants";
// import { AnalysisResult } from "../types";

// export class GeminiService {
//   private ai: GoogleGenAI;

//   constructor() {
//     this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
//   }

//   async analyzeChat(messages: string[], imageBase64?: string): Promise<AnalysisResult> {
//     try {
//       const prompt = `分析以下聊天记录：\n${messages.join('\n')}${imageBase64 ? '\n[包含一张附件图片]' : ''}`;
      
//       const contents: any = { parts: [{ text: prompt }] };
//       if (imageBase64) {
//         contents.parts.push({
//           inlineData: {
//             mimeType: 'image/jpeg',
//             data: imageBase64
//           }
//         });
//       }

//       const response = await this.ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents: [contents],
//         config: {
//           systemInstruction: SYSTEM_INSTRUCTION,
//           responseMimeType: "application/json",
//           temperature: 0.2,
//         },
//       });

//       if (!response.text) throw new Error("No response from AI");
//       return JSON.parse(response.text.trim()) as AnalysisResult;
//     } catch (error) {
//       console.error("Gemini analysis error:", error);
//       throw error;
//     }
//   }
// }

// export const geminiService = new GeminiService();
