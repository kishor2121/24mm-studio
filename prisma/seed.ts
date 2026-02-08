import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create photographer
  const hashedPassword = await bcrypt.hash('Karthik123', 10);
  
  const photographer = await prisma.photographer.upsert({
    where: { email: 'karthi04@gmail.com' },
    update: {},
    create: {
      email: 'karthi04@gmail.com',
      name: 'Karthik Studio',
      password: hashedPassword,
    },
  });

  console.log('✓ Photographer created:', photographer);
  console.log('Email: karthi04@gmail.com');
  console.log('Password: Karthik123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
