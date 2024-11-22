// const fs = require("fs");
// const path = require("path");

// // Generator functions
// function generateStore(modelName: string): string {
//   return `
// import { toast } from 'sonner';
// import { create } from 'zustand';
// import {  get${modelName}s } from './actions';
// import type { ${modelName} } from '@prisma/client';

// interface ${modelName}State {
//   ${modelName.toLowerCase()}s: ${modelName}[];
//   loading: boolean;
//   error: string | null;

//   fetch${modelName}s: (workspaceId: string) => Promise<void>;

// }

// export const use${modelName}Store = create<${modelName}State>((set) => ({
//   ${modelName.toLowerCase()}s: [],
//   loading: true,
//   error: null,
//   fetch${modelName}s: async (workspaceId: string) => {
//     set({ loading: true, error: null });
//     try {
//       const response = await get${modelName}s({ where: { workspaceId }});
//       if (response.success) {
//         set({ ${modelName.toLowerCase()}s: response.data });
//       } else {
//         throw new Error(response.error);
//       }
//     } catch (err: any) {
//       const error: Error = err
//       set({ error: error.message });
//       toast.error('Failed to load ${modelName}s');
//     } finally {
//       set({ loading: false });
//     }
//   },
// }));
// `;
// }

// function generateActions(modelName: string): string {
//   return `
// "use server";
// import { prisma } from "@/lib/services/prisma";
// import type { ${modelName} } from '@prisma/client';

// interface ApiResponse<T> {
//   success: boolean;
//   data?: T;
//   error?: string;
// }
// export async function get${modelName}s(
//   whereInput: { where?: any } = {}
// ): Promise<ApiResponse<${modelName}[]>> {
//   try {
//     const results = await prisma.${modelName.toLowerCase()}.findMany(whereInput);
//     return { success: true, data: results };
//   } catch (err: any) {
//     const error: Error = err
//     return { success: false, error: error.message };
//   }
// }
// `;
// }
// async function generateStoreActions(modelName: string) {
//   try {

//     const baseDir = path.join(`${modelName.toLowerCase()}s`);

//     fs.mkdirSync(baseDir, { recursive: true });

//     const files = [
//       {
//         path: path.join(baseDir, "store.ts"),
//         content: generateStore(modelName),
//       },
//       {
//         path: path.join(baseDir, "actions.ts"),
//         content: generateActions(modelName),
//       },
//     ];

//     for (const file of files) {
//       fs.writeFileSync(file.path, file.content, "utf8");
//       console.log(`Generated: ${file.path}`);
//     }

//     console.log(`\nSuccessfully generated UI components for ${modelName} in ${baseDir}`);
//   } catch (err: any) {
//     const error: Error = err;
//     console.error("Error generating UI components:", error);
//     process.exit(1);
//   }
// }

// if (require.main === module) {
//   const args = process.argv.slice(2);
//   if (args.length !== 1) {
//     console.error("Usage: ts-node store-actions.ts <model-name>");
//     process.exit(1);
//   }

//   const [modelName] = args;
//   generateStoreActions(modelName);
// }

