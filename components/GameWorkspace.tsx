// src/components/GameWorkspace.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { GRANDMA_DIALOGUE_TREE } from './dialogues/grandmaDialogues';
import { OFFICE_WORKER_DIALOGUE_TREE } from './dialogues/officeWorkerDialogues';
import { BOSS_DIALOGUE_TREE } from './dialogues/bossDialogues';

// 游戏状态类型
type GameState = 'level-select' | 'playing' | 'mission-complete' | 'game-over';

// 游戏难度类型
type Difficulty = '简单' | '中等' | '困难';

// 诈骗对象类型
type Victim = {
  id: number;
  name: string;
  title: string;
  age: number;
  description: string;
  difficulty: Difficulty;
  avatar: string;
  background: string;
  psychologicalWeaknesses: string[];
  resistanceThreshold: number; // 抵抗阈值
  suspicionGrowthRate: number; // 怀疑增长速率
  moneyRanges: { min: number; max: number }[]; // 可骗取金额范围
};

// 话术选项类型
type DialogueOption = {
  id: string;
  text: string;
  trustChange: { min: number; max: number }; // 信任度变化范围
  suspicionChange: { min: number; max: number }; // 怀疑度变化范围
  moneyPotential: { min: number; max: number }; // 金钱潜力范围
  isAggressive: boolean; // 是否激进
  nextDialogueId?: string; // 下一个对话ID
  requirement?: (stats: GameStats) => boolean; // 选项要求
  cooldown?: number; // 冷却对话数
  unlockCondition?: (stats: GameStats) => boolean; // 解锁条件
};

// 对话节点类型
type DialogueNode = {
  id: string;
  victimText: string;
  options: DialogueOption[];
  isFinal?: boolean; // 是否是最终节点
  specialAction?: (stats: GameStats) => GameStats; // 特殊效果
};

// 游戏统计类型
type GameStats = {
  trust: number; // 信任度 0-100
  suspicion: number; // 怀疑度 0-100
  moneyObtained: number; // 已获取金额
  timeElapsed: number; // 经过时间（秒）
  dialogueCount: number; // 对话次数
  aggressiveMoves: number; // 激进操作次数
  recentAggressiveMoves: number; // 最近激进操作次数
  conversationPhase: number; // 对话阶段
  usedOptions: Set<string>; // 已使用的选项ID
};

// 业务指标类型
type BusinessMetric = {
  id: number;
  name: string;
  description: string;
  difficulty: Difficulty;
  targetValue: { min: number; max: number };
  currentValue: (stats: GameStats) => number;
};

// 游戏结果类型
type GameResult = {
  title: string;
  description: string;
  moneyObtained: number;
  isSuccess: boolean;
  analysis: string[];
  tips: string[];
};

// 游戏配置
const VICTIMS: Victim[] = [
  {
    id: 1,
    name: "王大妈",
    title: "退休老人",
    age: 65,
    description: "退休教师，独居，有一定积蓄但不太懂网络支付，子女在国外，情感上比较孤独。",
    difficulty: "简单",
    avatar: "👵",
    background: "退休教师，每月有稳定退休金，平时喜欢参加社区活动和养生讲座。",
    psychologicalWeaknesses: [
      "对权威（医生/警察）盲目信任",
      "健康焦虑，害怕生病",
      "情感孤独，渴望被关心",
      "对新科技不了解，容易被误导"
    ],
    resistanceThreshold: 25,
    suspicionGrowthRate: 0.8,
    moneyRanges: [
      { min: 200, max: 500 },
      { min: 1000, max: 3000 },
      { min: 5000, max: 10000 }
    ]
  },
  {
    id: 2,
    name: "小李",
    title: "白领青年",
    age: 28,
    description: "互联网公司职员，熟悉网络但投资经验不足，有房贷压力，渴望副业收入。",
    difficulty: "中等",
    avatar: "👨‍💼",
    background: "在一家中型互联网公司做运营，月薪1.5万，有30年房贷，经常浏览投资理财信息。",
    psychologicalWeaknesses: [
      "渴望快速致富，改变经济状况",
      "相信专业投资建议",
      "对内部消息没有抵抗力",
      "忙碌中容易忽略风险提示"
    ],
    resistanceThreshold: 40,
    suspicionGrowthRate: 1.2,
    moneyRanges: [
      { min: 1000, max: 3000 },
      { min: 5000, max: 10000 },
      { min: 20000, max: 50000 }
    ]
  },
  {
    id: 3,
    name: "陈总",
    title: "中小企业主",
    age: 45,
    description: "制造业企业老板，企业经营压力大，有贷款需求，警惕性较高但易被关系迷惑。",
    difficulty: "困难",
    avatar: "👨‍💼",
    background: "经营一家小型制造业企业，年营业额约500万，目前资金周转有些困难，正在寻找贷款渠道。",
    psychologicalWeaknesses: [
      "资金压力大，急需周转",
      "迷信政商关系和人脉",
      "好面子，不愿显得不懂行情",
      "对特殊渠道抱有幻想"
    ],
    resistanceThreshold: 60,
    suspicionGrowthRate: 1.8,
    moneyRanges: [
      { min: 10000, max: 30000 },
      { min: 50000, max: 100000 },
      { min: 200000, max: 500000 }
    ]
  }
];

