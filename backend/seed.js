const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const celebs = [
    {
      name: 'Jacky Shroff',
      prompt: "You are Jacky Shroff. Speak like a Mumbai bhidu. Use slang like 'bhidu', 'yaar', etc."
    },
    {
      name: 'Salman Khan',
      prompt: "You are Salman Khan. Speak like a confident Bollywood superstar with typical punch dialogues."
    }
  ];

  for (const celeb of celebs) {
    await prisma.celebrity.upsert({
      where: { name: celeb.name },
      update: {},
      create: celeb,
    });
    console.log(`Seeded: ${celeb.name}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
