import Groq from 'groq-sdk';
import { GoogleGenAI } from '@google/genai';

// Groq API Key provided by user, falling back to process.env.GROQ_API_KEY
const GROQ_DEFAULT_KEY = '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';

let groqInstance: Groq | null = null;
let geminiInstance: GoogleGenAI | null = null;

export function getGroq(): Groq {
  if (!groqInstance) {
    const key = process.env.GROQ_API_KEY || GROQ_DEFAULT_KEY;
    groqInstance = new Groq({ apiKey: key });
  }
  return groqInstance;
}

export function getGemini(): GoogleGenAI | null {
  if (!geminiInstance && process.env.GEMINI_API_KEY) {
    geminiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' }
      }
    });
  }
  return geminiInstance;
}

export interface AIGenerationOptions {
  systemPrompt?: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

/**
 * Universal AI Generation function using Groq as primary engine, with fallback.
 */
export async function generateTextWithAI(options: AIGenerationOptions): Promise<string> {
  const systemPrompt = options.systemPrompt || 'You are an elite public policy and strategic consulting partner writing winning technical proposals and advisory briefs for Think Through Consultancy (TTC).';
  const temperature = options.temperature ?? 0.6;
  const maxTokens = options.maxTokens ?? 4096;

  // 1. Try Groq (Primary Engine - Ultra Fast, High Intelligence)
  try {
    const groq = getGroq();
    const primaryModel = options.model || 'openai/gpt-oss-120b';

    const completion = await groq.chat.completions.create({
      model: primaryModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: options.userPrompt }
      ],
      temperature,
      max_tokens: maxTokens
    });

    const output = completion.choices[0]?.message?.content?.trim();
    if (output && output.length > 20) {
      return output;
    }
  } catch (groqErr) {
    console.warn('[AI Engine] Groq primary generation encountered error, trying fast fallback:', groqErr);
    // Try instant fallback model on Groq
    try {
      const groq = getGroq();
      const completion = await groq.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: options.userPrompt }
        ],
        temperature,
        max_tokens: maxTokens
      });
      const output = completion.choices[0]?.message?.content?.trim();
      if (output && output.length > 20) {
        return output;
      }
    } catch (fallbackGroqErr) {
      console.warn('[AI Engine] Groq instant fallback also errored:', fallbackGroqErr);
    }
  }

  // 2. Try Gemini Fallback if available
  try {
    const gemini = getGemini();
    if (gemini) {
      const response = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${systemPrompt}\n\n${options.userPrompt}`,
        config: {
          temperature
        }
      });
      if (response.text && response.text.trim().length > 20) {
        return response.text.trim();
      }
    }
  } catch (geminiErr) {
    console.warn('[AI Engine] Gemini fallback encountered error:', geminiErr);
  }

  throw new Error('All AI generation backends were unable to complete the request.');
}

/**
 * Generate Structured JSON using Groq
 */
export async function generateJSONWithAI<T = any>(prompt: string, systemPrompt?: string): Promise<T> {
  const groq = getGroq();
  const sys = (systemPrompt || 'You are an elite tender analysis system.') + '\nReturn ONLY valid JSON matching the requested structure without markdown fences or additional conversational text.';

  try {
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    });

    const text = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(text) as T;
  } catch (err) {
    console.warn('[AI Engine] Groq JSON format error, falling back to text parsing:', err);
    const raw = await generateTextWithAI({
      userPrompt: `${prompt}\n\nIMPORTANT: Respond with pure JSON only!`,
      systemPrompt: sys,
      temperature: 0.1
    });
    const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as T;
  }
}
