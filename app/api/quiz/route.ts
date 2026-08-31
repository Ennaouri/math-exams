import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getQuizByPostId, getQuizAttempt, upsertQuizAttempt, pool } from '@/lib/db';

// GET /api/quiz?postId=X  — fetch quiz + previous attempt for the user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = Number(searchParams.get('postId'));
  if (!postId) return NextResponse.json({ error: 'postId requis' }, { status: 400 });

  const quiz = await getQuizByPostId(postId);
  if (!quiz) return NextResponse.json({ quiz: null });

  // Remove correct_index before sending to client (anti-cheat)
  const safeQuestions = quiz.questions.map((q: any) => ({
    id: q.id,
    question_text: q.question_text,
    choices: q.choices,
    position: q.position,
    // explanation only included after attempt is completed (handled client-side on submit response)
  }));

  const session = await auth();
  let attempt = null;
  if (session?.user) {
    const userId = Number((session.user as any).id);
    attempt = await getQuizAttempt(quiz.id, userId);
    if (attempt) {
      // For completed attempts, attach explanations and correct answers
      (attempt as any).correct_answers = quiz.questions.map((q: any) => ({
        question_id: q.id,
        correct_index: q.correct_index,
        explanation: q.explanation,
      }));
    }
  }

  return NextResponse.json({ quiz: { ...quiz, questions: safeQuestions }, attempt });
}

// POST /api/quiz — submit answers
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  }

  const userId = Number((session.user as any).id);
  const { quizId, answers } = await req.json();

  if (!quizId || !Array.isArray(answers)) {
    return NextResponse.json({ error: 'quizId et answers requis' }, { status: 400 });
  }

  // Fetch quiz with correct answers server-side to calculate score
  const qRes = await pool.query(
    'SELECT id, correct_index, explanation FROM quiz_question WHERE quiz_id = $1',
    [quizId]
  );
  const questions: { id: number; correct_index: number; explanation: string }[] = qRes.rows;
  const total = questions.length;

  let score = 0;
  const corrections = questions.map((q) => {
    const userAnswer = answers.find((a: any) => a.question_id === q.id);
    const isCorrect = userAnswer?.chosen_index === q.correct_index;
    if (isCorrect) score++;
    return {
      question_id: q.id,
      correct_index: q.correct_index,
      explanation: q.explanation || '',
      is_correct: isCorrect,
    };
  });

  await upsertQuizAttempt(quizId, userId, answers, score, total, true);

  return NextResponse.json({ score, total, corrections });
}
