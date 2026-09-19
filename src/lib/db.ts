// Safe Prisma Client Initializer
let prismaClient: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@prisma/client');
  if (PrismaClient) {
    const globalForPrisma = globalThis as unknown as {
      prisma: any;
    };
    prismaClient =
      globalForPrisma.prisma ??
      new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      });
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;
  }
} catch {
  // Prisma client not generated yet or offline
}

export const prisma = prismaClient || ({} as any);
