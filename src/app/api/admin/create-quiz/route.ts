export const dynamic = 'force-dynamic';
export const revalidate = 0;


import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma";

interface QuestionData {
    text: string;
    options: string[];
    correctAnswer: string;
}

interface CreateQuizPayload {
    fieldName: string;
    topicName: string;
    quizTitle: string;
    quizDescription: string;
    quizTimeLimit: number;
    questions: QuestionData[];
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json(
            { message: "Unauthorized. Must be an administrator." },
            { status: 403 }
        );
    }

    try {
        const {fieldName, topicName, quizTitle, quizDescription, quizTimeLimit, questions }: CreateQuizPayload = await req.json();

        if (!topicName || !quizTitle || !quizTimeLimit || !questions || questions.length === 0) {
            return NextResponse.json(
                { message: "Invalid payload. All fields are required." },
                { status: 400 }
            );
        }

        const result = await prisma.$transaction(async (tx) => {
            
            const field = await tx.field.upsert({
                where: { name: fieldName },
                update: {},
                create: { name: fieldName }
            });

            const topic = await tx.topic.upsert({
                where: { name: topicName },
                update: {},
                create: { name: topicName, fieldId: field.id }
            });

            
            const newQuiz = await tx.quiz.upsert({
                where: {
                    topicId_title: {
                        title: quizTitle,
                        topicId: topic.id
                    }
                },
                update: {
                    timeLimit: quizTimeLimit,
                }, 
                create: {
                    title: quizTitle,
                    description: quizDescription,
                    timeLimit: quizTimeLimit,
                    topicId: topic.id
                }
            });

            const questionsCreation = questions.map((q) => ({
                text: q.text,
                options: q.options,
                correctAnswer: q.correctAnswer,
                quizId: newQuiz.id
            }));

            const newQuestions = await tx.question.createMany({
                data: questionsCreation
            });

            return { newQuiz, newQuestions };
        });

        return NextResponse.json(
            { message: "Quiz created successfully.", quiz: result.newQuiz },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create quiz:", error);
        return NextResponse.json({ message: "Failed to create quiz." }, { status: 500 });
    }
}
