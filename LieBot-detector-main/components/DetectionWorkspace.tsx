// 文件位置: src/components/DetectionWorkspace.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { MOCK_CASES } from '../constants';
import { siliconFlowService } from '../services/siliconflow';
import { AnalysisResult, ChatMessage } from '../types';

// 风险等级配置
const RISK_LEVEL_CONFIG = {
  high: {
    label: '高风险诈骗',
    color: 'red',
    icon: '🔥',
    description: '极可能为诈骗，请立即停止交流',
    immediateActions: ['立即拉黑对方', '保存所有聊天记录', '拨打反诈热线96110'],
    warning: '检测到多个诈骗典型特征'
  },
  medium: {
    label: '中度风险', 
    color: 'yellow',
    icon: '⚠️',
    description: '存在可疑特征，需高度警惕',
    suggestions: ['暂停金钱往来', '核实对方身份', '勿透露个人信息'],
    warning: '发现3个以上风险点'
  },
  low: {
    label: '低风险',
    color: 'green',
    icon: '✅',
    description: '暂未发现明显诈骗特征',
    tips: ['保持正常警惕', '注意核实异常请求'],
    warning: null
  }
};

// 雷达图维度解释配置
const RADAR_DIMENSIONS_CONFIG = {
  '情绪煽动': {
    title: '情绪煽动指数',
    description: '检测对方是否使用紧急、威胁、卖惨等话术操控情绪',
    examples: ['"这是最后机会"', '"我现在很困难"', '"你不帮我我就完了"', '"真的很紧急"', '"我活不下去了"'],
    threshold: 60,
    tips: '诈骗分子常利用情绪操控降低受害者理性判断能力'
  },
  '金钱索取': {
    title: '金钱索取指数', 
    description: '检测聊天中涉及金钱、转账、投资的频率和话术',
    examples: ['急需用钱', '投资机会', '手续费/保证金', '急需周转', '高回报投资'],
    threshold: 50,
    tips: '直接或间接索要钱财是诈骗的核心特征'
  },
  '逻辑矛盾': {
    title: '逻辑矛盾指数',
    description: '检测对话中是否存在前后不一致、自相矛盾的陈述',
    examples: ['身份信息前后不符', '借款理由多次变化', '时间线存在冲突', '承诺与行为不符'],
    threshold: 40,
    tips: '诈骗话术常因编造而出现逻辑漏洞'
  },
  '身份存疑': {
    title: '身份存疑指数',
    description: '检测对方身份信息的真实性和可验证性',
    examples: ['拒绝视频验证', '身份信息模糊', '无法提供证明', '回避个人信息', '冒充他人身份'],
    threshold: 45,
    tips: '身份模糊是网络诈骗的常见特征'
  }
};

