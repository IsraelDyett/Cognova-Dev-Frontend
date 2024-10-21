const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const adminRole = await prisma.role.create({
        data: {
            name: "admin",
            displayName: "Admin",
            permissions: {
                create: [
                    {
                       name: "manage_users",
                       displayName: "Manage Users",
                    }
                ]
            }
        },
    });
    console.log("Admin Role created or updated");
    await prisma.user.upsert({
        where: { email: "admin@app.com" },
        update: {},
        create: {
            name: "Admin",
            email: "admin@app.com",
            password: await bcrypt.hash("123456", parseInt(process.env.SALT_ROUNDS)),
            emailVerified: true,
            roleId: adminRole.id,
        },
    });
    console.log("Admin created or updated");
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