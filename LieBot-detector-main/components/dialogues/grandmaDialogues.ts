// src/dialogues/grandmaDialogues.ts
import { DialogueNode } from '../types/dialogueTypes';

export const GRANDMA_DIALOGUE_TREE: Record<string, DialogueNode> = {
  start: {
    id: "start",
    victimText: "喂，你好？请问是哪位？",
    options: [
      {
        id: "option1",
        text: "大妈您好！我是市医院体检中心的王医生，我们正在做老年人免费体检活动。",
        trustChange: { min: 15, max: 25 },
        suspicionChange: { min: 0, max: 3 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "doctor_intro"
      },
      {
        id: "option2",
        text: "妈！是我，您儿子！我手机丢了，用朋友电话打的。",
        trustChange: { min: 20, max: 35 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: true,
        nextDialogueId: "son_intro"
      },
      {
        id: "option3",
        text: "您好，我是社区养老服务站的，想了解一下您最近的健康状况。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 0, max: 2 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "community_intro"
      }
    ]
  },
  // 路线1: 健康体检 -> 补贴申请 -> 小额诈骗
  doctor_intro: {
    id: "doctor_intro",
    victimText: "哦哦，医生啊。什么体检活动？我上个月刚体检过。",
    options: [
      {
        id: "option1",
        text: "我们这次是专项检查，针对老年人常见的三高和心脑血管疾病，完全免费的。",
        trustChange: { min: 5, max: 15 },
        suspicionChange: { min: 0, max: 5 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "doctor_details"
      },
      {
        id: "option2",
        text: "大妈，您上次的体检报告我们看了，有几个指标不太正常，需要进一步检查。",
        trustChange: { min: 15, max: 25 },
        suspicionChange: { min: 8, max: 15 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: true,
        nextDialogueId: "urgent_test"
      }
    ]
  },
  doctor_details: {
    id: "doctor_details",
    victimText: "免费的？那需要我做什么？",
    options: [
      {
        id: "option1",
        text: "只需要您带上身份证，明天上午9点到市医院体检中心就行。我们这是公益活动。",
        trustChange: { min: 8, max: 15 },
        suspicionChange: { min: 0, max: 3 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "doctor_trust"
      },
      {
        id: "option2",
        text: "不过为了保证名额，需要您先交200元押金，体检完就退还。现在名额不多了。",
        trustChange: { min: 0, max: 8 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 200, max: 500 },
        isAggressive: true,
        nextDialogueId: "deposit_needed"
      }
    ]
  },
  doctor_trust: {
    id: "doctor_trust",
    victimText: "那太好了，我正好最近有点头晕，明天一定去。谢谢医生啊！",
    options: [
      {
        id: "option1",
        text: "不客气。对了大妈，我们还有一个老年人健康补贴申请，可以报销医药费。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 0, max: 3 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "subsidy_intro"
      },
      {
        id: "option2",
        text: "好的，明天见。对了，您最近有买过什么保健品吗？我们医院正在回收。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 2, max: 6 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "medicine_intro"
      }
    ]
  },
  subsidy_intro: {
    id: "subsidy_intro",
    victimText: "健康补贴？怎么申请啊？我每个月都要花不少钱买药。",
    options: [
      {
        id: "option1",
        text: "需要您先交300元材料费，我们帮您办手续，下个月开始每月有800元补贴。",
        trustChange: { min: 5, max: 12 },
        suspicionChange: { min: 15, max: 25 },
        moneyPotential: { min: 300, max: 500 },
        isAggressive: true,
        nextDialogueId: "subsidy_payment"
      },
      {
        id: "option2",
        text: "很简单，只需要提供身份证和银行卡号，我们直接办理，不收任何费用。",
        trustChange: { min: 15, max: 25 },
        suspicionChange: { min: 2, max: 8 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "subsidy_free"
      }
    ]
  },
  subsidy_free: {
    id: "subsidy_free",
    victimText: "真的吗？那太好了！需要我提供什么信息？",
    options: [
      {
        id: "option1",
        text: "您把身份证号、银行卡号和短信验证码发给我，我马上帮您办理。",
        trustChange: { min: -10, max: 0 },
        suspicionChange: { min: 30, max: 45 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: true,
        nextDialogueId: "verify_code"
      },
      {
        id: "option2",
        text: "这样吧，我加您微信，把申请表发给您，您填好拍照发给我就行。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 3, max: 8 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "wechat_contact"
      }
    ]
  },
  verify_code: {
    id: "verify_code",
    victimText: "验证码？我儿子说过不能把验证码给别人。",
    options: [
      {
        id: "option1",
        text: "大妈，这是必须的验证步骤。您不给我验证码，补贴就办不了。",
        trustChange: { min: -20, max: -5 },
        suspicionChange: { min: 40, max: 60 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: true,
        nextDialogueId: "verify_code_final"
      },
      {
        id: "option2",
        text: "那算了，您不用验证码，我帮您走其他渠道，不过要交500元手续费。",
        trustChange: { min: 0, max: 5 },
        suspicionChange: { min: 20, max: 30 },
        moneyPotential: { min: 500, max: 800 },
        isAggressive: false,
        nextDialogueId: "alternative_method"
      }
    ]
  },
  verify_code_final: {
    id: "verify_code_final",
    victimText: "那不行，我不能给你验证码。",
    options: [
      {
        id: "option1",
        text: "大妈，您这样我帮不了您了。再见。",
        trustChange: { min: -20, max: -10 },
        suspicionChange: { min: 20, max: 30 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  alternative_method: {
    id: "alternative_method",
    victimText: "还要手续费啊...那也行吧。怎么交钱？",
    options: [
      {
        id: "option1",
        text: "您微信转账给我就行，我备注好是手续费。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 500, max: 800 },
        isAggressive: false,
        nextDialogueId: "alternative_method_final"
      }
    ]
  },
  alternative_method_final: {
    id: "alternative_method_final",
    victimText: "好，我转给你。",
    options: [
      {
        id: "option1",
        text: "收到了，我会尽快帮您办理。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  wechat_contact: {
    id: "wechat_contact",
    victimText: "好好，我微信就是这个手机号。你加我吧。",
    options: [
      {
        id: "option1",
        text: "好的，我加您了。对了，申请这个补贴需要交500元保证金，三个月后退还。",
        trustChange: { min: 5, max: 12 },
        suspicionChange: { min: 15, max: 25 },
        moneyPotential: { min: 500, max: 800 },
        isAggressive: true,
        nextDialogueId: "final_payment"
      },
      {
        id: "option2",
        text: "已添加。我先把表发给您，明天体检时带过来，我现场帮您办理。",
        trustChange: { min: 15, max: 25 },
        suspicionChange: { min: 0, max: 5 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "form_fill"
      }
    ]
  },
  form_fill: {
    id: "form_fill",
    victimText: "谢谢你啊医生，你真热心。我明天一定带上表格。",
    options: [
      {
        id: "option1",
        text: "不客气。对了大妈，我们还有个老年人健康基金，可以一次性领2000元营养费。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "health_fund"
      },
      {
        id: "option2",
        text: "好，明天见。对了，您明天最好带上医保卡，可以顺便开点药。",
        trustChange: { min: 8, max: 15 },
        suspicionChange: { min: 0, max: 3 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "form_fill_final"
      }
    ]
  },
  form_fill_final: {
    id: "form_fill_final",
    victimText: "好，一定带上。",
    options: [
      {
        id: "option1",
        text: "那明天见，大妈。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 0, max: 3 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  health_fund: {
    id: "health_fund",
    victimText: "健康基金？这个怎么申请？也需要什么条件吗？",
    options: [
      {
        id: "option1",
        text: "需要您交1000元注册费，之后每月都能领800元补贴，很划算的。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 20, max: 30 },
        moneyPotential: { min: 1000, max: 1500 },
        isAggressive: true,
        nextDialogueId: "fund_registration"
      },
      {
        id: "option2",
        text: "很简单，只需要填个表，我们帮您申请，不收费的。",
        trustChange: { min: 12, max: 20 },
        suspicionChange: { min: 3, max: 8 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "free_fund"
      }
    ]
  },
  free_fund: {
    id: "free_fund",
    victimText: "这么好？不会是什么骗子吧？",
    options: [
      {
        id: "option1",
        text: "大妈，我们是正规医院，这是政府的惠民工程，您放心。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "government_project"
      },
      {
        id: "option2",
        text: "那算了，我再问问别人。现在名额可紧张了。",
        trustChange: { min: -5, max: 0 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "free_fund_final"
      }
    ]
  },
  free_fund_final: {
    id: "free_fund_final",
    victimText: "我还是再考虑考虑吧。",
    options: [
      {
        id: "option1",
        text: "好吧，那您考虑好了再联系我。",
        trustChange: { min: 0, max: 5 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  government_project: {
    id: "government_project",
    victimText: "政府的工程？那应该靠谱。需要我做什么？",
    options: [
      {
        id: "option1",
        text: "您准备身份证复印件，我明天带合同来您家，现场办理。",
        trustChange: { min: 15, max: 25 },
        suspicionChange: { min: 0, max: 5 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "home_visit"
      },
      {
        id: "option2",
        text: "需要您交500元档案管理费，我们把您资料录入系统。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 15, max: 25 },
        moneyPotential: { min: 500, max: 800 },
        isAggressive: true,
        nextDialogueId: "archive_fee"
      }
    ]
  },
  home_visit: {
    id: "home_visit",
    victimText: "还要来家里啊？我家里有点乱...",
    options: [
      {
        id: "option1",
        text: "没事的大妈，我们就坐一会儿。对了，您家里有现金吗？办手续需要押金。",
        trustChange: { min: 5, max: 12 },
        suspicionChange: { min: 20, max: 35 },
        moneyPotential: { min: 2000, max: 3000 },
        isAggressive: true,
        nextDialogueId: "cash_needed"
      },
      {
        id: "option2",
        text: "那您来医院也行，我帮您留个名额。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 2, max: 6 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "hospital_visit"
      }
    ]
  },
  hospital_visit: {
    id: "hospital_visit",
    victimText: "好，那我明天去医院。",
    options: [
      {
        id: "option1",
        text: "好的，我明天在医院等您。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 0, max: 3 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  cash_needed: {
    id: "cash_needed",
    victimText: "还要押金啊？要多少？我手里现金不多。",
    options: [
      {
        id: "option1",
        text: "3000元就行，办好手续就退。这是规定，我也没办法。",
        trustChange: { min: 0, max: 8 },
        suspicionChange: { min: 25, max: 40 },
        moneyPotential: { min: 3000, max: 5000 },
        isAggressive: true,
        nextDialogueId: "cash_needed_final"
      },
      {
        id: "option2",
        text: "那您有多少先交多少，我帮您垫一部分。",
        trustChange: { min: 8, max: 15 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 1000, max: 2000 },
        isAggressive: false,
        nextDialogueId: "partial_payment"
      }
    ]
  },
  cash_needed_final: {
    id: "cash_needed_final",
    victimText: "3000元...我考虑一下。",
    options: [
      {
        id: "option1",
        text: "好的大妈，您想好了联系我。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  partial_payment: {
    id: "partial_payment",
    victimText: "我先给你2000元，剩下的你帮我垫上。",
    options: [
      {
        id: "option1",
        text: "行，我帮您垫1000元。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  subsidy_payment: {
    id: "subsidy_payment",
    victimText: "300元材料费啊...能微信转账吗？",
    options: [
      {
        id: "option1",
        text: "可以，您加我微信，我发您收款码。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 300, max: 500 },
        isAggressive: false,
        nextDialogueId: "subsidy_payment_final"
      }
    ]
  },
  subsidy_payment_final: {
    id: "subsidy_payment_final",
    victimText: "好，我马上转。",
    options: [
      {
        id: "option1",
        text: "收到了，我会尽快帮您办理。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  final_payment: {
    id: "final_payment",
    victimText: "还要交保证金啊...不过有补贴的话也划算。怎么交钱？",
    options: [
      {
        id: "option1",
        text: "直接微信转账给我就行，我备注好是保证金。",
        trustChange: { min: 0, max: 10 },
        suspicionChange: { min: 30, max: 50 },
        moneyPotential: { min: 500, max: 800 },
        isAggressive: true,
        nextDialogueId: "final_payment1"
      },
      {
        id: "option2",
        text: "您到银行存到这个指定账户，存好后把凭条拍给我就行。",
        trustChange: { min: 5, max: 15 },
        suspicionChange: { min: 20, max: 40 },
        moneyPotential: { min: 500, max: 800 },
        isAggressive: false,
        nextDialogueId: "final_payment2"
      }
    ]
  },
  final_payment1: {
    id: "final_payment1",
    victimText: "好，我转给你。",
    options: [
      {
        id: "option1",
        text: "收到了，保证金会按时退还的。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  final_payment2: {
    id: "final_payment2",
    victimText: "我明天去银行存。",
    options: [
      {
        id: "option1",
        text: "好的，存好了发给我凭条。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  deposit_needed: {
    id: "deposit_needed",
    victimText: "还要交押金啊...不会是什么骗子吧？",
    options: [
      {
        id: "option1",
        text: "大妈，我们是正规医院，您看这是我的工作证照片。押金是怕您不来浪费名额。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 5, max: 15 },
        moneyPotential: { min: 200, max: 500 },
        isAggressive: false,
        nextDialogueId: "show_proof"
      },
      {
        id: "option2",
        text: "那算了，我再问问别人。现在名额可紧张了，很多人排队呢。",
        trustChange: { min: -10, max: 0 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "deposit_needed_final"
      }
    ]
  },
  deposit_needed_final: {
    id: "deposit_needed_final",
    victimText: "我还是不参加了。",
    options: [
      {
        id: "option1",
        text: "好吧，那您错过好机会了。",
        trustChange: { min: -5, max: 0 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  show_proof: {
    id: "show_proof",
    victimText: "哦哦，是王医生啊。行，我相信你。怎么交钱？",
    options: [
      {
        id: "option1",
        text: "您加我微信，我给您发收款码，备注写上体检押金。",
        trustChange: { min: 5, max: 15 },
        suspicionChange: { min: 5, max: 15 },
        moneyPotential: { min: 200, max: 500 },
        isAggressive: false,
        nextDialogueId: "show_proof_final"
      }
    ]
  },
  show_proof_final: {
    id: "show_proof_final",
    victimText: "好，我加你。",
    options: [
      {
        id: "option1",
        text: "收到了，明天体检见。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 0, max: 5 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  urgent_test: {
    id: "urgent_test",
    victimText: "指标不正常？严重吗？我最近确实有点头晕。",
    options: [
      {
        id: "option1",
        text: "不算太严重，但建议您做更详细的检查。我们这周有名医坐诊，挂号费300元。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 300, max: 500 },
        isAggressive: false,
        nextDialogueId: "expert_consultation"
      },
      {
        id: "option2",
        text: "我们有个专家会诊，但需要交500元会诊费，很紧急。",
        trustChange: { min: 5, max: 15 },
        suspicionChange: { min: 20, max: 30 },
        moneyPotential: { min: 500, max: 800 },
        isAggressive: true,
        nextDialogueId: "urgent_consultation"
      }
    ]
  },
  expert_consultation: {
    id: "expert_consultation",
    victimText: "300元挂号费？能报销吗？",
    options: [
      {
        id: "option1",
        text: "可以，您交完费我给您开发票，医保能报一部分。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 300, max: 500 },
        isAggressive: false,
        nextDialogueId: "expert_consultation_final"
      }
    ]
  },
  expert_consultation_final: {
    id: "expert_consultation_final",
    victimText: "好，我明天来交费。",
    options: [
      {
        id: "option1",
        text: "好的，我帮您预约。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 0, max: 5 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  urgent_consultation: {
    id: "urgent_consultation",
    victimText: "500元会诊费...那我明天来医院交行吗？",
    options: [
      {
        id: "option1",
        text: "不行啊大妈，现在就要交，不然专家排不上号。",
        trustChange: { min: 0, max: 5 },
        suspicionChange: { min: 20, max: 30 },
        moneyPotential: { min: 500, max: 800 },
        isAggressive: true,
        nextDialogueId: "urgent_consultation_final"
      }
    ]
  },
  urgent_consultation_final: {
    id: "urgent_consultation_final",
    victimText: "这么急啊...那我现在转给你。",
    options: [
      {
        id: "option1",
        text: "好的，我帮您安排。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  medicine_intro: {
    id: "medicine_intro",
    victimText: "保健品？我买过很多，有什么问题吗？",
    options: [
      {
        id: "option1",
        text: "有些保健品质量不合格，我们医院在回收检测。您把买的都带来，我们免费检测。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 3, max: 8 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "medicine_test"
      }
    ]
  },
  medicine_test: {
    id: "medicine_test",
    victimText: "免费检测？那太好了，我正好不放心那些保健品。",
    options: [
      {
        id: "option1",
        text: "嗯，检测完还能退钱。不过要交200元检测费，退钱时一起退。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 200, max: 300 },
        isAggressive: false,
        nextDialogueId: "medicine_test_final"
      }
    ]
  },
  medicine_test_final: {
    id: "medicine_test_final",
    victimText: "200元检测费...能便宜点吗？",
    options: [
      {
        id: "option1",
        text: "大妈，这是最低标准了。",
        trustChange: { min: 0, max: 5 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  fund_registration: {
    id: "fund_registration",
    victimText: "1000元注册费...这个靠谱吗？",
    options: [
      {
        id: "option1",
        text: "大妈，我们是正规医院，您还不放心吗？交了费马上就能领补贴。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 15, max: 25 },
        moneyPotential: { min: 1000, max: 1500 },
        isAggressive: false,
        nextDialogueId: "fund_registration_final"
      }
    ]
  },
  fund_registration_final: {
    id: "fund_registration_final",
    victimText: "好吧，我交。",
    options: [
      {
        id: "option1",
        text: "好的，我帮您办理。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  archive_fee: {
    id: "archive_fee",
    victimText: "500元管理费...能便宜点吗？",
    options: [
      {
        id: "option1",
        text: "大妈，这是统一标准，我也没办法。交了费马上给您办。",
        trustChange: { min: 3, max: 8 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 500, max: 800 },
        isAggressive: false,
        nextDialogueId: "archive_fee_final"
      }
    ]
  },
  archive_fee_final: {
    id: "archive_fee_final",
    victimText: "好吧，我交。",
    options: [
      {
        id: "option1",
        text: "好的，马上帮您办理。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  // 路线2: 冒充子女 -> 紧急用钱 -> 中等诈骗
  son_intro: {
    id: "son_intro",
    victimText: "儿子？真的是你吗？声音怎么有点不一样？",
    options: [
      {
        id: "option1",
        text: "妈，我感冒了嗓子哑。我在外地出差，钱包手机都丢了。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 8, max: 15 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: true,
        nextDialogueId: "son_emergency"
      },
      {
        id: "option2",
        text: "妈，我用了变声软件，手机被监听不安全。我现在借朋友电话打的。",
        trustChange: { min: 15, max: 25 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "son_secret"
      }
    ]
  },
  son_emergency: {
    id: "son_emergency",
    victimText: "啊？都丢了？那你现在在哪？吃饭了吗？",
    options: [
      {
        id: "option1",
        text: "我在火车站，还没吃饭。妈，您能先给我打2000元吗？我买票回家。",
        trustChange: { min: 5, max: 12 },
        suspicionChange: { min: 15, max: 25 },
        moneyPotential: { min: 2000, max: 3000 },
        isAggressive: true,
        nextDialogueId: "son_money1"
      },
      {
        id: "option2",
        text: "我在朋友家，暂时有地方住。就是想您了，跟您报个平安。",
        trustChange: { min: 20, max: 30 },
        suspicionChange: { min: 2, max: 6 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "son_safe"
      }
    ]
  },
  son_safe: {
    id: "son_safe",
    victimText: "平安就好，平安就好。你什么时候回来？",
    options: [
      {
        id: "option1",
        text: "过几天就回。妈，我这边有个投资项目急用钱，您能借我5万吗？",
        trustChange: { min: 0, max: 8 },
        suspicionChange: { min: 25, max: 40 },
        moneyPotential: { min: 5000, max: 8000 },
        isAggressive: true,
        nextDialogueId: "son_investment"
      },
      {
        id: "option2",
        text: "下周就回。对了妈，您身体还好吗？降压药按时吃了吗？",
        trustChange: { min: 15, max: 25 },
        suspicionChange: { min: 0, max: 3 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "son_care"
      }
    ]
  },
  son_care: {
    id: "son_care",
    victimText: "吃着呢，你不用担心我。你自己在外面注意安全。",
    options: [
      {
        id: "option1",
        text: "妈，我在外面认识了个领导，他有个内部投资机会，回报率很高。",
        trustChange: { min: 8, max: 15 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "son_opportunity"
      },
      {
        id: "option2",
        text: "嗯，我会注意的。妈，我先挂了，朋友在叫我。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 0, max: 5 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "son_care_final"
      }
    ]
  },
  son_care_final: {
    id: "son_care_final",
    victimText: "好，你去忙吧。",
    options: [
      {
        id: "option1",
        text: "妈，我挂了，您保重。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 0, max: 3 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  son_opportunity: {
    id: "son_opportunity",
    victimText: "投资？你可别乱投资，现在骗子多。",
    options: [
      {
        id: "option1",
        text: "这个很靠谱，是政府项目。妈，您把定期存款取出来，投10万就行。",
        trustChange: { min: 0, max: 5 },
        suspicionChange: { min: 20, max: 35 },
        moneyPotential: { min: 10000, max: 15000 },
        isAggressive: true,
        nextDialogueId: "son_big_invest"
      },
      {
        id: "option2",
        text: "我知道，我就是先问问您意见。您觉得不好我就不投了。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 3, max: 8 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "son_listen"
      }
    ]
  },
  son_listen: {
    id: "son_listen",
    victimText: "这才对，听妈的话，别乱投资。你什么时候回来？",
    options: [
      {
        id: "option1",
        text: "妈，其实我遇到了点麻烦，需要2万块应急。您能帮帮我吗？",
        trustChange: { min: 5, max: 12 },
        suspicionChange: { min: 15, max: 25 },
        moneyPotential: { min: 2000, max: 3000 },
        isAggressive: true,
        nextDialogueId: "son_trouble"
      },
      {
        id: "option2",
        text: "下周就回。妈，我先挂了，到单位了。",
        trustChange: { min: 8, max: 15 },
        suspicionChange: { min: 0, max: 3 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "son_listen_final"
      }
    ]
  },
  son_listen_final: {
    id: "son_listen_final",
    victimText: "好，路上小心。",
    options: [
      {
        id: "option1",
        text: "知道了妈，再见。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 0, max: 3 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  son_trouble: {
    id: "son_trouble",
    victimText: "什么麻烦？你是不是在外面欠钱了？",
    options: [
      {
        id: "option1",
        text: "妈，我开车撞了人，对方要5万私了，不然就报警。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 20, max: 35 },
        moneyPotential: { min: 5000, max: 8000 },
        isAggressive: true,
        nextDialogueId: "son_accident"
      },
      {
        id: "option2",
        text: "工作上有点麻烦，需要打点关系。妈，您能借我3万吗？",
        trustChange: { min: 8, max: 15 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 3000, max: 5000 },
        isAggressive: false,
        nextDialogueId: "son_work"
      }
    ]
  },
  son_accident: {
    id: "son_accident",
    victimText: "撞人了？严重吗？报警了没？",
    options: [
      {
        id: "option1",
        text: "不严重，私了就行。妈，您把银行卡密码告诉我，我让朋友去取。",
        trustChange: { min: -10, max: 0 },
        suspicionChange: { min: 40, max: 60 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: true,
        nextDialogueId: "son_accident_final1"
      },
      {
        id: "option2",
        text: "还没报警，对方要10万。妈，您有多少先给我，我再去借点。",
        trustChange: { min: 0, max: 8 },
        suspicionChange: { min: 25, max: 40 },
        moneyPotential: { min: 10000, max: 15000 },
        isAggressive: true,
        nextDialogueId: "son_accident_final2"
      }
    ]
  },
  son_accident_final1: {
    id: "son_accident_final1",
    victimText: "密码？不行，我不能告诉你密码。",
    options: [
      {
        id: "option1",
        text: "妈，您不帮我我就完了！",
        trustChange: { min: -20, max: -10 },
        suspicionChange: { min: 20, max: 30 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: true,
        isFinal: true
      }
    ]
  },
  son_accident_final2: {
    id: "son_accident_final2",
    victimText: "10万？我哪有那么多钱！",
    options: [
      {
        id: "option1",
        text: "妈，您有多少先给我！",
        trustChange: { min: -10, max: 0 },
        suspicionChange: { min: 20, max: 30 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: true,
        isFinal: true
      }
    ]
  },
  son_work: {
    id: "son_work",
    victimText: "工作上的事啊...要这么多钱？",
    options: [
      {
        id: "option1",
        text: "妈，这个领导很重要，关系到我的前途。您把存折给我，我自己去取。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 20, max: 35 },
        moneyPotential: { min: 30000, max: 50000 },
        isAggressive: true,
        nextDialogueId: "son_work_final1"
      },
      {
        id: "option2",
        text: "那算了，我再想想别的办法。妈，您别担心。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "son_work_final2"
      }
    ]
  },
  son_work_final1: {
    id: "son_work_final1",
    victimText: "存折？不行，我不能给你存折。",
    options: [
      {
        id: "option1",
        text: "妈，您不相信我吗？",
        trustChange: { min: -10, max: 0 },
        suspicionChange: { min: 20, max: 30 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  son_work_final2: {
    id: "son_work_final2",
    victimText: "你自己小心点，别惹麻烦。",
    options: [
      {
        id: "option1",
        text: "知道了妈，再见。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 0, max: 5 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        isFinal: true
      }
    ]
  },
  son_money1: {
    id: "son_money1",
    victimText: "2000元？我微信里没那么多钱，得去银行取。",
    options: [
      {
        id: "option1",
        text: "妈，您先把微信里的钱都转给我，我买张票先离开这里。",
        trustChange: { min: 0, max: 5 },
        suspicionChange: { min: 20, max: 30 },
        moneyPotential: { min: 1000, max: 2000 },
        isAggressive: true,
        nextDialogueId: "son_money2"
      }
    ]
  },
  son_money2: {
    id: "son_money2",
    victimText: "好好，我马上转。你什么时候能到家？",
    options: [
      {
        id: "option1",
        text: "明天就到。妈，我还需要点钱住旅馆，您再给我转1000。",
        trustChange: { min: 0, max: 5 },
        suspicionChange: { min: 15, max: 25 },
        moneyPotential: { min: 1000, max: 1500 },
        isAggressive: true,
        nextDialogueId: "son_money2_final"
      }
    ]
  },
  son_money2_final: {
    id: "son_money2_final",
    victimText: "还要1000？我微信里没那么多钱了。",
    options: [
      {
        id: "option1",
        text: "妈，您有多少先给我！",
        trustChange: { min: -5, max: 0 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: true,
        isFinal: true
      }
    ]
  },
  son_investment: {
    id: "son_investment",
    victimText: "5万？这么多！我手里没那么多现金。",
    options: [
      {
        id: "option1",
        text: "妈，您把定期存款取出来，这个项目很急，错过了就没了。",
        trustChange: { min: 0, max: 5 },
        suspicionChange: { min: 20, max: 30 },
        moneyPotential: { min: 5000, max: 8000 },
        isAggressive: true,
        nextDialogueId: "son_investment2"
      }
    ]
  },
  son_investment2: {
    id: "son_investment2",
    victimText: "取定期要明天才行，今天银行关门了。",
    options: [
      {
        id: "option1",
        text: "那您先把活期的都给我，我这边急用。",
        trustChange: { min: 0, max: 5 },
        suspicionChange: { min: 15, max: 25 },
        moneyPotential: { min: 3000, max: 5000 },
        isAggressive: true,
        nextDialogueId: "son_investment2_final"
      }
    ]
  },
  son_investment2_final: {
    id: "son_investment2_final",
    victimText: "我活期里只有1万。",
    options: [
      {
        id: "option1",
        text: "1万也行，先给我！",
        trustChange: { min: 0, max: 5 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: true,
        isFinal: true
      }
    ]
  },
  son_big_invest: {
    id: "son_big_invest",
    victimText: "10万？这可是我养老的钱啊！",
    options: [
      {
        id: "option1",
        text: "妈，这个项目稳赚不赔，三个月就能翻倍。您相信我。",
        trustChange: { min: 0, max: 5 },
        suspicionChange: { min: 25, max: 40 },
        moneyPotential: { min: 10000, max: 15000 },
        isAggressive: true,
        nextDialogueId: "son_big_invest2"
      }
    ]
  },
  son_big_invest2: {
    id: "son_big_invest2",
    victimText: "三个月翻倍？真的假的？",
    options: [
      {
        id: "option1",
        text: "真的，我朋友都投了。您把存折密码告诉我，我帮您操作。",
        trustChange: { min: -10, max: 0 },
        suspicionChange: { min: 30, max: 50 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: true,
        nextDialogueId: "son_big_invest2_final"
      }
    ]
  },
  son_big_invest2_final: {
    id: "son_big_invest2_final",
    victimText: "密码？不行，我不能告诉你。",
    options: [
      {
        id: "option1",
        text: "妈，您不相信我吗？",
        trustChange: { min: -20, max: -10 },
        suspicionChange: { min: 20, max: 30 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: true,
        isFinal: true
      }
    ]
  },
  son_secret: {
    id: "son_secret",
    victimText: "被监听？怎么回事？你在外面惹什么事了？",
    options: [
      {
        id: "option1",
        text: "工作上的机密，不方便说。妈，您能给我打5000元吗？我需要换个手机。",
        trustChange: { min: 5, max: 12 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 5000, max: 8000 },
        isAggressive: true,
        nextDialogueId: "son_secret2"
      }
    ]
  },
  son_secret2: {
    id: "son_secret2",
    victimText: "5000元？换个手机要这么多？",
    options: [
      {
        id: "option1",
        text: "还要办新卡，买加密软件。妈，这事很急，您先转给我。",
        trustChange: { min: 0, max: 8 },
        suspicionChange: { min: 15, max: 25 },
        moneyPotential: { min: 5000, max: 8000 },
        isAggressive: true,
        nextDialogueId: "son_secret2_final"
      }
    ]
  },
  son_secret2_final: {
    id: "son_secret2_final",
    victimText: "我手里没那么多现金。",
    options: [
      {
        id: "option1",
        text: "妈，您有多少先给我！",
        trustChange: { min: -5, max: 0 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: true,
        isFinal: true
      }
    ]
  },
  // 路线3: 社区服务 -> 长期关怀 -> 大额诈骗
  community_intro: {
    id: "community_intro",
    victimText: "社区服务站的？有什么事吗？",
    options: [
      {
        id: "option1",
        text: "我们正在做老年人健康档案登记，想了解一下您的基本情况。",
        trustChange: { min: 8, max: 15 },
        suspicionChange: { min: 0, max: 3 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "community_survey"
      },
      {
        id: "option2",
        text: "我们发现您符合特殊老年人补贴条件，每月可以多领800元。",
        trustChange: { min: 12, max: 20 },
        suspicionChange: { min: 5, max: 10 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "community_subsidy"
      }
    ]
  },
  community_survey: {
    id: "community_survey",
    victimText: "健康档案啊，我之前登记过。",
    options: [
      {
        id: "option1",
        text: "这次是更新信息。对了大妈，您有没有购买商业养老保险？",
        trustChange: { min: 5, max: 12 },
        suspicionChange: { min: 2, max: 6 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "community_insurance"
      },
      {
        id: "option2",
        text: "我们还有免费的健康讲座，参加就送一桶油。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 0, max: 3 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "community_lecture"
      }
    ]
  },
  community_insurance: {
    id: "community_insurance",
    victimText: "没有买，就靠退休金和医保。",
    options: [
      {
        id: "option1",
        text: "我们社区有个内部保险项目，年化收益8%，特别适合老年人。",
        trustChange: { min: 8, max: 15 },
        suspicionChange: { min: 8, max: 15 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "community_invest"
      },
      {
        id: "option2",
        text: "那您要注意健康啊。我们定期有免费体检，您来参加吧。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 0, max: 2 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "community_checkup"
      }
    ]
  },
  community_invest: {
    id: "community_invest",
    victimText: "8%的收益？这么高？靠谱吗？",
    options: [
      {
        id: "option1",
        text: "这是政府扶持项目，最低投资5万，我帮您留个名额。",
        trustChange: { min: 5, max: 12 },
        suspicionChange: { min: 15, max: 25 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: true,
        nextDialogueId: "community_big_invest"
      },
      {
        id: "option2",
        text: "很靠谱，已经有很多老人参加了。您先投1万试试？",
        trustChange: { min: 8, max: 15 },
        suspicionChange: { min: 8, max: 15 },
        moneyPotential: { min: 10000, max: 15000 },
        isAggressive: false,
        nextDialogueId: "community_small_invest"
      }
    ]
  },
  community_big_invest: {
    id: "community_big_invest",
    victimText: "5万...我考虑考虑。",
    options: [
      {
        id: "option1",
        text: "大妈，这个月底就截止了。这样吧，您先交5000元定金，我帮您占位。",
        trustChange: { min: 3, max: 8 },
        suspicionChange: { min: 20, max: 35 },
        moneyPotential: { min: 5000, max: 8000 },
        isAggressive: true,
        nextDialogueId: "community_deposit"
      },
      {
        id: "option2",
        text: "好的，您慢慢考虑。对了，我们还有个免费的健康管理服务。",
        trustChange: { min: 10, max: 20 },
        suspicionChange: { min: 3, max: 8 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "community_health"
      }
    ]
  },
  community_health: {
    id: "community_health",
    victimText: "健康管理？具体是什么？",
    options: [
      {
        id: "option1",
        text: "就是定期上门给您做检查，教您养生知识。一年服务费只要3000元。",
        trustChange: { min: 5, max: 12 },
        suspicionChange: { min: 10, max: 20 },
        moneyPotential: { min: 3000, max: 5000 },
        isAggressive: false,
        nextDialogueId: "community_service"
      },
      {
        id: "option2",
        text: "完全免费的，政府出钱。就是想了解一下您的需求。",
        trustChange: { min: 12, max: 20 },
        suspicionChange: { min: 0, max: 3 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false,
        nextDialogueId: "community_free"
      }
    ]
  },
  community_free: {
    id: "community_free",
    victimText: "免费的啊，那挺好的。",
    options: [
      {
        id: "option1",
        text: "大妈，其实我有个内部消息，有个养老地产项目，投资20万，三年翻倍。",
        trustChange: { min: 5, max: 10 },
        suspicionChange: { min: 20, max: 35 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: true,
        nextDialogueId: "community_real_estate"
      },
      {
        id: "option2",
        text: "那您下周三来社区参加活动吧，我给您登记。",
        trustChange: { min: 8, max: 15 },
        suspicionChange: { min: 0, max: 2 },
        moneyPotential: { min: 0, max: 0 },
        isAggressive: false
      }
    ]
  }
};