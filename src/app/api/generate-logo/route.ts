import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';

const client = new GoogleGenAI({ apiKey: 'AIzaSyB1GtyKSXhIM-6kXEB-VhzLZERGBsTjwbw' });

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: [
        {
          parts: [
            { text: prompt }
          ],
        }
      ],
      config: {
        responseModalities: ["IMAGE"],
      }
    });

    // Extract image data from response
    let base64Image = null;
    
    if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (base64Image) {
      return NextResponse.json({ 
        success: true, 
        image: `data:image/png;base64,${base64Image}` 
      });
    } else {
      console.error('No image data found in response:', JSON.stringify(response, null, 2));
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error generating logo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
