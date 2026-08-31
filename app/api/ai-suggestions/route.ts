import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { auth } from '@/lib/auth';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { progressStats, niveau } = await req.json();

    // Prepare prompt
    const prompt = `Tu es un conseiller pédagogique expert en mathématiques pour le programme marocain.
L'élève est au niveau : ${niveau || 'Non spécifié'}.
Voici ses statistiques récentes d'apprentissage sur notre plateforme :
- Total des cours/examens consultés : ${progressStats?.total_viewed || 0}
- Jours consécutifs d'étude (streak) : ${progressStats?.streak_days || 0}
- Activité par catégorie : ${JSON.stringify(progressStats?.by_category || [])}

Génère un court message d'encouragement personnalisé (maximum 2 phrases) et suggère exactement 3 actions concrètes pour la prochaine session d'étude. 
Réponds au format JSON strict avec la structure suivante, sans markdown ni texte supplémentaire :
{
  "message": "Ton message d'encouragement...",
  "suggestions": [
    "Suggestion 1 (ex: Faire 2 exercices sur les suites)",
    "Suggestion 2",
    "Suggestion 3"
  ]
}
Assure-toi que les suggestions sont pertinentes par rapport à ses statistiques (s'il travaille beaucoup une catégorie, suggérer d'approfondir ou de faire des examens, s'il n'a rien fait, suggérer de commencer par un cours basique).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    const result = JSON.parse(response.text);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Erreur Gemini:", error);
    return NextResponse.json({ error: 'Erreur lors de la génération des suggestions' }, { status: 500 });
  }
}