// 业务指标配置
const BUSINESS_METRICS: BusinessMetric[] = [
  {
    id: 1,
    name: "信任建立",
    description: "建立基本信任，完成小额诈骗",
    difficulty: "简单",
    targetValue: { min: 1000, max: 5000 },
    currentValue: (stats) => stats.moneyObtained
  },
  {
    id: 2,
    name: "深度操控",
    description: "实现多层次、渐进式诈骗",
    difficulty: "中等",
    targetValue: { min: 10000, max: 30000 },
    currentValue: (stats) => stats.moneyObtained
  },
  {
    id: 3,
    name: "完美犯罪",
    description: "完成高难度完整诈骗链条",
    difficulty: "困难",
    targetValue: { min: 50000, max: 150000 },
    currentValue: (stats) => stats.moneyObtained
  }
];

// 获取对话树
const getDialogueTree = (victimId: number) => {
  switch(victimId) {
    case 1: return GRANDMA_DIALOGUE_TREE;
    case 2: return OFFICE_WORKER_DIALOGUE_TREE;
    case 3: return BOSS_DIALOGUE_TREE;
    default: return GRANDMA_DIALOGUE_TREE;
  }
};

// 获取随机值
const getRandomValue = (range: { min: number; max: number }) => {
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
};

// 生成游戏结果
const generateGameResult = (
  gameStats: GameStats,
  victim: Victim,
  metric: BusinessMetric,
  isVictory: boolean
): GameResult => {
  const targetValue = getRandomValue(metric.targetValue);
  const isCompleteSuccess = gameStats.moneyObtained >= targetValue;
  const isPartialSuccess = gameStats.moneyObtained >= targetValue * 0.5;
  
  if (isVictory) {
    if (isCompleteSuccess) {
      return {
        title: "完美诈骗！",
        description: `您成功从${victim.name}身上骗取了${gameStats.moneyObtained.toLocaleString()}元，超额完成目标！`,
        moneyObtained: gameStats.moneyObtained,
        isSuccess: true,
        analysis: [
          "您成功利用受害者的心理弱点，建立了足够的信任",
          "话术选择得当，在获取金钱的同时保持了较低的怀疑度",
          "诈骗过程流畅自然，没有引起对方警觉",
          "金额把控精准，达到了最佳诈骗效果"
        ],
        tips: [
          "现实中，诈骗分子正是利用这种心理操纵技术",
          "记住：任何要求提前支付费用的机会都要警惕",
          "遇到类似情况，务必通过官方渠道核实身份",
          "不要轻易相信陌生人的权威身份"
        ]
      };
    } else if (isPartialSuccess) {
      return {
        title: "诈骗成功！",
        description: `您从${victim.name}身上骗取了${gameStats.moneyObtained.toLocaleString()}元，但未完全达成目标。`,
        moneyObtained: gameStats.moneyObtained,
        isSuccess: true,
        analysis: [
          "您成功获取了部分钱财，但未能完全达成目标",
          "在建立信任方面做得不错，但收尾不够完美",
          "受害者可能在最后关头产生了疑虑",
          "诈骗过程中存在可以改进的地方"
        ],
        tips: [
          "现实中，即使诈骗未完全成功，受害者也会遭受损失",
          "及时报警可以最大程度减少损失",
          "不要因为损失不大就选择不报警",
          "保存好所有证据，包括通话记录和转账凭证"
        ]
      };
    } else {
      return {
        title: "诈骗失败",
        description: "您未能获取足够的钱财，但成功脱身。",
        moneyObtained: gameStats.moneyObtained,
        isSuccess: false,
        analysis: [
          "受害者警惕性较高，没有轻易上当",
          "您的话术未能完全消除对方的疑虑",
          "在获取钱财的环节出现了问题",
          "诈骗过程被对方识破或主动中止"
        ],
        tips: [
          "现实中，如果更多人能保持这样的警惕性，诈骗会大大减少",
          "对陌生电话涉及金钱的话题要格外小心",
          "任何紧急或限时的要求都可能是诈骗信号",
          "遇到可疑情况，立即挂断电话并报警"
        ]
      };
    }
  } else {
    return {
      title: "诈骗失败！",
      description: "您的诈骗行为被对方识破，已报警处理。",
      moneyObtained: gameStats.moneyObtained,
      isSuccess: false,
      analysis: [
        "受害者的怀疑度过高，识破了您的骗局",
        "激进的话术选择引起了对方警觉",
        "未能建立足够的信任就急于索要钱财",
        "诈骗过程存在明显漏洞"
      ],
      tips: [
        "现实中，警方会根据线索追踪诈骗分子",
        "电信诈骗是严重犯罪行为，会受到法律严惩",
        "不要因为贪图小利而走上犯罪道路",
        "如果您遭遇诈骗，请立即报警并提供所有信息"
      ]
    };
  }
};

