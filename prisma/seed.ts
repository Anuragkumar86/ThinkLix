import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.field.deleteMany();
  await prisma.user.deleteMany();


  

  const scienceField = await prisma.field.create({ data: { name: "Science" } });
  const historyField = await prisma.field.create({ data: { name: "History" } });
  const csField = await prisma.field.create({ data: { name: "Computer Science" } });


  const topicsData = [
    {
      name: "Science",
      field: scienceField,
      quizzes: [
        {
          title: "General Science Knowledge",
          description: "A basic quiz to test your knowledge of general science.",
          timeLimit: 120,
          questions: [
            {
              text: "What is the largest planet in our solar system?",
              options: ["Earth", "Mars", "Jupiter", "Saturn"],
              correctAnswer: "Jupiter",
            },
            {
              text: "What is the chemical symbol for water?",
              options: ["O2", "H2O", "CO2", "NaCl"],
              correctAnswer: "H2O",
            },
            {
              text: "Which organelle is considered the powerhouse of the cell?",
              options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
              correctAnswer: "Mitochondria",
            },
          ],
        },
      ],
    },
    {
      name: "History",
      field: historyField,
      quizzes: [
        {
          title: "World War II Trivia",
          description: "Test your knowledge on key events and figures of WWII.",
          timeLimit: 180,
          questions: [
            {
              text: "Which country invaded Poland in 1939, starting World War II?",
              options: ["France", "United Kingdom", "Germany", "Italy"],
              correctAnswer: "Germany",
            },
            {
              text: "Who was the Prime Minister of the United Kingdom during most of the war?",
              options: ["Neville Chamberlain", "Winston Churchill", "Clement Attlee", "Franklin D. Roosevelt"],
              correctAnswer: "Winston Churchill",
            },
          ],
        },
      ],
    },
    {
      name: "Computer Science",
      field: csField,
      quizzes: [
        {
          title: "Next.js Fundamentals",
          description: "A quiz covering the basics of the Next.js framework.",
          timeLimit: 120,
          questions: [
            {
              text: "What is the main benefit of Next.js Server Components?",
              options: ["Faster client-side rendering", "More SEO friendly", "Simpler state management", "Smaller bundle sizes"],
              correctAnswer: "More SEO friendly",
            },
            {
              text: "Which file in the App Router acts as the main layout for a route segment?",
              options: ["page.tsx", "layout.tsx", "route.ts", "default.tsx"],
              correctAnswer: "layout.tsx",
            },
          ],
        },
      ],
    },
  ];


  for (const topicData of topicsData) {
    await prisma.topic.create({
      data: {
        name: topicData.name,
        field: { connect: { id: topicData.field.id } },
        quizzes: {
          create: topicData.quizzes.map((quiz) => ({
            title: quiz.title,
            description: quiz.description,
            timeLimit: quiz.timeLimit,
            questions: {
              create: quiz.questions.map((q) => ({
                text: q.text,
                options: q.options,
                correctAnswer: q.correctAnswer,
              })),
            },
          })),
        },
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
