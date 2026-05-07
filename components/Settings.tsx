
import React, { useState, useEffect } from 'react';
import { SYSTEM_INSTRUCTION } from '../constants';
import { siliconFlowService } from '../services/siliconflow';

const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    // 读取已保存的 API 密钥
    const existingKey = siliconFlowService.getApiKey();
    if (existingKey) {
      setApiKey(existingKey);
    }
  }, []);

  const handleSaveConfig = () => {
    setSaveStatus('saving');
    try {
      siliconFlowService.setApiKey(apiKey);
      setSaveStatus('success');
      setStatusMessage('配置已保存');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setStatusMessage('保存失败');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">模型配置中心</h2>
        <p className="text-slate-400">配置硅基流动 API 实现真实的反诈分析。</p>
      </header>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="bg-blue-600/10 border border-blue-600/30 rounded-2xl p-4">
          <p className="text-blue-300 text-sm">
            💡 <strong>使用方法：</strong>
          </p>
          <ol className="text-blue-300/80 text-sm mt-2 space-y-1 ml-6 list-decimal">
            <li>访问 <a href="https://www.siliconflow.cn/account/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">硅基流动控制台</a> 获取 API 密钥</li>
            <li>将密钥粘贴到下方的 API Key 字段</li>
            <li>点击"保存配置"按钮</li>
            <li>刷新页面即可使用真实 AI 分析</li>
          </ol>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">AI 提供商</label>
            <div className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200">
              硅基流动 (SiliconFlow)
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">模型名称</label>
            <div className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200">
              deepseek-ai/DeepSeek-V4-Flash
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">API 端点</label>
          <div className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 text-sm">
            https://api.siliconflow.cn/v1/chat/completions
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">API Key</label>
          <div className="relative">
            <input 
              type={showApiKey ? "text" : "password"} 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500" 
            />
            <button 
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showApiKey ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">💾 API 密钥只存储在您的浏览器本地，不会上传到服务器</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">系统提示词 (System Prompt)</label>
            <span className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-1 rounded">专家模式</span>
          </div>
          <textarea 
            rows={8}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-400 text-xs font-mono leading-relaxed cursor-not-allowed"
            defaultValue={SYSTEM_INSTRUCTION}
            readOnly
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
          <div className={`flex items-center gap-2 ${
            apiKey ? 'text-green-500' : 'text-yellow-500'
          }`}>
            <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm font-medium">
              {apiKey ? 'API 密钥已配置' : '未配置 API 密钥 - 将使用本地分析'}
            </span>
          </div>
          <div className="flex gap-3 items-center">
            {statusMessage && (
              <span className={`text-sm ${
                saveStatus === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {statusMessage}
              </span>
            )}
            <button 
              onClick={handleSaveConfig}
              disabled={saveStatus === 'saving'}
              className={`font-bold py-2 px-8 rounded-xl transition-all ${
                saveStatus === 'saving' 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {saveStatus === 'saving' ? '保存中...' : '保存配置'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
