const bcrypt = require("bcryptjs");
const { PrismaClient, BillingCycle } = require("@prisma/client");

const prisma = new PrismaClient();

const SYSTEM_BOT_ID = "cm3fqhmhh000708job4qfgfpn";
const PRO_PLAN_ID = "cm3fq9f3c000208jo25xqesv2";
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
      roleId: ADMIN_ROLE_ID,
    },
  });
  console.log("Root User created or updated");

  await prisma.plan.createMany({
    data: [
      {
        name: "free",
        displayName: "Free",
        billingCycle: BillingCycle.UNLIMITED,
        description: "Free plan",
      },
      {
        id: PRO_PLAN_ID,
        name: "pro",
        displayName: "Pro",
        billingCycle: BillingCycle.YEARLY,
        description: "Pro plan",
      },
      {
        name: "enterprise",
        displayName: "Enterprise",
        billingCycle: BillingCycle.YEARLY,
        description: "Enterprise plan",
      },
    ],
  });
  console.log("Plans created");

  await prisma.workspace.create({
    data: {
      id: SYSTEM_WORKSPACE_ID,
      name: "cognova",
      displayName: "Cognova",
      ownerId: ROOT_USER_ID,
      planId: PRO_PLAN_ID,
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
  const model = await prisma.model.create({
    data: {
      name: "@cf/meta/llama-3-8b-instruct",
      displayName: "LLAMA-3-8b",
      planId: PRO_PLAN_ID,
    },
  });
  console.log("Model created");
  await prisma.bot.create({
    data: {
      id: SYSTEM_BOT_ID,
      name: "cognovas-assistant",
      workspaceId: SYSTEM_WORKSPACE_ID,
      modelId: model.id,
    },
  });
  console.log("Bot created");
  await prisma.technique.create({
    data: {
      name: "website",
      displayName: "Website",
      planId: "cm3fq9f3c000208jo25xqesv2",
    },
  });
  console.log("Web Technique created");
  prisma.$disconnect();
}

module.exports = {
  mainSeeder,
};
