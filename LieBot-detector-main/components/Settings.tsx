
import React from 'react';
import { SYSTEM_INSTRUCTION } from '../constants';

const Settings: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">模型配置中心</h2>
        <p className="text-slate-400">自定义后端推理引擎与专家系统Prompt，适配不同实战场景。</p>
      </header>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">AI 提供商</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200">
              <option>Google Gemini (Native)</option>
              <option>OpenAI GPT-4</option>
              <option>Claude 3.5 Sonnet</option>
              <option>DeepSeek R1</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">模型名称</label>
            <input type="text" defaultValue="gemini-3-flash-preview" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">API 基址 (Base URL)</label>
          <input type="text" defaultValue="https://generativelanguage.googleapis.com" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">API Key</label>
          <div className="relative">
            <input type="password" value="••••••••••••••••••••" readOnly className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200" />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">系统提示词 (System Prompt)</label>
            <span className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-1 rounded">专家模式</span>
          </div>
          <textarea 
            rows={8}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-400 text-xs font-mono leading-relaxed"
            defaultValue={SYSTEM_INSTRUCTION}
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-green-500">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">连接正常 - Ping: 42ms</span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-8 rounded-xl transition-all">
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
