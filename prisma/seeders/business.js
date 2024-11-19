const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

class BusinessSeeder {
  constructor() {
    this.prisma = new PrismaClient();
    this.businessData = {
      user: {
        email: "seller@cognova.io",
        name: "Seller",
        password: "123456",
      },
      workspace: {
        name: "rwanda-foot-wear-ltd",
        displayName: "Rwanda Footwear Ltd",
        planId: "cm3fq9f3c000208jo25xqesv2",
      },
      business: {
        name: "Kigali Shoes & More",
        type: "Footwear Retail",
        description: "Premium footwear retailer in Rwanda offering local and international shoe brands",
        hasDelivery: true,
        hasPickup: true,
        acceptsReturns: true,
        hasWarranty: true,
      },
      config: {
        deliveryFee: 2000,
        estimatedDeliveryArrival: "6 hours",
        minOrderAmount: 10000,
        taxRate: 18,
        returnPeriodDays: 14,
        warrantyPeriodDays: 90,
        currency: "RWF",
      },
      categories: [
        {
          name: "Men's Shoes",
          description: "Footwear for men including formal, casual, and sports shoes",
        },
        {
          name: "Women's Shoes",
          description: "Footwear for women including heels, flats, and sports shoes",
        },
        {
          name: "Children's Shoes",
          description: "Footwear for kids of all ages",
        },
      ],
      products: [
        {
          name: "Classic Leather Office Shoes",
          description: "Handcrafted leather office shoes, perfect for formal occasions",
          price: 45000,
          stock: 25,
          sku: "MENS-LEATHER-001",
          images: ["/placeholder/shoes/mens-leather-001.jpg"],
          isActive: true,
          categoryIndex: 0,
        },
        {
          name: "Adidas Yeezy 700 V3 Azael",
          description: "After the success of the first two versions, Adidas and Kanye reveal the Yeezy 700 V3 with an important evolution in terms of design !",
          price: 25000,
          stock: 40,
          sku: "YEEZY-700-V#-001",
          images: ["https://cdn.shopify.com/s/files/1/2358/2817/products/yeezy-700-v3-azael-583213.png?v=1638814800&width=750"],
          isActive: true,
          categoryIndex: 0,
        },
        {
          name: "Elegant Evening Heels",
          description: "Stylish heels perfect for special occasions",
          price: 40000,
          stock: 20,
          sku: "WOMENS-HEEL-001",
          images: ["/placeholder/shoes/womens-heel-001.jpg"],
          isActive: true,
          categoryIndex: 1,
        },
        {
          name: "Kids Sport Shoes",
          description: "Durable and comfortable sports shoes for children",
          price: 25000,
          stock: 40,
          sku: "KIDS-SPORT-001",
          images: ["/placeholder/shoes/kids-sport-001.jpg"],
          isActive: true,
          categoryIndex: 2,
        },
      ],
      locations: [
        {
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
        {
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
      ],
      operatingHours: {
        weekday: {
          days: [1, 2, 3, 4, 5],
          openTime: "08:00",
          closeTime: "18:00",
        },
        weekend: {
          days: [0, 6],
          openTime: "09:00",
          closeTime: "16:00",
        },
      },
      bot: {
        name: "Kigali Shoes Assistant",
        description: "Virtual sales assistant for Kigali Shoes & More",
        language: "en",
        systemMessage: "You are a friendly sales assistant for Kigali Shoes & More. Help customers find the perfect shoes and provide information about our products and services.",
        welcomeMessage: "Welcome to Kigali Shoes & More! How can I help you find your perfect pair of shoes today?",
        starterQuestions: [
          "What are your current promotions?",
          "Do you have any formal shoes for men?",
          "What's your return policy?",
          "Can you deliver to my location in Kigali?",
        ],
      },
    };
  }

  async cleanDatabase() {
    console.log("🧹 Cleaning up existing data...");
    await this.prisma.businessOperatingHours.deleteMany();
    await this.prisma.businessProduct.deleteMany();
    await this.prisma.businessCategory.deleteMany();
    await this.prisma.businessLocation.deleteMany();
    await this.prisma.businessConfig.deleteMany();
    await this.prisma.business.deleteMany();
    console.log("✅ Database cleaned successfully");
  }

  async createUser() {
    console.log("👤 Creating root user...");
    const hashedPassword = await bcrypt.hash(
      this.businessData.user.password,
      parseInt(process.env.SALT_ROUNDS)
    );

    const user = await this.prisma.user.upsert({
      where: { email: this.businessData.user.email },
      update: {},
      create: {
        ...this.businessData.user,
        password: hashedPassword,
        emailVerified: true,
      },
    });
    console.log(`✅ Root user created with ID: ${user.id}`);
    return user;
  }

  async createWorkspace(ownerId) {
    console.log("🏢 Creating workspace...");
    const workspace = await this.prisma.workspace.create({
      data: {
        ...this.businessData.workspace,
        ownerId,
      },
    });
    console.log(`✅ Workspace created with ID: ${workspace.id}`);
    return workspace;
  }

  async createBusiness(workspaceId) {
    console.log("🏪 Creating business...");
    const business = await this.prisma.business.create({
      data: {
        ...this.businessData.business,
        workspaceId,
      },
    });
    console.log(`✅ Business created with ID: ${business.id}`);
    return business;
  }

  async createBusinessConfig(businessId) {
    console.log("⚙️ Creating business configuration...");
    const config = await this.prisma.businessConfig.create({
      data: {
        ...this.businessData.config,
        businessId,
      },
    });
    console.log(`✅ Business configuration created with ID: ${config.id}`);
    return config;
  }

  async createCategories(businessId) {
    console.log("📑 Creating categories...");
    const categories = await Promise.all(
      this.businessData.categories.map((category) =>
        this.prisma.businessCategory.create({
          data: {
            ...category,
            businessId,
          },
        })
      )
    );
    console.log(`✅ Created ${categories.length} categories`);
    return categories;
  }

  async createProducts(businessId, categories) {
    console.log("📦 Creating products...");
    const products = await Promise.all(
      this.businessData.products.map((product) => {
        const { categoryIndex, ...cleanProduct } = product
        return this.prisma.businessProduct.create({
          data: {
            ...cleanProduct,
            businessId,
            categoryId: categories[categoryIndex].id,
          },
        })
      })
    );
    console.log(`✅ Created ${products.length} products`);
    return products;
  }

  async createLocations(businessId) {
    console.log("📍 Creating locations...");
    const locations = await Promise.all(
      this.businessData.locations.map((location) =>
        this.prisma.businessLocation.create({
          data: {
            ...location,
            businessId,
          },
        })
      )
    );
    console.log(`✅ Created ${locations.length} locations`);
    return locations;
  }

  async createOperatingHours(businessId, locations) {
    console.log("⏰ Creating operating hours...");
    const hours = [];

    for (const location of locations) {
      // Create weekday hours
      const weekdayHours = await Promise.all(
        this.businessData.operatingHours.weekday.days.map((day) =>
          this.prisma.businessOperatingHours.create({
            data: {
              businessId,
              locationId: location.id,
              dayOfWeek: day,
              openTime: this.businessData.operatingHours.weekday.openTime,
              closeTime: this.businessData.operatingHours.weekday.closeTime,
              isClosed: false,
            },
          })
        )
      );

      // Create weekend hours
      const weekendHours = await Promise.all(
        this.businessData.operatingHours.weekend.days.map((day) =>
          this.prisma.businessOperatingHours.create({
            data: {
              businessId,
              locationId: location.id,
              dayOfWeek: day,
              openTime: this.businessData.operatingHours.weekend.openTime,
              closeTime: this.businessData.operatingHours.weekend.closeTime,
              isClosed: false,
            },
          })
        )
      );

      hours.push(...weekdayHours, ...weekendHours);
    }
    console.log(`✅ Created operating hours for ${locations.length} locations`);
    return hours;
  }

  async createBot(workspaceId, businessId) {
    console.log("🤖 Creating bot...");
    const bot = await this.prisma.bot.create({
      data: {
        ...this.businessData.bot,
        workspaceId,
        businessId,
      },
    });
    console.log(`✅ Bot created with ID: ${bot.id}`);
    return bot;
  }

  async seed() {
    try {
      console.log("🌱 Starting business seeding process...");

      await this.cleanDatabase();
      const user = await this.createUser();
      const workspace = await this.createWorkspace(user.id);
      const business = await this.createBusiness(workspace.id);
      await this.createBusinessConfig(business.id);
      const categories = await this.createCategories(business.id);
      await this.createProducts(business.id, categories);
      const locations = await this.createLocations(business.id);
      await this.createOperatingHours(business.id, locations);
      const bot = await this.createBot(workspace.id, business.id);

      console.log("✨ Seed completed successfully!");
      await this.prisma.$disconnect();
      return { workspace, business, bot };
    } catch (error) {
      console.error("❌ Error during seeding:", error);
      await this.prisma.$disconnect();
      throw error;
    }
  }
}

module.exports = {
  BusinessSeeder,
};