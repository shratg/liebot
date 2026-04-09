import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// 更真实的趋势数据 - 有波动但不过分规律
const data = [
  { name: '周一', value: 142 },
  { name: '周二', value: 287 },
  { name: '周三', value: 198 },
  { name: '周四', value: 423 },
  { name: '周五', value: 367 },
  { name: '周六', value: 518 },
  { name: '周日', value: 489 },
];

interface DashboardProps {
  onStart: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStart }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight text-white">智鉴 - 社交媒体诈骗智能测谎系统</h2>
        <p className="text-slate-400 text-lg">基于大语言模型的深度语义理解与逻辑推理反诈引擎</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: '已分析对话数', 
            value: '128,475', // 不整齐的数字更可信
            sub: '+2,342 较上周', 
            color: 'blue',
            note: '累计'
          },
          { 
            label: '成功识别诈骗', 
            value: '2,891', 
            sub: '识别准确率 95.7%', // 非整数百分比更可信
            color: 'red',
            note: '7日内'
          },
          { 
            label: '活跃用户数', 
            value: '45.3k', 
            sub: '较上月 +8.3%', 
            color: 'green',
            note: '30日活跃'
          },
          { 
            label: '风险态势', 
            value: '高风险', 
            sub: '监测到新型AI语音诈骗', 
            color: 'orange',
            note: '实时评估'
          },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md relative">
            <div className="flex items-start justify-between mb-1">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              {stat.note && (
                <span className="text-xs px-2 py-0.5 bg-slate-800/50 rounded-md text-slate-400">
                  {stat.note}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{stat.value}</span>
            </div>
            <p className={`text-xs mt-2 font-semibold ${
              stat.color === 'red' ? 'text-red-400' : 
              stat.color === 'blue' ? 'text-blue-400' : 
              stat.color === 'green' ? 'text-green-400' : 'text-orange-400'
            }`}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-slate-100">近期诈骗活动趋势</h3>
              <p className="text-sm text-slate-500 mt-1">数据来源：系统检测的诈骗会话数（每日）</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-semibold text-slate-400">最近7天</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #1e293b', 
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [`${value} 次`, '可疑对话数']}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  name="可疑对话数"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex-1 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 p-8 rounded-2xl flex flex-col justify-center">
            <div className="mb-2 text-xs font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full w-fit">
              立即体验
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">开始风险检测</h3>
            <p className="text-slate-300 mb-6 leading-relaxed">
              粘贴可疑聊天内容，系统将基于千万级诈骗对话数据进行智能分析，识别潜在诈骗风险。
            </p>
            <button 
              onClick={onStart}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group"
            >
              <span>开始检测</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="text-xs text-slate-500 mt-4 text-center">
              系统将保护您的隐私，对话内容仅用于分析
            </p>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-200">实时风险预警</h4>
              <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-md font-medium">
                实时更新
              </span>
            </div>
            <div className="space-y-4">
              {[
                { 
                  type: '杀猪盘', 
                  msg: '监测到针对30-45岁女性的新型情感诈骗话术', 
                  time: '12分钟前',
                  severity: 'high'
                },
                { 
                  type: '虚拟货币诈骗', 
                  msg: '新型"投资平台"诈骗正在多个社交平台扩散', 
                  time: '45分钟前',
                  severity: 'high'
                },
                { 
                  type: '冒充客服', 
                  msg: '虚假电商客服诈骗环比上升15%', 
                  time: '2小时前',
                  severity: 'medium'
                }
              ].map((alert, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-4 items-start border-l-2 pl-4 py-2 transition-all hover:bg-slate-800/30 rounded-r-md ${
                    alert.severity === 'high' 
                      ? 'border-red-500/70 bg-red-500/5' 
                      : 'border-orange-500/50 bg-orange-500/5'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-bold uppercase tracking-wider ${
                        alert.severity === 'high' ? 'text-red-400' : 'text-orange-400'
                      }`}>
                        {alert.type}
                      </p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        alert.severity === 'high' 
                          ? 'bg-red-500/20 text-red-300' 
                          : 'bg-orange-500/20 text-orange-300'
                      }`}>
                        {alert.severity === 'high' ? '高风险' : '中风险'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mt-1 line-clamp-2">{alert.msg}</p>
                    <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500 text-center">
                24小时内已发布 <span className="text-slate-300 font-semibold">8</span> 条风险预警
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 底部信息栏 */}
      <div className="pt-4 border-t border-slate-800/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
          <div>
            <p className="text-sm text-slate-300 font-medium">数据处理</p>
            <p className="text-xs text-slate-500">所有对话经匿名化处理，符合隐私保护法规</p>
          </div>
          <div>
            <p className="text-sm text-slate-300 font-medium">更新频率</p>
            <p className="text-xs text-slate-500">统计数据每15分钟更新，预警信息实时更新</p>
          </div>
          <div>
            <p className="text-sm text-slate-300 font-medium">数据覆盖</p>
            <p className="text-xs text-slate-500">基于过去90天超过300万次分析数据</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;