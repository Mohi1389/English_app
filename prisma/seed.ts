import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const words = [
  {
    english: 'learn',
    persian: 'یاد گرفتن',
    phonetic: '/lɜːrn/',
    exampleEn: 'I want to learn English.',
    exampleFa: 'من می‌خواهم انگلیسی یاد بگیرم.',
    level: 'beginner',
    difficulty: 1,
  },
  {
    english: 'friend',
    persian: 'دوست',
    phonetic: '/frend/',
    exampleEn: 'She is my best friend.',
    exampleFa: 'او بهترین دوست من است.',
    level: 'beginner',
    difficulty: 1,
  },
  {
    english: 'confident',
    persian: 'با اعتماد به نفس',
    phonetic: '/ˈkɒnfɪdənt/',
    exampleEn: 'Be confident when you speak.',
    exampleFa: 'وقتی صحبت می‌کنی با اعتماد به نفس باش.',
    level: 'intermediate',
    difficulty: 3,
  },
];

async function main() {
  console.log('🌱 شروع seeding...');

  for (const w of words) {
    await prisma.word.upsert({
      where: { id: w.english },
      update: {},
      create: {
        english: w.english,
        persian: w.persian,
        phonetic: w.phonetic,
        exampleEn: w.exampleEn,
        exampleFa: w.exampleFa,
        level: w.level,
        difficulty: w.difficulty,
      },
    });
  }

  console.log('✅ Seed کامل شد!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
