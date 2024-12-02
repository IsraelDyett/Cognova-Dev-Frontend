const bcrypt = require("bcryptjs");
const { PrismaClient, BillingCycle, SubscriptionStatus } = require("@prisma/client");

const prisma = new PrismaClient();
const FREE_PLAN_ID = "cm3pmta2r000008k62n3e5wd9";
const BUSINESS_PLAN_ID = "cm3fq9f3c000208jo25xqesv2";
const ENTERPRISE_PLAN_ID = "cm3pmthg6000108k660lz073i";
const ADMIN_ROLE_ID = "cm3fqaet8000308jo9e4qbmrs";
const SYSTEM_USER_ID = "cm3fqf7or000608jo8n8i9clr";
const SYSTEM_WORKSPACE_ID = "cm3fqdyuj000508joe8jld6wd";

async function deleteCurrents() {
	await prisma.role.deleteMany();
	await prisma.user.deleteMany();
	await prisma.plan.deleteMany();
	await prisma.planFeature.deleteMany();
	await prisma.workspace.deleteMany();
	await prisma.workspaceMembership.deleteMany();
	await prisma.aiProvider.deleteMany();
	await prisma.model.deleteMany();
	await prisma.bot.deleteMany();
}
async function mainSeeder() {
	await deleteCurrents();
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

	await prisma.user.create({
		data: {
			id: SYSTEM_USER_ID,
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
		"Only WhatsApp Channel",
		"Basic AI Chatbot",
		"Basic Analytics Dashboard",
		"Email Support",
	];
	const businessPlanFeatures = [
		"WhatsApp & Instagram Channel",
		"Advanced AI Chatbot",
		"Advanced Analytics & Reporting",
		"Priority Support",
		"Multi-language Support",
	];
	const enterprisePlanFeatures = [
		"WhatsApp & Instagram Channel",
		"Custom & Latest AI Chatbot",
		"Real-time Analytics & API Access",
		"24/7 Dedicated Support",
		"Multi-language Support",
	];
	await prisma.planFeature.createMany({
		data: freePlanFeatures.map((featureTitle) => {
			return {
				planId: FREE_PLAN_ID,
				title: featureTitle,
			};
		}),
	});
	console.log("Free Plan Features Created");

	await prisma.planFeature.createMany({
		data: businessPlanFeatures.map((featureTitle) => {
			return {
				planId: BUSINESS_PLAN_ID,
				title: featureTitle,
			};
		}),
	});
	console.log("Business Plan Features Created");

	await prisma.planFeature.createMany({
		data: enterprisePlanFeatures.map((featureTitle) => {
			return {
				planId: ENTERPRISE_PLAN_ID,
				title: featureTitle,
			};
		}),
	});
	console.log("Enterprise Plan Features Created");

	await prisma.workspace.create({
		data: {
			id: SYSTEM_WORKSPACE_ID,
			name: "cognova",
			displayName: "Cognova",
			ownerId: SYSTEM_USER_ID,
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
	console.log("System Workspace created");

	await prisma.workspaceMembership.create({
		data: {
			userId: SYSTEM_USER_ID,
			workspaceId: SYSTEM_WORKSPACE_ID,
		},
	});
	console.log("Workspace user created");

	await prisma.aiProvider.create({
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

	await prisma.model.create({
		data: {
			name: "@hf/nousresearch/hermes-2-pro-mistral-7b",
			displayName: "HERMES 2 Pro Mistral 7b",
			aiProviderId: cognovaProvider.id,
			planId: FREE_PLAN_ID,
		},
	});
	console.log("HERMES 2 Pro Mistral 7b Model created");

	await prisma.model.create({
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
			aiProviderId: openaiProvider.id,
			planId: FREE_PLAN_ID,
		},
	});
	console.log("GPT-4 Model created");

	await prisma.productCategory.createMany({
		data: [
			{
				name: "Shoes"
			},
			{
				name: "Meals"
			},
			{
				name: "Clothes"
			},
			{
				name: "Electronic"
			}
		]
	})
	console.log("Product categories created")

	// await prisma.bot.create({
	// 	data: {
	// 		name: "Acme Store",
	// 		workspaceId: SYSTEM_WORKSPACE_ID,
	// 		waPhoneNumber: "+250729882416",
	// 		type: "SALES_ASSISTANT",
	// 		modelId: gpt4Model.id,
	// 		description: "Virtual sales assistant for Acme Store",
	// 		language: "en",
	// 		systemMessage:
	// 			"You are a friendly sales assistant for Acme Store. Help customers find the perfect products and provide information about our products and services.",
	// 	},
	// });
	// console.log("Bots created");

	prisma.$disconnect();
}
module.exports = {
	mainSeeder,
};
