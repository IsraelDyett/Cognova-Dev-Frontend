const bcrypt = require("bcryptjs");
const { PrismaClient, BillingCycle, SubscriptionStatus } = require("@prisma/client");

const prisma = new PrismaClient();

const SYSTEM_BOT_ID = "cm3fqhmhh000708job4qfgfpn";
const SELLER_BOT_ID = "cm3q1dw1b000208iehplyahyh";
const FREE_PLAN_ID = "cm3pmta2r000008k62n3e5wd9";
const BUSINESS_PLAN_ID = "cm3fq9f3c000208jo25xqesv2";
const ENTERPRISE_PLAN_ID = "cm3pmthg6000108k660lz073i";
const ADMIN_ROLE_ID = "cm3fqaet8000308jo9e4qbmrs";
const ROOT_USER_ID = "cm3fqf7or000608jo8n8i9clr";
const SYSTEM_WORKSPACE_ID = "cm3fqdyuj000508joe8jld6wd";

async function mainSeeder() {
  await prisma.role.create({
    data: {
      id: ADMIN_ROLE_ID,
      name: "admin",
      displayName: "Admin",
      permissions: {
        create: [
          {
            name: "manage_users",
            displayName: "Manage Users",
          },
        ],
      },
    },
  });
  console.log("Admin Role created or updated");

  await prisma.user.upsert({
    where: { email: "troy@cognova.io" },
    update: {},
    create: {
      id: ROOT_USER_ID,
      name: "Troy",
      email: "troy@cognova.io",
      password: await bcrypt.hash("123456", parseInt(process.env.SALT_ROUNDS)),
      emailVerified: true,
    },
  });
  console.log("Root User created or updated");

  await prisma.plan.createMany({
    data: [
      {
        id: FREE_PLAN_ID,
        name: "free",
        displayName: "Free",
        monthlyPrice: 0,
        annuallyPrice: 0,
        description: "Free plan",
      },
      {
        id: BUSINESS_PLAN_ID,
        name: "business",
        displayName: "Business",
        monthlyPrice: 5,
        annuallyPrice: 59,
        description: "Pro plan",
      },
      {
        id: ENTERPRISE_PLAN_ID,
        name: "enterprise",
        displayName: "Enterprise",
        monthlyPrice: 19,
        annuallyPrice: 219,
        description: "Enterprise plan",
      },
    ],
  });
  console.log("Plans created");

  const freePlanFeatures = [
    "1 WhatsApp Business Integration",
    "Basic AI Chatbot",
    "PDF & Website Data Import",
    "Basic Analytics Dashboard",
    "Email Support",
    "Website Chat Widget",
  ];
  const businessPlanFeatures = [
    "3 WhatsApp Business Integrations",
    "Advanced AI Chatbot",
    "PDF, Website & API Data Import",
    "Advanced Analytics & Reporting",
    "Priority Support",
    "Website Chat Widget + Whatsapp Chat Support",
    "Multi-language Support",
  ];
  const enterprisePlanFeatures = [
    "Unlimited WhatsApp Integrations",
    "Custom & Latest AI Chatbot",
    "Unlimited Data Sources",
    "Real-time Analytics & API Access",
    "24/7 Dedicated Support",
    "Website Chat Widget + Whatsapp Chat Support",
    "Multi-language Support",
  ];
  await prisma.planFeature
    .createMany({
      data: freePlanFeatures.map((fpFTitle) => {
        return {
          planId: FREE_PLAN_ID,
          title: fpFTitle,
        };
      }),
    })
    .then(() => console.log("Free Plan Features Created"));

  await prisma.planFeature
    .createMany({
      data: businessPlanFeatures.map((bpFTitle) => {
        return {
          planId: BUSINESS_PLAN_ID,
          title: bpFTitle,
        };
      }),
    })
    .then(() => console.log("Business Plan Features Created"));

  await prisma.planFeature
    .createMany({
      data: enterprisePlanFeatures.map((epFTitle) => {
        return {
          planId: ENTERPRISE_PLAN_ID,
          title: epFTitle,
        };
      }),
    })
    .then(() => console.log("Enterprise Plan Features Created"));

  const system_workspace = await prisma.workspace.create({
    data: {
      id: SYSTEM_WORKSPACE_ID,
      name: "cognova",
      displayName: "Cognova",
      ownerId: ROOT_USER_ID,
      subscription: {
        create: {
          planId: BUSINESS_PLAN_ID,
          status: SubscriptionStatus.ACTIVE,
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          billingCycle: BillingCycle.MONTHLY,
        },
      },
    },
  });
  console.log("Workspace created");

  await prisma.workspaceUser.create({
    data: {
      userId: ROOT_USER_ID,
      workspaceId: SYSTEM_WORKSPACE_ID,
    },
  });
  console.log("Workspace user created");
  const openaiAzureProvider = await prisma.aiProvider.create({
    data: {
      name: "openai-azure",
      displayName: "Openai Azure",
      apiKey: "sk-no-key-required",
      endpointUrl: "https://models.inference.ai.azure.com",
      provider: "openai",
      planId: BUSINESS_PLAN_ID,
    },
  });
  console.log("Openai Azure AI Provider Created");

  const cognovaProvider = await prisma.aiProvider.create({
    data: {
      name: "cognova",
      displayName: "Cognova",
      apiKey: "sk-no-key-required",
      endpointUrl: "https://generative.ai.cognova.io",
      provider: "cloudflare",
      planId: BUSINESS_PLAN_ID,
    },
  });
  console.log("Cognova AI Provider Created");

  const openaiProvider = await prisma.aiProvider.create({
    data: {
      name: "openai",
      displayName: "Openai",
      apiKey: "sk-no-key-required",
      endpointUrl: "https://api.openai.com/v1",
      provider: "openai",
      planId: BUSINESS_PLAN_ID,
    },
  });
  console.log("Openai Provider Created");

  const hermes2Model = await prisma.model.create({
    data: {
      name: "@hf/nousresearch/hermes-2-pro-mistral-7b",
      displayName: "HERMES 2 Pro Mistral 7b",
      aiProviderId: cognovaProvider.id,
      planId: FREE_PLAN_ID,
    },
  });
  console.log("HERMES 2 Pro Mistral 7b Model created");

  const llama3Model = await prisma.model.create({
    data: {
      name: "@cf/meta/llama-3-8b-instruct",
      displayName: "LLAMA-3-8b",
      aiProviderId: cognovaProvider.id,
      planId: FREE_PLAN_ID,
    },
  });
  console.log("LLAMA-3-8b Model created");

  const gpt4Model = await prisma.model.create({
    data: {
      name: "gpt-4o",
      displayName: "GPT-4",
      aiProviderId: openaiAzureProvider.id,
      planId: FREE_PLAN_ID,
    },
  });
  console.log("GPT-4 Model created");

  await prisma.bot.create({
    data: {
      id: SYSTEM_BOT_ID,
      name: "Cognova's Assistant",
      workspaceId: SYSTEM_WORKSPACE_ID,
      type: "KNOWLEDGE_BASE_ASSISTANT",
      modelId: llama3Model.id,
    },
  });
  await prisma.bot.create({
    data: {
      id: SELLER_BOT_ID,
      name: "KGL Shoes Assistant",
      workspaceId: SYSTEM_WORKSPACE_ID,
      type: "PRODUCTS_BUYER_ASSISTANT",
      modelId: gpt4Model.id,
      description: "Virtual sales assistant for Kigali Shoes",
      language: "en",
      systemMessage:
        "You are a friendly sales assistant for Kigali Shoes. Help customers find the perfect shoes and provide information about our products and services.",
      welcomeMessage:
        "Welcome to Kigali Shoes! How can I help you find your perfect pair of shoes today?",
      starterQuestions: [
        "What are your current promotions?",
        "Do you have any formal shoes for men?",
        "What's your return policy?",
        "Can you deliver to my location in Kigali?",
      ],
    },
  });
  await prisma.bot.create({
    data: {
      name: "Cognova's Whatsapp Assistant",
      workspaceId: SYSTEM_WORKSPACE_ID,
      waPhoneNumber: "+250729882416",
      type: "KNOWLEDGE_BASE_ASSISTANT",
      modelId: hermes2Model.id,
    },
  });
  console.log("Bots created");

  await prisma.technique.create({
    data: {
      name: "website",
      displayName: "Website",
      planId: FREE_PLAN_ID,
    },
  });
  console.log("Web Technique created");

  prisma.$disconnect();
  return {
    workspace: system_workspace,
    sellerBotId: SELLER_BOT_ID,
  };
}

module.exports = {
  mainSeeder,
};
