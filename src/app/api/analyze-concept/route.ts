import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// NOTE: In a production app, this should be in process.env
const API_KEY = 'AIzaSyB1GtyKSXhIM-6kXEB-VhzLZERGBsTjwbw';

const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(request: Request) {
  try {
    const { description, city, mode = 'both' } = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    let prompt = '';

    if (mode === 'financials') {
      prompt = `
        Actúa como un consultor financiero de restaurantes.
        Basado en: "${description}" en "${city || 'España'}", estima los parámetros financieros.
        Devuelve SOLO un JSON con:
        {
          "averageTicket": number,
          "capacity": number,
          "rotationsLunch": number,
          "rotationsDinner": number,
          "daysOpen": number,
          "staff": number,
          "rent": number,
          "utilities": number
        }
      `;
    } else if (mode === 'suggestions') {
      prompt = `
        Actúa como un crítico y consultor gastronómico.
        Analiza este concepto: "${description}" en "${city || 'España'}".
        Devuelve SOLO un JSON con:
        {
          "suggestions": [
            "sugerencia 1 (breve)",
            "sugerencia 2 (breve)",
            "sugerencia 3 (breve)"
          ],
          "analysis": "Un breve párrafo de análisis general"
        }
      `;
    } else {
      // Both
      prompt = `
        Actúa como un consultor experto.
        Concepto: "${description}" en "${city || 'España'}".
        Devuelve SOLO un JSON con:
        {
          "averageTicket": number,
          "capacity": number,
          "rotationsLunch": number,
          "rotationsDinner": number,
          "daysOpen": number,
          "staff": number,
          "rent": number,
          "utilities": number,
          "suggestions": ["sugerencia 1", "sugerencia 2"],
          "analysis": "Análisis breve"
        }
      `;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the text to ensure it's valid JSON (remove markdown code blocks if any)
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const data = JSON.parse(jsonString);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling Gemini:', error);
    return NextResponse.json(
      { error: 'Failed to analyze concept' },
      { status: 500 }
    );
  }
}
