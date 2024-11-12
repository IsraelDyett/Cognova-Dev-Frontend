const bcrypt = require("bcryptjs");
const { ChatFeedback } = require("@prisma/client");
const { PrismaClient, BillingCycle } = require("@prisma/client");

const prisma = new PrismaClient();

async function mainSeeder() {
  const adminRole = await prisma.role.create({
    data: {
      id: "0d021a35-57f1-4c4d-9dd6-d02d954ad2fc",
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

  const rootUser = await prisma.user.upsert({
    where: { email: "admin@cognova.io" },
    update: {},
    create: {
      name: "Troy",
      email: "troy@cognova.io",
      password: await bcrypt.hash("123456", parseInt(process.env.SALT_ROUNDS)),
      emailVerified: true,
      roleId: adminRole.id,
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
        id: "59bf2524-ce48-4b3b-a990-5ac9c7a7b5fe",
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

  const workspace = await prisma.workspace.create({
    data: {
      name: "cognova",
      displayName: "Cognova",
      ownerId: rootUser.id,
      planId: "59bf2524-ce48-4b3b-a990-5ac9c7a7b5fe",
    },
  });
  console.log("Workspace created");

  await prisma.workspaceUser.create({
    data: {
      userId: rootUser.id,
      workspaceId: workspace.id,
    },
  });
  const model = await prisma.model.create({
    data: {
      name: "@cf/meta/llama-3-8b-instruct",
      displayName: "LLAMA-3-8b",
      planId: "59bf2524-ce48-4b3b-a990-5ac9c7a7b5fe",
    },
  });
  const bot = await prisma.bot.create({
    data: {
      name: "cognovas-assistant",
      workspaceId: workspace.id,
      modelId: model.id,
    },
  });
  const technique = await prisma.technique.create({
    data: {
      name: "website",
      displayName: "Website",
      planId: "59bf2524-ce48-4b3b-a990-5ac9c7a7b5fe",
    },
  });
  prisma.$disconnect();
}

module.exports = {
  mainSeeder,
};
