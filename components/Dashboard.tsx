import React, { useState, useEffect, useRef } from 'react';
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

// 数字动画组件
const AnimatedNumber = ({ value, duration = 1000 }: { value: number, duration?: number }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCurrentValue(Math.floor(value * easeOutQuart));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value, duration]);

  return <span ref={ref}>{currentValue.toLocaleString()}</span>;
};

// 百分比动画组件
const AnimatedPercent = ({ value, duration = 1000 }: { value: number, duration?: number }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCurrentValue(Number((value * easeOutQuart).toFixed(1)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value, duration]);

  return <span ref={ref}>{currentValue}%</span>;
};

// 数据卡片组件
const StatCard = ({ 
  label, 
  value, 
  sub, 
  color, 
  note, 
  isAnimated = true,
  index
}: { 
  label: string; 
  value: string; 
  sub: string; 
  color: string; 
  note: string;
  isAnimated?: boolean;
  index: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, index * 100);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [index]);

  const isNumeric = (str: string) => {
    return /^[\d,]+$/.test(str.replace(/[^0-9,]/g, ''));
  };

  const extractNumber = (str: string) => {
    const num = str.replace(/[^0-9.]/g, '');
    return parseFloat(num) || 0;
  };

  const renderValue = () => {
    if (isAnimated && isNumeric(value)) {
      return <AnimatedNumber value={extractNumber(value)} duration={1200} />;
    } else if (isAnimated && sub.includes('%') && sub.match(/\d+(\.\d+)?%/)) {
      const percentValue = extractNumber(sub);
      return <>{value} <span className="text-lg">(准确率 <AnimatedPercent value={percentValue} duration={1200} />)</span></>;
    } else {
      return value;
    }
  };

  return (
    <div 
      ref={ref}
      className={`
        bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md relative
        transform transition-all duration-700
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
        }
      `}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {/* 背景辉光效果 */}
      <div 
        className={`
          absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300
          ${isVisible ? 'group-hover:opacity-100' : ''}
          ${color === 'red' ? 'bg-gradient-to-r from-red-500/5 to-transparent' : 
            color === 'blue' ? 'bg-gradient-to-r from-blue-500/5 to-transparent' : 
            color === 'green' ? 'bg-gradient-to-r from-green-500/5 to-transparent' : 
            'bg-gradient-to-r from-orange-500/5 to-transparent'}
        `}
      />
      
      {/* 动态边框效果 */}
      <div 
        className={`
          absolute inset-0 rounded-2xl border opacity-0 transition-all duration-300
          ${isVisible ? 'group-hover:opacity-30' : ''}
          ${color === 'red' ? 'border-red-500/30' : 
            color === 'blue' ? 'border-blue-500/30' : 
            color === 'green' ? 'border-green-500/30' : 
            'border-orange-500/30'}
        `}
        style={{
          animation: isVisible ? 'pulse 3s ease-in-out infinite' : 'none',
        }}
      />

      <div className="flex items-start justify-between mb-1 relative z-10">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {note && (
          <span className="text-xs px-2 py-0.5 bg-slate-800/50 rounded-md text-slate-400">
            {note}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2 relative z-10">
        <span className="text-3xl font-bold text-white">
          {renderValue()}
        </span>
      </div>
      <p className={`text-xs mt-2 font-semibold relative z-10 ${
        color === 'red' ? 'text-red-400' : 
        color === 'blue' ? 'text-blue-400' : 
        color === 'green' ? 'text-green-400' : 'text-orange-400'
      }`}>
        {sub}
      </p>
      
      {/* 数据点闪烁效果 */}
      {color === 'red' && (
        <div className="absolute top-3 right-3 w-2 h-2">
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
          <div className="absolute inset-0 bg-red-500 rounded-full" />
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ onStart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [barData, setBarData] = useState(data.map(item => ({ ...item, value: 0 })));
  const [isChartLoaded, setIsChartLoaded] = useState(false);

  // 图表数据加载动画
  useEffect(() => {
    if (!isChartLoaded) return;
    
    const timer = setTimeout(() => {
      setBarData(data);
    }, 300);

    return () => clearTimeout(timer);
  }, [isChartLoaded]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChartLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slideInRight {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>

      <header className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight text-white relative">
          <span className="relative">
            智鉴 - 社交媒体诈骗智能测谎系统
            <span className="absolute -top-1 -right-2 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          </span>
        </h2>
        <p className="text-slate-400 text-lg flex items-center gap-2">
          <span>基于大语言模型的深度语义理解与逻辑推理反诈引擎</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-400">实时在线</span>
          </span>
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: '已分析对话数', 
            value: '128,475',
            sub: '+2,342 较上周', 
            color: 'blue',
            note: '累计'
          },
          { 
            label: '成功识别诈骗', 
            value: '2,891', 
            sub: '识别准确率 95.7%',
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
          <div key={i} className="group cursor-pointer">
            <StatCard {...stat} index={i} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="transform transition-all duration-300 hover:scale-[1.02] origin-left">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                近期诈骗活动趋势
                <div className="relative">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-0" />
                </div>
              </h3>
              <p className="text-sm text-slate-500 mt-1">数据来源：系统检测的诈骗会话数（每日）</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-semibold text-slate-400 animate-pulse-glow">
                最近7天
              </span>
            </div>
          </div>
          <div className="h-[300px] w-full relative">
            {/* 图表背景网格动画 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent opacity-0 animate-shimmer pointer-events-none" />
            
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #1e293b', 
                    borderRadius: '12px',
                    fontSize: '12px',
                    backdropFilter: 'blur(10px)',
                    animation: 'slideInRight 0.3s ease-out'
                  }}
                  formatter={(value) => [`${value} 次`, '可疑对话数']}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#gradient)" 
                  radius={[4, 4, 0, 0]}
                  name="可疑对话数"
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div 
            className="flex-1 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 p-8 rounded-2xl flex flex-col justify-center relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* 背景动画 */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 animate-shimmer"
              style={{ 
                animationDuration: '4s',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s'
              }}
            />
            
            {/* 漂浮粒子效果 */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <div className="mb-2 text-xs font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full w-fit animate-float">
                立即体验
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 relative">
                开始风险检测
                <div className="absolute -right-6 -top-1 w-3 h-3">
                  <div className="w-full h-full bg-blue-500 rounded-full animate-ping opacity-60" />
                  <div className="absolute inset-0 bg-blue-500 rounded-full" />
                </div>
              </h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                粘贴可疑聊天内容，系统将基于千万级诈骗对话数据进行智能分析，识别潜在诈骗风险。
              </p>
              <button 
                onClick={onStart}
                className="relative bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group overflow-hidden"
              >
                {/* 按钮光效 */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/20 to-blue-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <span className="relative">开始检测</span>
                <svg 
                  className="w-5 h-5 relative transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                
                {/* 按钮外发光 */}
                <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 transition-colors" />
              </button>
              <p className="text-xs text-slate-500 mt-4 text-center">
                系统将保护您的隐私，对话内容仅用于分析
              </p>
            </div>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-200 flex items-center gap-2">
                实时风险预警
                <div className="relative">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0" />
                </div>
              </h4>
              <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-md font-medium animate-pulse">
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
                  className={`
                    flex gap-4 items-start border-l-4 pl-4 py-3 transition-all 
                    hover:bg-slate-800/30 rounded-r-md relative overflow-hidden
                    transform transition-all duration-300 hover:translate-x-1
                    ${alert.severity === 'high' 
                      ? 'border-red-500/80 bg-gradient-to-r from-red-500/5 to-transparent' 
                      : 'border-orange-500/60 bg-gradient-to-r from-orange-500/5 to-transparent'
                    }
                  `}
                  style={{
                    animationDelay: `${idx * 100}ms`,
                    animation: 'slideInRight 0.5s ease-out forwards',
                    opacity: 0,
                    transform: 'translateX(-20px)'
                  }}
                >
                  {/* 闪烁指示器 */}
                  {alert.severity === 'high' && (
                    <div className="absolute left-0 top-1/2 w-2 h-2 -translate-y-1/2">
                      <div className="w-full h-full bg-red-500 rounded-full animate-ping" />
                      <div className="absolute inset-0 bg-red-500 rounded-full" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-bold uppercase tracking-wider ${
                        alert.severity === 'high' ? 'text-red-400' : 'text-orange-400'
                      }`}>
                        {alert.type}
                      </p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        alert.severity === 'high' 
                          ? 'bg-red-500/20 text-red-300 animate-pulse' 
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
                24小时内已发布 <span className="text-slate-300 font-semibold animate-pulse">8</span> 条风险预警
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 底部信息栏 */}
      <div className="pt-4 border-t border-slate-800/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
          {[
            {
              title: '数据处理',
              desc: '所有对话经匿名化处理，符合隐私保护法规'
            },
            {
              title: '更新频率',
              desc: '统计数据每15分钟更新，预警信息实时更新'
            },
            {
              title: '数据覆盖',
              desc: '基于过去90天超过300万次分析数据'
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="transform transition-all duration-500 hover:scale-105"
              style={{
                animationDelay: `${600 + idx * 100}ms`,
                animation: 'slideInRight 0.5s ease-out forwards',
                opacity: 0,
                transform: 'translateX(-20px)'
              }}
            >
              <p className="text-sm text-slate-300 font-medium flex items-center gap-2">
                {item.title}
                <div className="w-1 h-1 bg-blue-500 rounded-full" />
              </p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;