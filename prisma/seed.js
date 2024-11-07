const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { ChatFeedback } = require("@prisma/client");

const prisma = new PrismaClient();
const botId = "9a9170c1-0f3b-463c-8d3e-33b002a4422b"
const workspaceId = "c85f9a6e-1c0a-417f-b472-af714b6fab90"

// Helper function to generate random chat content
const generateChatContent = (isHuman) => {
    const humanMessages = [
        "How can you help me with my project?",
        "Tell me more about your capabilities",
        "Can you explain how this works?",
        "That's interesting, can you elaborate?",
        "What are the best practices for this?",
        "Could you provide some examples?",
        "I'm having trouble understanding this concept",
        "How would you approach this problem?",
    ];

    const botMessages = [
        "I'd be happy to help you with your project. What specific aspects would you like to focus on?",
        "I can assist with coding, analysis, documentation, and problem-solving. What area interests you most?",
        "Let me break this down into simpler steps for you...",
        "Here's a detailed explanation of how this works...",
        "Based on your question, I would recommend...",
        "There are several approaches we could take here...",
        "I understand your confusion. Let me clarify...",
        "Here's an example that might help illustrate the concept...",
    ];

    return isHuman
        ? humanMessages[Math.floor(Math.random() * humanMessages.length)]
        : botMessages[Math.floor(Math.random() * botMessages.length)];
};

async function main() {
    // Create admin role and user (existing code)
    //   const adminRole = await prisma.role.create({
    //     data: {
    //       name: "admin",
    //       displayName: "Admin",
    //       permissions: {
    //         create: [
    //           {
    //             name: "manage_users",
    //             displayName: "Manage Users",
    //           }
    //         ]
    //       }
    //     },
    //   });
    //   console.log("Admin Role created or updated");

    //   await prisma.user.upsert({
    //     where: { email: "admin@app.com" },
    //     update: {},
    //     create: {
    //       name: "Admin",
    //       email: "admin@app.com",
    //       password: await bcrypt.hash("123456", parseInt(process.env.SALT_ROUNDS)),
    //       emailVerified: true,
    //       roleId: adminRole.id,
    //     },
    //   });
    //   console.log("Admin created or updated");

    // Create a bot
    // Create 4 conversations with 25 chats each
    for (let i = 0; i < 4; i++) {
        const conversation = await prisma.conversation.create({
            data: {
                botId: botId,
                browser: ["Chrome", "Firefox", "Safari", "Edge"][Math.floor(Math.random() * 4)],
                os: ["Windows", "MacOS", "Linux", "iOS"][Math.floor(Math.random() * 4)],
                device: ["Desktop", "Mobile", "Tablet"][Math.floor(Math.random() * 3)],
                countryCode: ["US", "CA", "UK", "RW"][Math.floor(Math.random() * 5)],
                generatedCategory: ["Support", "General", "Technical", "Inquiry"][Math.floor(Math.random() * 4)],
            }
        });

        // Create 25 chats
        for (let j = 0; j < 25; j++) {
            const isHuman = j % 2 === 0;
            await prisma.chat.create({
                data: {
                    conversationId: conversation.id,
                    role: isHuman ? "user" : "assistant",
                    content: generateChatContent(isHuman),
                    tokens: Math.floor(Math.random() * 100) + 50,
                    feedback: isHuman ? ChatFeedback.NONE :
                        [ChatFeedback.NONE, ChatFeedback.UPVOTED, ChatFeedback.DOWNVOTED][Math.floor(Math.random() * 3)],
                    sourceURLs: isHuman ? [] :
                        Math.random() > 0.7 ? ["https://docs.example.com", "https://help.example.com"] : [],
                    createdAt: new Date(Date.now() - (24 - j) * 3600000),
                }
            });
        }
        console.log(`Created conversation ${i + 1} with 25 chats`);
    }
}

main()
    .then(() => {
        console.log("Seeded successfully");
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });