import { PrismaClient } from "@prisma/client";

// serverless prisma
export const prisma = global.prisma || new PrismaClient();

declare global {
  var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "development") global.prisma = prisma;
















// import { PrismaClient } from '@prisma/client';
// import slugify from 'slugify';
// import { hashPassword } from '@/utils/transactions';

// const prisma = new PrismaClient();

// // Middleware: Hash Passwords
// prisma.$use(async (params, next) => {
//   if (params.model === 'User' && ['create', 'update'].includes(params.action)) {
//     if (params.args.data.password) {
//       params.args.data.password = await hashPassword(params.args.data.password);
//     }
//   }
//   return next(params);
// });

// // Middleware: Slugify Fields
// prisma.$use(async (params, next) => {
//   const modelsToSlugify = [
//     { model: 'roles', field: 'slugName' },
//   ];

//   const modelToSlugify = modelsToSlugify.find((model) => model.model === params.model);
//   if (modelToSlugify && ['create', 'update'].includes(params.action)) {
//     const { field } = modelToSlugify;
//     if (params.args.data && params.args.data[field]) {
//       params.args.data[field] = slugify(params.args.data[field], {
//         lower: true,
//         strict: true,
//         trim: true,
//       });
//     }
//   }
//   return next(params);
// });
// const prismaClientSingleton = () => {
//   return new PrismaClient();
// };
// declare global {
//   var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
// }
// globalThis.prisma = prisma;
// export { prisma };
