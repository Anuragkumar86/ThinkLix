export const dynamic = 'force-dynamic';


import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { message: "You are not logged in OR not a legitimate user to perform this action" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 30;
  const skip = (page - 1) * pageSize;

  try {
  
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { userId: session.user.id },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: pageSize,
      include: {
        quiz: {
          include: {
            questions: true,
            topic: true,
          },
        },
      },
    });

    const allQuizAttempts = await prisma.quizAttempt.findMany({
      where: { userId: session.user.id },
      include: {
        quiz: {
          include: {
            questions: true, 
            topic: true
          },
        },
      },
    });

    const totalAttemptsCount = allQuizAttempts.length;

    const totalPassed = allQuizAttempts.filter(attempt => {
        const totalQuestions = attempt.quiz.questions.length;
        return (attempt.score / totalQuestions) * 100 >= 60;
    }).length;

    const totalPercentageSum = allQuizAttempts.reduce((sum, attempt) => {
        const totalQuestions = attempt.quiz.questions.length;
        const percentage = (attempt.score / totalQuestions) * 100;
        return sum + percentage;
    }, 0);

    const averagePercentage = totalAttemptsCount > 0 ? totalPercentageSum / totalAttemptsCount : 0;

    return NextResponse.json({
      quizAttempts,
      totalCount: totalAttemptsCount, 
      quizzesPassedCount: totalPassed, 
      averagePercentage: averagePercentage,
      allAttemptsForRetake: allQuizAttempts 
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    return NextResponse.json(
      {
        message: "Unable to get quizAttempt data",
        error: err,
      },
      { status: 501 }
    );
  }
}