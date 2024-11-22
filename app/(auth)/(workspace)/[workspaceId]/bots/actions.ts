
"use server";
import { prisma } from "@/lib/services/prisma";
import type { Bot } from '@prisma/client';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createBot(
  data: Omit<Bot, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Bot>> {
  try {
    const result = await prisma.bot.create({
      data,
    });
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}

export async function updateBot(
  id: string,
  data: Partial<Bot>
): Promise<ApiResponse<Bot>> {
  try {
    const result = await prisma.bot.update({
      where: { id },
      data,
    });
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}

export async function deleteBot(
  id: string
): Promise<ApiResponse<Bot>> {
  try {
    const result = await prisma.bot.delete({
      where: { id },
    });
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}

export async function retrieveBot(
  id: string
): Promise<ApiResponse<Bot>> {
  try {
    const result = await prisma.bot.findUnique({
      where: { id },
    });
    if (!result) {
      return { success: false, error: 'Bot not found' };
    }
    return { success: true, data: result };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}

export async function listBots(
  whereInput: { where?: any } = {}
): Promise<ApiResponse<Bot[]>> {
  try {
    const results = await prisma.bot.findMany(whereInput);
    return { success: true, data: results };
  } catch (err: any) {
    const error: Error = err
    return { success: false, error: error.message };
  }
}
