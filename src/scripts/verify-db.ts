import prisma from '../config/prisma';

async function verifyDatabaseConnection() {
  console.log('🔍 Testing PostgreSQL connection via Prisma ORM...');
  try {
    await prisma.$connect();
    const result = await prisma.$queryRaw<Array<{ version: string }>>`SELECT version();`;
    console.log('✅ Successfully connected to PostgreSQL!');
    console.log(`📌 Database Engine: ${result[0]?.version}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabaseConnection();
