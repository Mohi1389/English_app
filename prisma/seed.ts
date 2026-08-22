  for (const w of words) {
    await prisma.word.upsert({
      where: { id: w.english },
      update: {},
      create: {
        id: w.english,
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
