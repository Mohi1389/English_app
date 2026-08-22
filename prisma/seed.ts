import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const words = [
  { english: 'learn', persian: 'یاد گرفتن', phonetic: '/lɜːrn/', exampleEn: 'I want to learn English.', exampleFa: 'من می‌خواهم انگلیسی یاد بگیرم.', level: 'beginner', difficulty: 1, related: ['teach', 'study', 'know'] },
  { english: 'friend', persian: 'دوست', phonetic: '/frend/', exampleEn: 'She is my best friend.', exampleFa: 'او بهترین دوست من است.', level: 'beginner', difficulty: 1, related: ['companion', 'pal', 'classmate'] },
  { english: 'confident', persian: 'با اعتماد به نفس', phonetic: '/ˈkɒnfɪdənt/', exampleEn: 'Be confident when you speak.', exampleFa: 'وقتی صحبت می‌کنی با اعتماد به نفس باش.', level: 'intermediate', difficulty: 3, related: ['sure', 'brave', 'certain'] },
  { english: 'hello', persian: 'سلام', phonetic: '/həˈloʊ/', exampleEn: 'Hello, how are you?', exampleFa: 'سلام، حالت چطور است؟', level: 'beginner', difficulty: 1, related: ['hi', 'hey', 'greetings'] },
  { english: 'help', persian: 'کمک کردن', phonetic: '/help/', exampleEn: 'Can you help me, please?', exampleFa: 'می‌توانی لطفاً کمکم کنی؟', level: 'beginner', difficulty: 1, related: ['assist', 'support', 'aid'] },
  { english: 'beautiful', persian: 'زیبا', phonetic: '/ˈbjuːtɪfəl/', exampleEn: 'This is a beautiful place.', exampleFa: 'اینجا جای زیبایی است.', level: 'elementary', difficulty: 2, related: ['pretty', 'lovely', 'gorgeous'] },
  { english: 'travel', persian: 'سفر کردن', phonetic: '/ˈtrævəl/', exampleEn: 'I love to travel.', exampleFa: 'من عاشق سفر کردن هستم.', level: 'elementary', difficulty: 2, related: ['journey', 'trip', 'voyage'] },
  { english: 'delicious', persian: 'خوشمزه', phonetic: '/dɪˈlɪʃəs/', exampleEn: 'The food is delicious.', exampleFa: 'غذا خوشمزه است.', level: 'elementary', difficulty: 2, related: ['tasty', 'yummy', 'flavorful'] },
  { english: 'understand', persian: 'فهمیدن', phonetic: '/ˌʌndərˈstænd/', exampleEn: 'Do you understand me?', exampleFa: 'آیا مرا می‌فهمی؟', level: 'intermediate', difficulty: 3, related: ['comprehend', 'grasp', 'realize'] },
  { english: 'important', persian: 'مهم', phonetic: '/ɪmˈpɔːrtənt/', exampleEn: 'This lesson is important.', exampleFa: 'این درس مهم است.', level: 'elementary', difficulty: 2, related: ['essential', 'key', 'vital'] },
  { english: 'practice', persian: 'تمرین کردن', phonetic: '/ˈpræktɪs/', exampleEn: 'Practice makes perfect.', exampleFa: 'تمرین، کامل می‌کند.', level: 'elementary', difficulty: 2, related: ['train', 'rehearse', 'repeat'] },
  { english: 'mother', persian: 'مادر', phonetic: '/ˈmʌðər/', exampleEn: 'I help my mother.', exampleFa: 'من به مادرم کمک می‌کنم.', level: 'beginner', difficulty: 1, related: ['mom', 'parent', 'family'] },
  { english: 'school', persian: 'مدرسه', phonetic: '/skuːl/', exampleEn: 'I go to school every day.', exampleFa: 'من هر روز به مدرسه می‌روم.', level: 'beginner', difficulty: 1, related: ['class', 'teacher', 'student'] },
  { english: 'yesterday', persian: 'دیروز', phonetic: '/ˈjestərdeɪ/', exampleEn: 'I went to school yesterday.', exampleFa: 'دیروز به مدرسه رفتم.', level: 'elementary', difficulty: 2, related: ['today', 'tomorrow', 'past'] },
  { english: 'achieve', persian: 'دست یافتن', phonetic: '/əˈtʃiːv/', exampleEn: 'You can achieve your goals.', exampleFa: 'تو می‌توانی به اهدافت دست یابی.', level: 'intermediate', difficulty: 3, related: ['accomplish', 'reach', 'succeed'] },
  { english: 'book', persian: 'کتاب', phonetic: '/bʊk/', exampleEn: 'I am reading a book.', exampleFa: 'من در حال خواندن یک کتاب هستم.', level: 'beginner', difficulty: 1, related: ['read', 'page', 'library'] },
  { english: 'happy', persian: 'خوشحال', phonetic: '/ˈhæpi/', exampleEn: 'I am happy today.', exampleFa: 'امروز خوشحال هستم.', level: 'beginner', difficulty: 1, related: ['glad', 'joyful', 'cheerful'] },
  { english: 'journey', persian: 'سفر، سیر و سلوک', phonetic: '/ˈdʒɜːrni/', exampleEn: 'Learning is a journey.', exampleFa: 'یادگیری یک سفر است.', level: 'intermediate', difficulty: 3, related: ['travel', 'path', 'adventure'] },
];