const GameWorkspace: React.FC = () => {
  // 游戏状态
  const [gameState, setGameState] = useState<GameState>('level-select');
  const [selectedVictim, setSelectedVictim] = useState<Victim | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<BusinessMetric | null>(null);
  const [currentDialogueId, setCurrentDialogueId] = useState<string>('start');
  const [gameStats, setGameStats] = useState<GameStats>({
    trust: 50,
    suspicion: 20,
    moneyObtained: 0,
    timeElapsed: 0,
    dialogueCount: 0,
    aggressiveMoves: 0,
    recentAggressiveMoves: 0,
    conversationPhase: 1,
    usedOptions: new Set()
  });
  const [dialogueHistory, setDialogueHistory] = useState<Array<{
    speaker: 'victim' | 'player';
    text: string;
  }>>([]);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  // 计时器
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setGameStats(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // 检查游戏结束条件
  const checkGameEnd = useCallback(() => {
    if (gameState !== 'playing' || !selectedVictim || !selectedMetric) return;
    
    const dialogueTree = getDialogueTree(selectedVictim.id);
    const currentDialogue = dialogueTree[currentDialogueId];
    
    // 怀疑度过高，游戏失败
    if (gameStats.suspicion >= 100) {
      const result = generateGameResult(gameStats, selectedVictim, selectedMetric, false);
      setGameResult(result);
      setGameState('game-over');
      return;
    }
    
    // 信任度低于抵抗阈值，游戏失败
    if (gameStats.trust <= selectedVictim.resistanceThreshold) {
      const result = generateGameResult(gameStats, selectedVictim, selectedMetric, false);
      setGameResult(result);
      setGameState('game-over');
      return;
    }
    
    // 检查是否到达对话终点
    if (currentDialogue?.isFinal) {
      const targetValue = getRandomValue(selectedMetric.targetValue);
      const isSuccess = gameStats.moneyObtained >= targetValue;
      const result = generateGameResult(gameStats, selectedVictim, selectedMetric, isSuccess);
      setGameResult(result);
      setGameState(isSuccess ? 'mission-complete' : 'game-over');
      return;
    }
    
    // 检查是否完成业务指标
    if (!currentDialogue?.isFinal) {
      const targetValue = getRandomValue(selectedMetric.targetValue);
      if (gameStats.moneyObtained >= targetValue) {
        const result = generateGameResult(gameStats, selectedVictim, selectedMetric, true);
        setGameResult(result);
        setGameState('mission-complete');
      }
    }
  }, [gameStats, gameState, selectedVictim, selectedMetric, currentDialogueId]);

  // 监听状态变化，检查游戏结束
  useEffect(() => {
    checkGameEnd();
  }, [checkGameEnd]);

  // 开始游戏
  const startGame = (victim: Victim, metric: BusinessMetric) => {
    setSelectedVictim(victim);
    setSelectedMetric(metric);
    setGameStats({
      trust: 50,
      suspicion: 20,
      moneyObtained: 0,
      timeElapsed: 0,
      dialogueCount: 0,
      aggressiveMoves: 0,
      recentAggressiveMoves: 0,
      conversationPhase: 1,
      usedOptions: new Set()
    });
    setCurrentDialogueId('start');
    setDialogueHistory([{
      speaker: 'victim',
      text: getDialogueTree(victim.id)['start'].victimText
    }]);
    setGameState('playing');
    setGameResult(null);
  };

  // 选择对话选项
  const selectOption = (option: DialogueOption) => {
    if (!selectedVictim) return;
    
    const dialogueTree = getDialogueTree(selectedVictim.id);
    const currentDialogue = dialogueTree[currentDialogueId];
    
    if (!currentDialogue) return;
    
    // 更新游戏统计
    setGameStats(prev => {
      const trustChange = getRandomValue(option.trustChange);
      const suspicionChange = getRandomValue(option.suspicionChange);
      const moneyPotential = getRandomValue(option.moneyPotential);
      
      const newTrust = Math.max(0, Math.min(100, prev.trust + trustChange));
      const newSuspicion = Math.max(0, Math.min(100, 
        prev.suspicion + suspicionChange + (option.isAggressive ? selectedVictim.suspicionGrowthRate : 0)
      ));
      
      // 计算实际获得的金钱
      const moneyMultiplier = Math.max(0, prev.trust / 100);
      const actualMoney = Math.floor(moneyPotential * moneyMultiplier * (Math.random() * 0.3 + 0.7));
      const newMoney = prev.moneyObtained + (Math.random() > 0.3 ? actualMoney : 0);
      
      return {
        trust: newTrust,
        suspicion: newSuspicion,
        moneyObtained: newMoney,
        timeElapsed: prev.timeElapsed,
        dialogueCount: prev.dialogueCount + 1,
        aggressiveMoves: prev.aggressiveMoves + (option.isAggressive ? 1 : 0),
        recentAggressiveMoves: option.isAggressive ? prev.recentAggressiveMoves + 1 : 0,
        conversationPhase: Math.min(5, prev.conversationPhase + (prev.dialogueCount % 3 === 0 ? 1 : 0)),
        usedOptions: new Set(prev.usedOptions).add(option.id)
      };
    });
    
    // 添加玩家对话到历史
    setDialogueHistory(prev => [
      ...prev,
      { speaker: 'player', text: option.text }
    ]);
    
    // 如果有下一个对话
    if (option.nextDialogueId && dialogueTree[option.nextDialogueId]) {
      setCurrentDialogueId(option.nextDialogueId);
      setDialogueHistory(prev => [
        ...prev,
        { speaker: 'victim', text: dialogueTree[option.nextDialogueId!].victimText }
      ]);
    }
  };

  // 重新开始
  const restartGame = () => {
    setGameState('level-select');
    setSelectedVictim(null);
    setSelectedMetric(null);
    setGameResult(null);
  };

  // 渲染关卡选择界面
  const renderLevelSelect = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          诈骗模拟：攻防演习
        </h1>
        <p className="text-slate-400">扮演诈骗分子，了解诈骗手法，从而更好地防御</p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">选择诈骗对象</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VICTIMS.map(victim => (
              <div
                key={victim.id}
                className={`bg-slate-900/50 backdrop-blur-sm rounded-xl border p-6 cursor-pointer transition-all hover:scale-[1.02] ${
                  selectedVictim?.id === victim.id 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
                onClick={() => setSelectedVictim(victim)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-4xl mb-2">{victim.avatar}</div>
                    <h3 className="text-lg font-semibold text-white">{victim.name}</h3>
                    <p className="text-slate-300">{victim.title} · {victim.age}岁</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    victim.difficulty === '简单' ? 'bg-green-500/20 text-green-400' :
                    victim.difficulty === '中等' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {victim.difficulty}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-4">{victim.description}</p>
                <div className="space-y-2">
                  <p className="text-slate-300 text-sm font-medium">心理弱点：</p>
                  <ul className="text-slate-400 text-xs space-y-1">
                    {victim.psychologicalWeaknesses.slice(0, 2).map((weakness, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        {weakness}
                      </li>
                    ))}
                    {victim.psychologicalWeaknesses.length > 2 && (
                      <li className="text-slate-500">...等{victim.psychologicalWeaknesses.length - 2}个弱点</li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedVictim && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">选择业务指标</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BUSINESS_METRICS.map(metric => (
                <div
                  key={metric.id}
                  className={`bg-slate-900/50 backdrop-blur-sm rounded-xl border p-6 cursor-pointer transition-all ${
                    selectedMetric?.id === metric.id 
                      ? 'border-purple-500 bg-purple-500/10' 
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                  onClick={() => setSelectedMetric(metric)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{metric.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        metric.difficulty === '简单' ? 'bg-green-500/20 text-green-400' :
                        metric.difficulty === '中等' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {metric.difficulty}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        {metric.targetValue.min.toLocaleString()}-{metric.targetValue.max.toLocaleString()}
                      </p>
                      <p className="text-slate-400 text-xs">目标金额范围</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedVictim && selectedMetric && (
          <div className="text-center pt-4">
            <button
              onClick={() => startGame(selectedVictim, selectedMetric)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all transform hover:scale-105"
            >
              开始诈骗模拟
            </button>
            <p className="text-slate-500 text-sm mt-2">
              目标：从{selectedVictim.name}身上骗取{selectedMetric.targetValue.min.toLocaleString()}-{selectedMetric.targetValue.max.toLocaleString()}元
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 p-6 bg-slate-900/30 rounded-xl border border-slate-800">
        <h3 className="text-lg font-semibold text-white mb-3">⚠️ 游戏说明</h3>
        <ul className="text-slate-400 text-sm space-y-2">
          <li>• 本游戏为教育目的，模拟诈骗过程以提高防范意识</li>
          <li>• 您将扮演诈骗分子，尝试从不同目标身上骗取钱财</li>
          <li>• 游戏中的诈骗手法均为真实案例改编</li>
          <li>• 游戏结束后会提供详细的反诈分析和防范建议</li>
        </ul>
      </div>
    </div>
  );

  // 渲染游戏界面
  const renderGame = () => {
    if (!selectedVictim || !selectedMetric) return null;
    
    const dialogueTree = getDialogueTree(selectedVictim.id);
    const currentDialogue = dialogueTree[currentDialogueId];
    
    if (!currentDialogue) return null;
    
    return (
      <div className="space-y-6 h-full flex flex-col">
        {/* 游戏头部 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-4">
            <p className="text-slate-400 text-sm mb-1">诈骗目标</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedVictim.avatar}</span>
              <div>
                <p className="text-white font-semibold">{selectedVictim.name}</p>
                <p className="text-slate-400 text-sm">{selectedVictim.title}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-4">
            <p className="text-slate-400 text-sm mb-1">业务指标</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{selectedMetric.name}</p>
                <p className="text-slate-400 text-sm">{selectedMetric.difficulty}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-xl">
                  {gameStats.moneyObtained.toLocaleString()}元
                </p>
                <p className="text-slate-400 text-xs">已诈骗金额</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-4">
            <p className="text-slate-400 text-sm mb-1">游戏时间</p>
            <p className="text-white font-bold text-xl">
              {Math.floor(gameStats.timeElapsed / 60).toString().padStart(2, '0')}:
              {(gameStats.timeElapsed % 60).toString().padStart(2, '0')}
            </p>
            <p className="text-slate-400 text-xs">对话次数: {gameStats.dialogueCount}</p>
          </div>
        </div>

        {/* 状态条 */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-green-400">信任度</span>
              <span className="text-white">{gameStats.trust}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                style={{ width: `${gameStats.trust}%` }}
              />
            </div>
            <p className="text-slate-500 text-xs mt-1">
              低于{selectedVictim.resistanceThreshold}%时，对方会直接挂断电话
            </p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-red-400">怀疑度</span>
              <span className="text-white">{gameStats.suspicion}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                style={{ width: `${gameStats.suspicion}%` }}
              />
            </div>
            <p className="text-slate-500 text-xs mt-1">
              达到100%时，对方会报警
            </p>
          </div>
        </div>

        {/* 对话历史 */}
        <div className="flex-1 bg-slate-900/30 rounded-xl border border-slate-800 p-4 overflow-y-auto">
          <div className="space-y-4">
            {dialogueHistory.map((item, index) => (
              <div
                key={index}
                className={`flex ${item.speaker === 'player' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  item.speaker === 'player' 
                    ? 'bg-blue-500/20 border border-blue-500/30' 
                    : 'bg-slate-800/50 border border-slate-700/50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      item.speaker === 'player' 
                        ? 'bg-blue-500/30 text-blue-300' 
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {item.speaker === 'player' ? '我' : selectedVictim.avatar}
                    </span>
                    <span className={`text-sm font-medium ${
                      item.speaker === 'player' ? 'text-blue-300' : 'text-slate-300'
                    }`}>
                      {item.speaker === 'player' ? '诈骗者' : selectedVictim.name}
                    </span>
                  </div>
                  <p className="text-white">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 选项 */}
        {currentDialogue && (
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-4">
            <p className="text-slate-400 text-sm mb-3">选择您的诈骗话术：</p>
            <div className="grid grid-cols-1 gap-3">
              {currentDialogue.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => selectOption(option)}
                  className={`text-left p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                    option.isAggressive
                      ? 'bg-red-500/10 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/20'
                      : 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-medium">{option.text}</span>
                    {option.isAggressive && (
                      <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">激进</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染任务完成界面
  const renderMissionComplete = () => {
    if (!selectedVictim || !selectedMetric || !gameResult) return null;
    
    return (
      <div className="space-y-8 text-center">
        <div>
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            gameResult.isSuccess 
              ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' 
              : 'bg-gradient-to-br from-red-500/20 to-orange-500/20'
          }`}>
            <span className="text-4xl">{gameResult.isSuccess ? '💰' : '🚨'}</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{gameResult.title}</h2>
          <p className="text-slate-400 mb-6">{gameResult.description}</p>
          
          <div className="inline-block bg-slate-900/50 border border-slate-700 rounded-xl px-6 py-3">
            <p className="text-2xl font-bold text-white">{gameResult.moneyObtained.toLocaleString()}元</p>
            <p className="text-slate-400 text-sm">成功诈骗金额</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 rounded-xl p-6">
            <p className="text-slate-400 mb-2">所用时间</p>
            <p className="text-2xl font-bold text-white">
              {Math.floor(gameStats.timeElapsed / 60)}分{gameStats.timeElapsed % 60}秒
            </p>
          </div>
          
          <div className="bg-slate-900/50 rounded-xl p-6">
            <p className="text-slate-400 mb-2">对话次数</p>
            <p className="text-2xl font-bold text-white">{gameStats.dialogueCount}次</p>
          </div>
          
          <div className="bg-slate-900/50 rounded-xl p-6">
            <p className="text-slate-400 mb-2">激进操作</p>
            <p className="text-2xl font-bold text-white">{gameStats.aggressiveMoves}次</p>
          </div>
        </div>

        <div className="bg-slate-900/30 rounded-xl border border-slate-800 p-6 text-left">
          <h3 className="text-lg font-semibold text-white mb-4">📈 诈骗过程分析：</h3>
          <ul className="text-slate-300 space-y-3">
            {gameResult.analysis.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className={`mr-2 ${gameResult.isSuccess ? 'text-green-400' : 'text-red-400'}`}>
                  {gameResult.isSuccess ? '✓' : '•'}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900/30 rounded-xl border border-slate-800 p-6 text-left">
          <h3 className="text-lg font-semibold text-white mb-4">🛡️ 现实中的防范方法：</h3>
          <ul className="text-slate-300 space-y-3">
            {gameResult.tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-slate-500 text-sm">
            * 本游戏仅为教育目的，帮助您了解诈骗手法，提高防范意识 *
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={restartGame}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
            >
              重新开始
            </button>
            <button
              onClick={() => {
                setGameState('level-select');
                setSelectedVictim(null);
                setSelectedMetric(null);
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-colors"
            >
              挑战其他目标
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 渲染游戏失败界面
  const renderGameOver = () => renderMissionComplete();

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-2">诈骗模拟器</h1>
        <p className="text-slate-400">扮演诈骗分子，了解诈骗手法，从而更好地防御</p>
      </div>
      
      <div className="flex-1 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 overflow-auto">
        {gameState === 'level-select' && renderLevelSelect()}
        {gameState === 'playing' && renderGame()}
        {(gameState === 'mission-complete' || gameState === 'game-over') && renderMissionComplete()}
      </div>
    </div>
  );
};

export default GameWorkspace;