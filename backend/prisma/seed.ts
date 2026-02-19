// Optional seed file for development
// Run with: npx ts-node --compiler-options {"module":"CommonJS"} backend/prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/utils';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      username: 'cryptouser1',
      passwordHash: await hashPassword('password123'),
      name: 'Crypto User 1',
      verified: true,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      username: 'cryptouser2',
      passwordHash: await hashPassword('password123'),
      name: 'Crypto User 2',
      verified: false,
    },
  });

  // Create sample companies
  const ledger = await prisma.company.upsert({
    where: { slug: 'ledger' },
    update: {},
    create: {
      name: 'Ledger',
      slug: 'ledger',
      description: 'Hardware wallet manufacturer',
      category: 'HARDWARE',
      verified: true,
    },
  });

  const bitpay = await prisma.company.upsert({
    where: { slug: 'bitpay' },
    update: {},
    create: {
      name: 'BitPay',
      slug: 'bitpay',
      description: 'Bitcoin payment processor',
      category: 'WALLETS',
      verified: true,
    },
  });

  // Create sample reviews
  await prisma.review.createMany({
    data: [
      {
        title: 'Review: Really good stuff this ledger has!',
        content: 'He was a tough challenge. There for 2 years and dealing with constant finance bugs, this is a solid product and the team is responsive.',
        authorId: user1.id,
        companyId: ledger.id,
        overallScore: 7.5,
        criteriaScores: {
          security: 9.0,
          easeOfUse: 7.0,
          support: 8.0,
          features: 7.5,
          value: 6.0,
        },
        status: 'APPROVED',
        helpfulCount: 5,
      },
      {
        title: 'Great wallet for beginners',
        content: 'BitPay is easy to use and has great customer support. The interface is intuitive and I feel my funds are secure.',
        authorId: user2.id,
        companyId: bitpay.id,
        overallScore: 8.0,
        criteriaScores: {
          security: 8.5,
          easeOfUse: 9.0,
          support: 8.5,
          features: 7.0,
          value: 7.0,
        },
        status: 'APPROVED',
        helpfulCount: 12,
      },
    ],
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