const quizzes = [
  {
    title: 'واژگان پایه', type: 'vocabulary', level: 'beginner',
    questions: [
      { q: 'معنی کلمه «friend» چیست؟', options: ['دوست', 'خانواده', 'مدرسه', 'کتاب'], answer: 0, hint: 'friend یعنی کسی که به او اعتماد می‌کنی.' },
      { q: 'معنی کلمه «help» چیست؟', options: ['دویدن', 'کمک کردن', 'خریدن', 'خوابیدن'], answer: 1 },
      { q: 'معنی کلمه «beautiful» چیست؟', options: ['زشت', 'بزرگ', 'زیبا', 'کوچک'], answer: 2 },
      { q: 'کدام کلمه یعنی «مدرسه»؟', options: ['school', 'book', 'friend', 'house'], answer: 0 },
      { q: 'معنی «understand» چیست؟', options: ['فهمیدن', 'فراموش کردن', 'نوشتن', 'خواندن'], answer: 0 },
    ],
  },
  {
    title: 'گرامر پایه', type: 'grammar', level: 'beginner',
    questions: [
      { q: 'گذشته فعل «go» چیست؟', options: ['goed', 'gone', 'went', 'going'], answer: 2, hint: 'go یک فعل بی‌قاعده است.' },
      { q: 'جمله صحیح را انتخاب کن:', options: ['I goed to school', 'I went to school', 'I goes to school', 'I go to school yesterday'], answer: 1 },
      { q: 'گذشته فعل «have» چیست؟', options: ['haved', 'has', 'had', 'having'], answer: 2 },
      { q: 'کدام جمله درست است؟', options: ['She are happy', 'She is happy', 'She am happy', 'She be happy'], answer: 1 },
      { q: 'علامت جمع «book» چیست؟', options: ['bookes', 'books', 'bookies', 'book'], answer: 1 },
    ],
  },
  {
    title: 'تعیین سطح', type: 'placement', level: 'intermediate',
    questions: [
      { q: 'I ___ English for three years.', options: ['study', 'studied', 'have studied', 'am study'], answer: 2 },
      { q: 'معنی «confident» چیست؟', options: ['ترسو', 'با اعتماد به نفس', 'عصبانی', 'خسته'], answer: 1 },
      { q: 'Which sentence is correct?', options: ['I have went', 'I have gone', 'I have goed', 'I has gone'], answer: 1 },
      { q: 'کلمه مناسب: The movie was very ___.', options: ['interested', 'interesting', 'interest', 'interests'], answer: 1 },
    ],
  },
  {
    title: 'آزمون ترکیبی', type: 'mixed', level: 'elementary',
    questions: [
      { q: 'معنی «travel» چیست؟', options: ['سفر کردن', 'خوردن', 'خوابیدن', 'کار کردن'], answer: 0 },
      { q: 'گذشته «eat» چیست؟', options: ['eated', 'ate', 'eaten', 'eating'], answer: 1 },
      { q: 'مترادف «happy» چیست؟', options: ['sad', 'joyful', 'angry', 'tired'], answer: 1 },
      { q: 'I ___ a student.', options: ['is', 'am', 'are', 'be'], answer: 1 },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding...');

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
        related: w.related,
      },
    });
  }

  for (const q of quizzes) {
    // Use title as a stable key to avoid duplicates
    const existing = await prisma.quiz.findFirst({ where: { title: q.title } });
    if (!existing) {
      await prisma.quiz.create({
        data: {
          title: q.title,
          type: q.type,
          level: q.level,
          questions: q.questions as any,
        },
      });
    }
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