// 自定义雷达图Tooltip组件
const CustomRadarTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  const config = RADAR_DIMENSIONS_CONFIG[data.subject as keyof typeof RADAR_DIMENSIONS_CONFIG];
  const score = data.A;
  const isHighRisk = score >= config.threshold;
  
  return (
    <div className="bg-gray-900/95 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-2xl max-w-xs animate-in fade-in zoom-in">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-sm font-bold text-white">{config.title}</h4>
          <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
            isHighRisk 
              ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
              : 'bg-green-500/20 text-green-300 border border-green-500/30'
          }`}>
            {score}分 {isHighRisk ? '⚠️ 高风险' : '✅ 正常'}
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
          {score}
        </div>
      </div>
      
      <p className="text-xs text-slate-300 mb-3 leading-relaxed">{config.description}</p>
      
      {isHighRisk && (
        <div className="mb-3">
          <p className="text-xs font-medium text-amber-300 mb-1">⚠️ 风险说明：</p>
          <p className="text-xs text-amber-200/80 leading-relaxed">{config.tips}</p>
        </div>
      )}
      
      <div>
        <p className="text-xs font-medium text-slate-400 mb-1">常见话术示例：</p>
        <div className="flex flex-wrap gap-1">
          {config.examples.slice(0, 3).map((example, i) => (
            <span key={i} className="px-2 py-1 bg-slate-800/50 text-slate-300 rounded text-xs border border-slate-700">
              {example}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">风险阈值</span>
          <span className={`font-bold ${isHighRisk ? 'text-red-400' : 'text-green-400'}`}>
            {config.threshold}分 {isHighRisk ? '↗️ 已超' : '↘️ 未超'}
          </span>
        </div>
      </div>
    </div>
  );
};

const DetectionWorkspace: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [thinkingLogs, setThinkingLogs] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('9:41');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(null);

  // 更新时间
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 导入案例
  const handleImportCase = (caseId: string) => {
    const selectedCase = MOCK_CASES.find(c => c.id === caseId);
    if (selectedCase) {
      const newMessages: ChatMessage[] = selectedCase.messages.map((text, i) => ({
        id: `msg-${Date.now()}-${i}`,
        sender: 'bot',
        text,
        timestamp: new Date()
      }));
      setMessages(newMessages);
      setAnalysisResult(null);
      setThinkingLogs([]);
    }
  };

  // 添加消息
  const addMessage = (text: string, sender: 'user' | 'bot' = 'user') => {
    if (!text.trim()) return;
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender,
      text: text.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  // 分析聊天记录
  const runAnalysis = async () => {
    if (messages.length === 0) {
      setThinkingLogs(['请先导入案例或输入聊天内容']);
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setThinkingLogs(['正在初始化反诈专家模型...', '提取对话关键特征...']);
    
    try {
      const messageTexts = messages.map(m => `${m.sender === 'user' ? '用户' : '对方'}: ${m.text}`);
      
      setTimeout(() => {
        setThinkingLogs(prev => [...prev, '分析语境和情绪博弈...', '扫描逻辑漏洞...']);
      }, 800);
      
      const result = await siliconFlowService.analyzeChat(messageTexts);
      
      setTimeout(() => {
        setThinkingLogs(prev => [...prev, '逻辑分析完成', '生成风险画像...']);
      }, 1500);
      
      setTimeout(() => {
        setAnalysisResult(result);
        setIsAnalyzing(false);
        setThinkingLogs(prev => [...prev, '分析完成！']);
      }, 2000);
      
    } catch (err: any) {
      console.error('分析失败:', err);
      setThinkingLogs(prev => [...prev, '分析失败', err.message || '未知错误']);
      setIsAnalyzing(false);
    }
  };

  // 清除所有内容
  const clearAll = () => {
    setMessages([]);
    setAnalysisResult(null);
    setThinkingLogs([]);
    setInputText('');
  };

  // 雷达图数据
  const radarData = analysisResult ? [
    { subject: '情绪煽动', A: analysisResult.dimensions.emotional, full: 100 },
    { subject: '金钱索取', A: analysisResult.dimensions.monetary, full: 100 },
    { subject: '逻辑矛盾', A: analysisResult.dimensions.logic, full: 100 },
    { subject: '身份存疑', A: analysisResult.dimensions.identity, full: 100 },
  ] : [];

  // 获取风险等级
  const getRiskLevel = (score: number) => {
    if (score > 70) return 'high';
    if (score > 40) return 'medium';
    return 'low';
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-2rem)] overflow-hidden animate-in slide-in-from-bottom-4 duration-500 p-4">
      {/* 左侧：聊天模拟器 */}
      <div className="w-[400px] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">聊天模拟器</h2>
          <button
            onClick={clearAll}
            className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
          >
            清空
          </button>
        </div>
        
        {/* 案例选择 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {MOCK_CASES.map(c => (
            <button 
              key={c.id}
              onClick={() => handleImportCase(c.id)}
              className="flex-shrink-0 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* 手机模拟器 */}
        <div className="flex-1 bg-slate-900 border-[8px] border-slate-800 rounded-[2.5rem] shadow-2xl relative flex flex-col overflow-hidden">
          {/* 状态栏 */}
          <div className="h-8 bg-slate-800 flex items-center justify-between px-6 text-[10px] text-slate-400 font-bold">
            <span>{currentTime}</span>
            <div className="flex gap-1 items-center">
              <div className="w-3 h-3 border border-slate-400 rounded-sm"></div>
              <div className="w-4 h-3 bg-slate-400 rounded-sm"></div>
            </div>
          </div>

          {/* 聊天区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900 to-slate-950">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-400 mb-2">暂无聊天记录</p>
                <p className="text-xs text-slate-500">点击上方按钮导入案例</p>
                <p className="text-xs text-slate-500">或手动输入聊天内容</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                  }`}>
                    {msg.text}
                    <div className="text-xs opacity-50 mt-1 text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="p-4 bg-slate-800/50 border-t border-slate-700">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="输入聊天内容..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputText.trim()) {
                    addMessage(inputText, 'user');
                    setTimeout(() => {
                      addMessage('收到，请继续。', 'bot');
                    }, 500);
                  }
                }}
              />
              <button 
                onClick={() => addMessage(inputText, 'user')}
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-colors"
                disabled={!inputText.trim()}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 分析按钮 */}
        <button 
          onClick={runAnalysis}
          disabled={messages.length === 0 || isAnalyzing}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg ${
            messages.length === 0 || isAnalyzing
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white shadow-red-500/20'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>正在深度分析...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>AI深度测谎分析</span>
            </>
          )}
        </button>
      </div>

      {/* 右侧：分析报告 */}
      <div className="flex-1 flex flex-col gap-4 h-full">
        {/* 上半部分：雷达图和日志 */}
        <div className="grid grid-cols-2 gap-4 h-[280px]">
          {/* 雷达图 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 flex flex-col">
            <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
              风险维度雷达图
              <span className="text-xs text-slate-500 ml-1">(悬停查看解释)</span>
            </h3>
            <div className="flex-1 min-h-0 relative">
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#334155" gridType="polygon" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="风险值"
                      dataKey="A"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.5}
                      strokeWidth={2}
                      onMouseEnter={(data: any, index: number) => setActiveTooltipIndex(index)}
                      onMouseLeave={() => setActiveTooltipIndex(null)}
                    />
                    <Tooltip 
                      content={<CustomRadarTooltip />}
                      cursor={{ strokeDasharray: '3 3' }}
                      wrapperStyle={{ zIndex: 100 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30">
                  <div className="w-20 h-20 border-2 border-dashed border-slate-700 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500">等待分析结果</p>
                </div>
              )}
              
              {/* 维度解释指示器 */}
              {radarData.length > 0 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                  <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700/50">
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                      悬停雷达图各点查看详细风险解释
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI推理日志 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 flex flex-col overflow-hidden">
            <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-purple-500 rounded-full"></span>
              AI推理思考过程
            </h3>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {thinkingLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center opacity-30">
                  <p className="text-slate-500 text-sm">点击"AI深度测谎分析"查看AI思考过程</p>
                </div>
              ) : (
                <div className="space-y-2 font-mono text-sm">
                  {thinkingLogs.slice(-6).map((log, i) => (
                    <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-right-4">
                      <span className="text-purple-500 font-bold flex-shrink-0">{`${(i + 1).toString().padStart(2, '0')}`}</span>
                      <p className="text-slate-300">{log}</p>
                    </div>
                  ))}
                  {isAnalyzing && (
                    <div className="flex gap-2 items-center">
                      <span className="text-purple-500 font-bold">...</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 下半部分：最终结论 */}
        <div className={`flex-1 min-h-0 rounded-3xl p-6 border-2 transition-all duration-500 ${
          analysisResult 
          ? analysisResult.riskScore > 70 
            ? 'bg-gradient-to-br from-red-600/10 to-red-900/5 border-red-600/30' 
            : analysisResult.riskScore > 40
            ? 'bg-gradient-to-br from-yellow-600/10 to-yellow-900/5 border-yellow-600/30'
            : 'bg-gradient-to-br from-green-600/10 to-green-900/5 border-green-600/30'
          : 'bg-slate-900/50 border-slate-800'
        }`}>
          {!analysisResult ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-700 mb-2">等待检测结论</h4>
              <p className="text-slate-600 text-sm">点击"AI深度测谎分析"按钮，专家系统将生成详细的风险报告</p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto pr-2">
              <div className="animate-in fade-in zoom-in duration-500">
                {/* 风险等级卡片 */}
                {analysisResult && (() => {
                  const riskLevel = getRiskLevel(analysisResult.riskScore);
                  const config = RISK_LEVEL_CONFIG[riskLevel];
                  
                  return (
                    <div className={`mb-6 p-4 rounded-2xl border-2 ${
                      riskLevel === 'high' 
                        ? 'bg-red-900/10 border-red-600/30' 
                        : riskLevel === 'medium'
                        ? 'bg-yellow-900/10 border-yellow-600/30'
                        : 'bg-green-900/10 border-green-600/30'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                            riskLevel === 'high' 
                              ? 'bg-red-600/20 text-red-400' 
                              : riskLevel === 'medium'
                              ? 'bg-yellow-600/20 text-yellow-400'
                              : 'bg-green-600/20 text-green-400'
                          }`}>
                            {config.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xl font-bold ${
                                riskLevel === 'high' 
                                  ? 'text-red-400' 
                                  : riskLevel === 'medium'
                                  ? 'text-yellow-400'
                                  : 'text-green-400'
                              }`}>
                                {config.label}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                riskLevel === 'high' 
                                  ? 'bg-red-600/20 text-red-300' 
                                  : riskLevel === 'medium'
                                  ? 'bg-yellow-600/20 text-yellow-300'
                                  : 'bg-green-600/20 text-green-300'
                              }`}>
                                {analysisResult.riskScore}分
                              </span>
                            </div>
                            <p className="text-white text-sm font-medium">{config.description}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-500 uppercase mb-1">欺诈风险指数</p>
                          <p className={`text-4xl font-black ${
                            riskLevel === 'high' 
                              ? 'text-red-500' 
                              : riskLevel === 'medium'
                              ? 'text-yellow-500'
                              : 'text-green-500'
                          }`}>
                            {analysisResult.riskScore}<span className="text-xl text-slate-500">%</span>
                          </p>
                        </div>
                      </div>
                      
                      {config.warning && (
                        <div className={`mb-3 p-2 rounded-lg ${
                          riskLevel === 'high' 
                            ? 'bg-red-600/10 border border-red-600/20' 
                            : 'bg-yellow-600/10 border border-yellow-600/20'
                        }`}>
                          <p className="text-sm font-medium text-white flex items-center gap-2">
                            <span>⚠️</span>
                            <span>{config.warning}</span>
                          </p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase mb-2">立即行动建议</p>
                          <ul className="space-y-1">
                            {riskLevel === 'high' 
                              ? config.immediateActions?.map((action, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm text-white">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                    {action}
                                  </li>
                                ))
                              : riskLevel === 'medium'
                              ? config.suggestions?.map((suggestion, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm text-white">
                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                                    {suggestion}
                                  </li>
                                ))
                              : config.tips?.map((tip, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm text-white">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    {tip}
                                  </li>
                                ))
                            }
                          </ul>
                        </div>
                        
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase mb-2">风险类型</p>
                          <h4 className="text-xl font-bold text-white mb-1">{analysisResult.fraudType}</h4>
                          <p className="text-slate-400 text-sm">基于AI多维度分析得出的结论</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-3 bg-red-500 rounded-full"></span>
                      关键嫌疑特征
                    </h5>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {analysisResult.keySuspectWords.length > 0 ? (
                        analysisResult.keySuspectWords.map((word, i) => (
                          <span key={i} className="px-3 py-1.5 bg-red-500/10 text-red-300 rounded-lg text-sm border border-red-500/20">
                            {word}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-500 text-sm">未检测到明显嫌疑词汇</p>
                      )}
                    </div>

                    <h5 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-3 bg-blue-500 rounded-full"></span>
                      专家反诈建议
                    </h5>
                    <ul className="space-y-2">
                      {analysisResult.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <div className="w-5 h-5 rounded-full bg-blue-500/20 flex-shrink-0 flex items-center justify-center text-blue-400 font-bold text-xs mt-0.5">
                            {i + 1}
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">{suggestion}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-3 bg-purple-500 rounded-full"></span>
                      多维逻辑链拆解
                    </h5>
                    <div className="space-y-2">
                      {analysisResult.reasoningChain.map((step, i) => (
                        <div key={i} className="bg-black/20 rounded-xl p-3 border border-white/5">
                          <div className="flex gap-2 items-start">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                              {i + 1}
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed italic">"{step}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
                      <h5 className="text-xs font-bold text-slate-400 uppercase mb-1">反诈热线</h5>
                      <p className="text-xl font-bold text-white">96110</p>
                      <p className="text-xs text-slate-500">全国反诈预警劝阻咨询专线</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetectionWorkspace;