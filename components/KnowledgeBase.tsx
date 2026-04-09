import React, { useState } from 'react';

interface Article {
  title: string;
  tags: string[];
  desc: string;
  color: string;
  details?: string;
}

const KnowledgeBase: React.FC = () => {
  // const [searchTerm, setSearchTerm] = useState('');
  // const [filteredArticles, setFilteredArticles] = useState(articles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const articles: Article[] = [
    {
      title: '杀猪盘深度剖析',
      tags: ['情感诱导', '虚拟投资'],
      desc: '从"养猪"到"杀猪"，LLM揭示诈骗者如何通过心理暗示逐步建立信任并实施诈骗。',
      color: 'blue',
      details: `杀猪盘是一种网络交友诈骗手段，主要分为以下阶段：

🐷 1. 找猪：诈骗者在社交平台伪装成功人士，寻找情感空虚或有一定经济基础的目标
🐷 2. 养猪：通过1-3个月的日常聊天建立感情，获取信任，期间会透露"投资内幕"、"赚钱机会"
🐷 3. 杀猪：诱导投资虚假平台，前期小额提现成功，大额投入后无法提现
🐷 4. 消失：得手后立即消失，更换身份继续行骗

🔍 识别要点：
• 刚认识就异常热情，快速建立恋爱关系
• 拒绝视频通话或线下见面，总有各种借口
• 聊天中会无意透露"投资内幕"、"稳赚不赔"
• 催促你尽快转账，制造紧迫感

🛡️ 防范建议：
1. 不轻信网恋对象的投资建议
2. 不向陌生人透露个人经济状况
3. 不向陌生投资平台转账
4. 发现可疑立即报警，保存聊天记录`
    },
    {
      title: '新型AI变声诈骗',
      tags: ['技术伪装', '紧急求助'],
      desc: '利用AI合成亲友声音进行求助转账。识别关键点：声音虽像，但缺乏共同记忆细节。',
      color: 'purple',
      details: `AI变声诈骗利用深度伪造技术，只需3秒语音即可克隆声音，诈骗成功率高达80%。

🎭 诈骗流程：
1. 获取目标声音样本（通过社交平台、电话录音）
2. AI训练声音模型，模拟目标声音特征
3. 制造紧急场景（车祸、被绑架、急用钱）
4. 通过电话或语音消息实施诈骗

🎯 核心漏洞：
• 声音虽像，但语气、语调、用词习惯会有差异
• 无法准确回答只有你们知道的私密问题
• 会拒绝视频通话验证
• 通常要求立即转账，不给思考时间

🔧 识别方法：
1. 主动询问只有你们知道的细节（如"我们上次在哪里吃饭？"）
2. 要求视频通话验证
3. 联系共同好友核实情况
4. 挂断后回拨确认

⚠️ 注意：即使是亲人声音，只要涉及转账，必须多重验证！`
    },
    {
      title: '高回报投资陷阱',
      tags: ['内幕消息', '限时抢购'],
      desc: '任何声称"稳赚不赔"、"内部漏洞"的理财平台均为诈骗。通过逻辑分析识破其虚假背书。',
      color: 'red',
      details: `年化收益超过10%的投资都要警惕，宣称"稳赚不赔"的100%是诈骗。

💰 常见话术：
• "内部消息，只告诉你一个人"
• "最后3个名额，抢完就没了"
• "国家扶持项目，0风险高回报"
• "上市公司背景，资金安全有保障"

📈 诈骗套路：
阶段1：小甜头
  - 注册送888元体验金
  - 首次投资1000元，当天提现1200元
  - 导师一对一指导，看似专业

阶段2：大收割
  - 推荐"至尊项目"，要求5万起投
  - 收益显示每天上涨，但无法提现
  - 客服以"系统升级"、"流水不足"为由拖延
  - 最终平台消失，无法联系

🔍 识别技巧：
1. 查备案：正规理财平台都有金融牌照
2. 看回报：超出正常范围（>8%）必有问题
3. 试提现：小额入金后立即尝试提现
4. 查域名：新注册域名（<1年）风险极高

💡 黄金法则：你图他的利息，他图你的本金！`
    },
    {
      title: '公检法办案流程常识',
      tags: ['权威冒充', '恐惧心理'],
      desc: '真正的公检法机关不会通过电话办案，更不会要求将资金转入"安全账户"。',
      color: 'orange',
      details: `公安、检察院、法院有严格的办案程序，绝不会通过电话处理案件。

⚖️ 正规办案流程：
1. 现场出示证件、法律文书
2. 两人以上共同执法
3. 当面制作询问/讯问笔录
4. 如需冻结账户，需法院正式文书
5. 不会要求提供银行卡密码、验证码

🚨 诈骗话术：
• "你涉嫌洗钱/贩毒/非法集资"
• "这是保密案件，不能告诉任何人"
• "加QQ/微信，给你看通缉令"
• "将钱转到安全账户接受调查"
• "不配合就马上逮捕你"

🎭 诈骗升级版：
1. 伪造"逮捕令"、"通缉令"图片
2. 通过伪基站发送"官方号码"短信
3. 要求下载"安全防护"APP（实为远程控制）
4. 诱骗开通屏幕共享，窃取银行信息

🛡️ 正确做法：
1. 挂断电话，拨打110或反诈专线96110核实
2. 绝不透露身份证、银行卡、验证码
3. 绝不下载不明APP，不开启屏幕共享
4. 立即前往最近的派出所咨询

📞 记住：真警察不会吓唬你，假警察才会威胁你！`
    },
    {
      title: '海外兼职刷单骗局',
      tags: ['小额返利', '佣金诱惑'],
      desc: '以"动动手指赚大钱"为诱饵，前几单小额返利，大额任务后便无法提现。',
      color: 'green',
      details: `刷单诈骗占网络诈骗的30%，学生、宝妈是主要受害群体。

📱 诈骗渠道：
• 微信/QQ群："正规平台，日赚300-500"
• 短视频平台："宝妈兼职，月入过万"
• 短信邀请："鉴于您信用良好，特邀兼职"
• 招聘网站："在家办公，时间自由"

🔄 诈骗流程：
第1步：小额诱惑
  - 关注公众号/点赞，每单2-5元
  - 充值100元，返现120元（立即到账）
  - 建立信任，获取银行卡信息

第2步：大额收割
  - 推荐"福利单"，需垫付3000元
  - 以"操作错误"、"需做连单"为由拒绝提现
  - 要求继续充值"解冻"，否则本金全无
  - 最终被拉黑，无法联系

🎯 心理操控：
• 利用"沉没成本"心理，让你不断投钱
• 伪造群聊，多人演戏营造真实感
• 出示虚假营业执照、法人身份证
• 威胁"不完成订单就起诉你违约"

🛡️ 防范要点：
1. 所有需要垫资的兼职都是诈骗
2. 拒绝下载不明APP
3. 不透露银行卡、验证码
4. 立即举报相关群聊

💡 牢记：正经工作不会让你先交钱！`
    },
    {
      title: '数字藏品(NFT)欺诈',
      tags: ['虚假炒作', '庄家操盘'],
      desc: '分析虚假NFT项目的代码与社区热度，揭露其背后的"空气币"本质与收割逻辑。',
      color: 'cyan',
      details: `国内99%的NFT/数字藏品平台都是资金盘，本质是击鼓传花的骗局。

🎨 包装话术：
• "区块链+艺术品，唯一数字凭证"
• "赋能实体经济，稀缺性保证价值"
• "大厂背书，技术领先"
• "只涨不跌，稳赚不赔"

📉 收割套路：
阶段1：造势期（1-2个月）
  - 限量发售，饥饿营销
  - 媒体造势，KOL推广
  - 制造稀缺性假象

阶段2：拉盘期（2-3个月）
  - 庄家左手倒右手，拉高价格
  - 制造"暴富神话"，吸引散户
  - 开放二级市场，允许交易

阶段3：收割期（突然）
  - 停止回购，价格暴跌
  - 限制提现，修改规则
  - 平台维护，无法登录
  - 团队失联，APP下架

🔍 识别空气NFT：
1. 代码未开源，智能合约不可查
2. 团队匿名，无真实身份
3. 社区机器人多，真实用户少
4. 只谈收益，不谈风险
5. 无法上主流交易所

⚠️ 风险提示：
• 国内数字藏品无法律保障
• 平台可随时修改规则
• 大部分无法变现，只是数字图片
• 本质是庞氏骗局，最后一批接盘者血本无归

🛡️ 投资建议：
1. 不懂不投，NFT非普通人投资品
2. 只用闲钱，不影响生活
3. 做好归零准备
4. 远离国内数字藏品平台`
    }
  ];
  
  const handleCardClick = (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedArticle(null), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">反诈知识库</h2>
            <p className="text-slate-400">全球诈骗剧本实时解析，用数据武装头脑。</p>
          </div>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="搜索诈骗手法..." 
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm w-64 focus:border-blue-500 outline-none"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art, idx) => (
            <div 
              key={idx} 
              onClick={() => handleCardClick(art)}
              onKeyDown={(e) => e.key === 'Enter' && handleCardClick(art)}
              tabIndex={0}
              role="button"
              aria-label={`查看${art.title}的详细拆解`}
              className="group bg-slate-900/50 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all cursor-pointer relative overflow-hidden active:scale-[0.98] transform duration-150"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-10 bg-${art.color}-500 blur-3xl group-hover:opacity-20 transition-opacity`}></div>
              <div className="flex gap-2 mb-4">
                {art.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full font-bold uppercase">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{art.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-6">
                {art.desc}
              </p>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold group-hover:translate-x-1 transition-transform">
                <span>阅读完整拆解</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 flex items-center justify-between shadow-2xl shadow-blue-900/20">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold text-white mb-2">想了解更多特定场景？</h3>
            <p className="text-blue-100/80">您可以直接在测谎工作台模拟对应场景，AI专家将根据您的具体对话生成个性化的深度拆解报告。</p>
          </div>
          <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors">
            贡献反诈案例
          </button>
        </div>
      </div>

      {/* 详情弹窗 - 已修复布局问题 */}
      {isModalOpen && selectedArticle && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <div 
            className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-4xl flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div className="flex justify-between items-start p-6 border-b border-gray-800 flex-shrink-0">
              <div className="flex-1 mr-4">
                <div className="flex gap-2 mb-3 flex-wrap">
                  {selectedArticle.tags.map(tag => (
                    <span key={tag} className="text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded-full font-semibold mb-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">{selectedArticle.title}</h3>
                <p className="text-gray-400 mt-2">{selectedArticle.desc}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors flex-shrink-0"
                aria-label="关闭弹窗"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* 弹窗内容 - 使用flex-grow和overflow-auto确保自适应 */}
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="bg-gray-800/30 rounded-2xl p-5 mb-6">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-blue-400">📋</span> 详细拆解
                </h4>
                <div className="text-gray-300 whitespace-pre-line leading-relaxed text-sm md:text-base space-y-4">
                  {selectedArticle.details}
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-800/30 rounded-2xl p-5">
                <h4 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <span className="text-blue-400">🛡️</span> 防范要点
                </h4>
                <ul className="text-gray-300 space-y-2 text-sm md:text-base">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>不轻信任何陌生人的投资建议、情感诱导或紧急求助</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>任何涉及转账汇款的要求，务必通过多种独立方式核实对方身份</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>不点击不明链接，不下载非官方应用商店的APP</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>记住96110反诈专线，发现可疑立即报警并保存证据</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* 弹窗底部 - 修复后的布局 */}
            <div className="p-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 flex-shrink-0">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors w-full sm:w-auto"
              >
                关闭
              </button>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${selectedArticle.title}\n\n${selectedArticle.details?.substring(0, 200)}...`);
                    alert('已复制到剪贴板，可以分享给朋友了！');
                  }}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors flex-1 sm:flex-none"
                >
                  复制内容
                </button>
                <button
                  onClick={() => {
                    // 模拟分享功能
                    if (navigator.share) {
                      navigator.share({
                        title: selectedArticle.title,
                        text: selectedArticle.desc,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(`${window.location.origin}?article=${encodeURIComponent(selectedArticle.title)}`);
                      alert('链接已复制到剪贴板，可以分享给朋友了！');
                    }
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex-1 sm:flex-none"
                >
                  立即分享
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KnowledgeBase;