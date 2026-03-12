import { NextResponse } from 'next/server';
import axios from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import { isRateLimited } from '@/lib/rate-limiter'; 

export async function POST(request: Request) {
    const requestBody = await request.json();
    const { userId, question, options, userAnswer } = requestBody;
    if (!userId) {
        return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const rateLimited = await isRateLimited(userId);
    if (rateLimited) {
        return NextResponse.json(
            { "message": "Too many requests -- Only 4 requests/minute. Please try again after a minute." },
            {
                status: 429,
                headers: {
                    "Retry-After": "120"
                }
            }
        );
    }

    if (!question || !options) {
        return NextResponse.json({ error: 'Missing required question details.' }, { status: 400 });
    }

    const prompt = `
        You are an expert tutor and pedagogical expert in explaining complex topics in a simple, structured way. Your goal is to provide a comprehensive, yet easy-to-read explanation for a multiple-choice quiz question.

        Please provide a detailed explanation using markdown. Ensure that important technical terms and key concepts are **bolded**.
        
        The explanation should have three distinct sections.

        **1. Correct Answer**
        [State the correct answer and provide a detailed explanation of why it is the correct choice. Explain the core concept behind it.]

        **2. Key Concepts**
        [Provide a list of 2-3 key terms or concepts related to the correct answer. Explain each concept concisely in a bulleted list.]

        **3. Your Answer**
        [If the user's answer was incorrect, explain why their choice was wrong and clarify the common misconception. If their answer was correct, provide positive reinforcement.]
        
        Use the following information for your explanation:
        Question: "${question}"
        Options: ${options.join(', ')}
        User's Answer: "${userAnswer}"
    `;

    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            temperature: 0.7,
            topK: 40
        }
    };

    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;;

    try {
        const response = await axiosInstance.post(apiUrl, payload, {});

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            return NextResponse.json({ error: 'No explanation generated.' }, { status: 500 });
        }

        return NextResponse.json({ explanation: text });

    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            console.error('API Error:', err.response?.data || err.message);
            return NextResponse.json(
                { error: 'Failed to get explanation from AI. Please try again.' },
                { status: err.response?.status || 500 }
            );
        } else {
            console.error('Request Error:', err);
            return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
        }
    }
}
