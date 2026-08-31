import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { upsertQuiz, upsertQuizQuestion, deleteQuizQuestion } from '@/lib/db';

// POST /api/quiz/admin — create or update a full quiz with questions
export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const body = await req.json();
  const { postId, title, description, timeLimit = 0, questions = [] } = body;

  if (!postId || !title) {
    return NextResponse.json({ error: 'postId et title requis' }, { status: 400 });
  }

  // Upsert quiz
  const quizId = await upsertQuiz(Number(postId), title, description || '', Number(timeLimit));

  // Upsert questions
  const savedIds: number[] = [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q.question_text || !Array.isArray(q.choices) || q.choices.length < 2) continue;
    const id = await upsertQuizQuestion(
      quizId,
      q.question_text,
      q.choices,
      Number(q.correct_index),
      q.explanation || '',
      i,
      q.id || undefined
    );
    savedIds.push(id);
  }

  return NextResponse.json({ success: true, quizId, questionCount: savedIds.length });
}

// DELETE /api/quiz/admin?questionId=X
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const questionId = Number(searchParams.get('questionId'));
  if (!questionId) return NextResponse.json({ error: 'questionId requis' }, { status: 400 });

  await deleteQuizQuestion(questionId);
  return NextResponse.json({ success: true });
}
