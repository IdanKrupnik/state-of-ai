import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

const supabase = createClient<Database>(supabaseUrl || '', supabaseServiceKey || '');
const genAI = new GoogleGenerativeAI(geminiApiKey || '');

export async function GET() {
  try {
    if (!supabaseUrl || !supabaseServiceKey || !geminiApiKey) {
      return NextResponse.json(
        { error: 'Missing environment variables in .env.local' },
        { status: 500 }
      );
    }

    const mockArticle = {
      title: "Google DeepMind unveils Gemini 2.5 Flash, bringing massive speedups and structured JSON outputs directly to developers",
      url: "https://x.com/google/status/123456789",
      company: "google"
    };

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `
      You are a world-class tech PR specialist and marketing evangelist. Your job is to take complex research or technical jargon and explain it in incredibly simple, exciting English terms so that the content is never overwhelming for a regular user.
      
      Return STRICTLY a valid JSON object matching this schema:
      {
        "simplified_title": "A highly captivating, premium English title using powerful active verbs. Keep it under 8 words.",
        "short_summary": "An enthusiastic, highly optimistic 1-2 sentence summary in English explaining what this means in plain terms without technical jargon.",
        "hype_score": a number between 0 and 100 based on how massive this breakthrough is for the consumer world
      }

      Analyze this article:
      Title: "${mockArticle.title}"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    if (!responseText) throw new Error("Empty response from Gemini API");
    
    const aiData = JSON.parse(responseText);

    const { data, error } = await supabase
      .from('articles')
      .insert([
        {
          original_title: mockArticle.title,
          simplified_title: aiData.simplified_title,
          short_summary: aiData.short_summary,
          hype_score: aiData.hype_score,
          source_url: mockArticle.url,
          company: mockArticle.company
        }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Successfully processed by Gemini in plain English and saved to Supabase!",
      insertedData: data
    });

  } catch (error: any) {
    console.error("Error in Gemini AI pipeline:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}