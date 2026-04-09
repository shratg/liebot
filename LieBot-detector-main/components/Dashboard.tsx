
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const data = [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 180 },
  { name: 'Thu', value: 450 },
  { name: 'Fri', value: 380 },
  { name: 'Sat', value: 600 },
  { name: 'Sun', value: 520 },
];

interface DashboardProps {
  onStart: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStart }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight text-white">智鉴 - 社交媒体诈骗智能测谎系统</h2>
        <p className="text-slate-400 text-lg">基于LLM的大规模语义理解与深度逻辑推理反诈引擎，用魔法打败魔法。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: '已分析对话数', value: '128,492', sub: '+12% 较昨日', color: 'blue' },
          { label: '成功拦截诈骗', value: '1,249', sub: '拦截率 98.2%', color: 'red' },
          { label: '活跃用户', value: '45.3k', sub: '在线中', color: 'green' },
          { label: '情报等级', value: '极高风险', sub: '发现新型AI诈骗', color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{stat.value}</span>
            </div>
            <p className={`text-xs mt-2 font-semibold ${
              stat.color === 'red' ? 'text-red-400' : 
              stat.color === 'blue' ? 'text-blue-400' : 
              stat.color === 'green' ? 'text-green-400' : 'text-orange-400'
            }`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-100">近期诈骗活动趋势</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-semibold text-slate-400">7 Days</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex-1 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 p-8 rounded-2xl flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-4">立即开始检测</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">粘贴可疑聊天记录，让AI反诈专家为您提供即时分析报告。</p>
            <button 
              onClick={onStart}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group"
            >
              <span>开启测谎工作台</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h4 className="font-bold text-slate-200 mb-4">实时预警情报</h4>
            <div className="space-y-4">
              {[
                { type: '杀猪盘', msg: '监测到针对单身女性的新型脚本', time: '12m ago' },
                { type: '虚拟货币', msg: '某诈骗APP正在大规模推广', time: '45m ago' }
              ].map((alert, idx) => (
                <div key={idx} className="flex gap-4 items-start border-l-2 border-red-500/50 pl-4 py-1">
                  <div>
                    <p className="text-xs font-bold text-red-400 uppercase tracking-wider">{alert.type}</p>
                    <p className="text-sm text-slate-300">{alert.msg}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
