// src/dialogues/officeWorkerDialogues.ts
import { DialogueNode } from '../types/dialogueTypes';

export const OFFICE_WORKER_DIALOGUE_TREE: Record<string, DialogueNode> = {
  start: {
    id: "start",
    victimText: "喂，你好？",
    options: [
      {
        id: "option1",
        text: "您好，我是XX证券的投资顾问，我们监测到您关注过我们的理财课程。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "stock_adviser"
      },
      {
        id: "option2",
        text: "您好，您在我们平台购买的商品有质量问题，需要给您办理退款。",
        trustChange: { min: 15, max: 25 },
        suspicionChange: { min: 8, max: 15 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "refund_scam"
      },
      {
        id: "option3",
        text: "李先生您好，我是银行信用卡中心的，您有一笔异常消费需要核实。",
        trustChange: { min: 20, max: 30 },
        suspicionChange: { min: 3, max: 8 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "credit_card"
      }
    ]
  },
  stock_adviser: {
    id: "stock_adviser",
    victimText: "投资顾问？我没联系过你们啊。",
    options: [
      {
        id: "option1",
        text: "我们是通过大数据分析找到的潜在客户。最近股市行情好，想带您把握机会。",
        trustChange: { min: 5, max: 15 },
        suspicionChange: { min: 5, max: 12 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "stock_opportunity"
      },
      {
        id: "option2",
        text: "您是不是关注过理财通APP？我们和它有合作，看到您最近在看理财产品。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 3, max: 8 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "stock_opportunity"
      }
    ]
  },
  stock_opportunity: {
    id: "stock_opportunity",
    victimText: "什么机会？现在股市风险大吧。",
    options: [
      {
        id: "option1",
        text: "我们有个内幕消息，某只股票下周要大涨。只需888元就能加入VIP群。",
        trustChange: { min: 0, max: 10 },
        suspicionChange: { min: 20, max: 35 },
        moneyPotential: { min: 888, max: 2000 },
        isAggressive: true,
        nextDialogueId: "vip_group"
      },
      {
        id: "option2",
        text: "我们有专业的分析师团队，可以给您免费做一次投资诊断。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "free_analysis"
      }
    ]
  },
  vip_group: {
    id: "vip_group",
    victimText: "内幕消息？靠谱吗？现在骗子太多了。",
    options: [
      {
        id: "option1",
        text: "我们上周推荐的股票涨了30%，有截图证明。可以先付一半体验一下。",
        trustChange: { min: 5, max: 15 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 444, max: 1000 },
        isAggressive: false,
        nextDialogueId: "half_payment"
      },
      {
        id: "option2",
        text: "不靠谱我退您双倍！这是正规投资公司，有营业执照的。",
        trustChange: { min: 0, max: 5 },
        suspicionChange: { min: 25, max: 40 },
        moneyPotential: { min: 888, max: 2000 },
        isAggressive: true,
        isFinal: true
      }
    ]
  },
  half_payment: {
    id: "half_payment",
    victimText: "行吧，我先付一半看看。如果消息不准怎么办？",
    options: [
      {
        id: "option1",
        text: "三天内没赚钱全额退款，而且送您一个月的VIP会员。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 444, max: 1000 },
        isAggressive: false,
        nextDialogueId: "upgrade_offer"
      }
    ]
  },
  upgrade_offer: {
    id: "upgrade_offer",
    victimText: "听着不错。那要是不准你真能退？",
    options: [
      {
        id: "option1",
        text: "当然，我们是正规公司。您先加我微信，我发公司资质给您看。",
        trustChange: { min: 15, max: 25 },
        suspicionChange: { min: 3, max: 8 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "long_term"
      }
    ]
  },
  long_term: {
    id: "long_term",
    victimText: "看了，公司挺正规的。那现在怎么操作？",
    options: [
      {
        id: "option1",
        text: "您先付444元，我拉您进群，今晚就有内部消息。",
        trustChange: { min: 5, max: 15 },
        suspicionChange: { min: 5, max: 15 },
        moneyPotential: { min: 444, max: 1000 },
        isAggressive: false,
        isFinal: true
      },
      {
        id: "option2",
        text: "您付全款888元，我额外送您价值2000元的理财课程。",
        trustChange: { min: 0, max: 10 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 888, max: 2000 },
        isAggressive: false,
        isFinal: true
      }
    ]
  }
};