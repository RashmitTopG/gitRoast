import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({});

export async function generateRoast(prompt: string) {
    const result = await ai.models.generateContent({ model: "gemini-3.1-flash-lite-preview" ,
        contents : prompt
    });

 
  const response  = result.text;
  if(response === undefined){
    return;
  }

  const formattedRoast = response
  .replace(/\\n/g, "\n")
  .trim();

  return formattedRoast;
}

