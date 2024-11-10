const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function businessSeeder() {
  await prisma.operatingHours.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.location.deleteMany();
  await prisma.businessConfig.deleteMany();
  await prisma.bot.deleteMany();
  await prisma.business.deleteMany();
  await prisma.workspace.deleteMany();

  const rootUser = await prisma.user.upsert({
    where: { email: "admin@cognova.io" },
    update: {},
    create: {
      name: "Seller",
      email: "seller@cognova.io",
      password: await bcrypt.hash("123456", parseInt(process.env.SALT_ROUNDS)),
      emailVerified: true,
      roleId: "0d021a35-57f1-4c4d-9dd6-d02d954ad2fc",
    },
  });
  const workspace = await prisma.workspace.create({
    data: {
      name: "rwanda-foot-wear-ltd",
      displayName: "Rwanda Footwear Ltd",
      ownerId: rootUser.id,
      planId: "59bf2524-ce48-4b3b-a990-5ac9c7a7b5fe",
    },
  });

  const business = await prisma.business.create({
    data: {
      workspaceId: workspace.id,
      name: "Kigali Shoes & More",
      type: "Footwear Retail",
      description:
        "Premium footwear retailer in Rwanda offering local and international shoe brands",
      hasDelivery: true,
      hasPickup: true,
      acceptsReturns: true,
      hasWarranty: true,
    },
  });

  const businessConfig = await prisma.businessConfig.create({
    data: {
      businessId: business.id,
      deliveryFee: 2000, // 2000 RWF
      minOrderAmount: 10000, // 10000 RWF
      taxRate: 18, // 18% VAT in Rwanda
      returnPeriodDays: 14,
      warrantyPeriodDays: 90,
      currency: "RWF",
    },
  });

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        businessId: business.id,
        name: "Men's Shoes",
        description: "Footwear for men including formal, casual, and sports shoes",
      },
    }),
    prisma.category.create({
      data: {
        businessId: business.id,
        name: "Women's Shoes",
        description: "Footwear for women including heels, flats, and sports shoes",
      },
    }),
    prisma.category.create({
      data: {
        businessId: business.id,
        name: "Children's Shoes",
        description: "Footwear for kids of all ages",
      },
    }),
  ]);

  const products = await Promise.all([
    prisma.product.create({
      data: {
        businessId: business.id,
        categoryId: categories[0].id,
        name: "Classic Leather Office Shoes",
        description: "Handcrafted leather office shoes, perfect for formal occasions",
        price: 45000, // 45,000 RWF
        stock: 25,
        sku: "MENS-LEATHER-001",
        images: ["/placeholder/shoes/mens-leather-001.jpg"],
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        businessId: business.id,
        categoryId: categories[0].id,
        name: "Adidas Yeezy 700 V3 Azael",
        description:
          "After the success of the first two versions, Adidas and Kanye reveal the Yeezy 700 V3 with an important evolution in terms of design !",
        price: 25000,
        stock: 40,
        sku: "YEEZY-700-V#-001",
        images: [
          "https://cdn.shopify.com/s/files/1/2358/2817/products/yeezy-700-v3-azael-583213.png?v=1638814800&width=750",
        ],
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        businessId: business.id,
        categoryId: categories[1].id,
        name: "Elegant Evening Heels",
        description: "Stylish heels perfect for special occasions",
        price: 40000,
        stock: 20,
        sku: "WOMENS-HEEL-001",
        images: ["/placeholder/shoes/womens-heel-001.jpg"],
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        businessId: business.id,
        categoryId: categories[2].id,
        name: "Kids Sport Shoes",
        description: "Durable and comfortable sports shoes for children",
        price: 25000,
        stock: 40,
        sku: "KIDS-SPORT-001",
        images: ["/placeholder/shoes/kids-sport-001.jpg"],
        isActive: true,
      },
    }),
  ]);

  const locations = await Promise.all([
    prisma.location.create({
      data: {
        businessId: business.id,
        name: "Kigali Main Store",
        address: "KN 5 Rd",
        city: "Kigali",
        state: "Kigali City",
        country: "Rwanda",
        postalCode: "250",
        phone: "+250780123456",
        email: "kigali.main@kigalishoes.rw",
        isMain: true,
      },
    }),
    prisma.location.create({
      data: {
        businessId: business.id,
        name: "Kigali Heights Branch",
        address: "KG 7 Ave",
        city: "Kigali",
        state: "Kigali City",
        country: "Rwanda",
        postalCode: "250",
        phone: "+250780123457",
        email: "heights@kigalishoes.rw",
        isMain: false,
      },
    }),
  ]);

  const weekdayHours = [1, 2, 3, 4, 5]; // Monday to Friday
  const weekendHours = [0, 6]; // Sunday and Saturday

  for (const location of locations) {
    await Promise.all(
      weekdayHours.map((day) =>
        prisma.operatingHours.create({
          data: {
            businessId: business.id,
            locationId: location.id,
            dayOfWeek: day,
            openTime: "08:00",
            closeTime: "18:00",
            isClosed: false,
          },
        }),
      ),
    );

    await Promise.all(
      weekendHours.map((day) =>
        prisma.operatingHours.create({
          data: {
            businessId: business.id,
            locationId: location.id,
            dayOfWeek: day,
            openTime: "09:00",
            closeTime: "16:00",
            isClosed: false,
          },
        }),
      ),
    );
  }

  const bot = await prisma.bot.create({
    data: {
      workspaceId: workspace.id,
      businessId: business.id,
      name: "KigaliShoes Assistant",
      description: "Virtual sales assistant for Kigali Shoes & More",
      language: "en",
      systemMessage:
        "You are a friendly sales assistant for Kigali Shoes & More. Help customers find the perfect shoes and provide information about our products and services.",
      welcomeMessage:
        "Welcome to Kigali Shoes & More! How can I help you find your perfect pair of shoes today?",
      starterQuestions: [
        "What are your current promotions?",
        "Do you have any formal shoes for men?",
        "What's your return policy?",
        "Can you deliver to my location in Kigali?",
      ],
    },
  });

  console.log(`Seed data created successfully!`);
  console.log(`Created workspace: ${workspace.id}`);
  console.log(`Created business: ${business.id}`);
  console.log(`Created bot: ${bot.id}`);
  prisma.$disconnect();
}

module.exports = {
  businessSeeder,
};
