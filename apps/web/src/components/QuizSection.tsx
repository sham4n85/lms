'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface Question {
  id: string;
  type: string;
  title: string;
  options: any[] | null;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  passingScore: number;
  maxAttempts: number;
  showResult: boolean;
  randomize: boolean;
  questions: Question[];
}

interface AttemptResult {
  id: string;
  score: number;
  maxScore: number;
  percentage: number;
  passingScore: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  answers?: { questionId: string; correct: boolean; points: number }[];
}

interface Attempt {
  id: string;
  score: number;
  answers: any;
  startedAt: string;
  completedAt: string | null;
}

export function QuizSection({ lessonId }: { lessonId: string }) {
  const { token } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    api.get<Quiz>(`/lessons/${lessonId}/quiz`)
      .then((q) => { setQuiz(q); setExpanded(true); })
      .catch(() => setQuiz(null))
      .finally(() => setLoading(false));
  }, [lessonId]);

  useEffect(() => {
    if (!token) return;
    api.get<Attempt[]>(`/quizzes/${quiz?.id}/attempts`)
      .then(setAttempts)
      .catch(() => {});
  }, [quiz?.id, token, result]);

  if (loading || !quiz) return null;

  const handleAnswer = (questionId: string, value: any, type: string) => {
    if (type === 'MULTIPLE_CHOICE') {
      const current = (answers[questionId] as string[]) || [];
      const next = current.includes(value)
        ? current.filter((v: string) => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [questionId]: next });
    } else {
      setAnswers({ ...answers, [questionId]: value });
    }
  };

  const handleSubmit = async () => {
    if (!token) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post<AttemptResult>(`/quizzes/${quiz.id}/attempt`, { answers });
      setResult(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const remainedAttempts = quiz.maxAttempts - attempts.length;

  return (
    <div className="border-t mt-8 pt-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4"
      >
        <span>{expanded ? '▼' : '▶'}</span>
        Quiz: {quiz.title}
      </button>

      {expanded && (
        <div className="bg-white border rounded-xl p-6 space-y-6">
          {quiz.description && (
            <p className="text-sm text-gray-500">{quiz.description}</p>
          )}

          {result ? (
            <div className={`p-4 rounded-lg ${result.passed ? 'bg-green-50' : 'bg-red-50'}`}>
              <h3 className="font-bold text-lg mb-2">
                {result.passed ? '🎉 Passed!' : '❌ Not Passed'}
              </h3>
              <p className="text-sm">
                Score: {result.score}/{result.maxScore} ({result.percentage}%)<br />
                Passing: {result.passingScore}%<br />
                Correct: {result.correctAnswers}/{result.totalQuestions}
              </p>
              {result.answers && (
                <div className="mt-3 space-y-2">
                  {result.answers.map((a) => {
                    const q = quiz.questions.find((qq) => qq.id === a.questionId);
                    return (
                      <div key={a.questionId} className={`text-sm p-2 rounded ${a.correct ? 'bg-green-100' : 'bg-red-100'}`}>
                        <span className="font-medium">{q?.title}</span> —{' '}
                        {a.correct ? '✓ Correct' : '✗ Incorrect'} ({a.points} pts)
                      </div>
                    );
                  })}
                </div>
              )}
              {attempts.length < quiz.maxAttempts && (
                <button
                  onClick={() => { setResult(null); setAnswers({}); }}
                  className="mt-4 text-sm text-indigo-600 hover:underline"
                >
                  Try Again
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-500">
                Attempts left: {remainedAttempts} / {quiz.maxAttempts}
              </div>

              {quiz.questions.map((q, idx) => (
                <div key={q.id} className="border-b pb-4 last:border-b-0">
                  <p className="font-medium text-sm mb-2">
                    {idx + 1}. {q.title}
                    <span className="text-gray-400 ml-2">({q.points} pt{q.points > 1 ? 's' : ''})</span>
                  </p>

                  {q.type === 'SINGLE_CHOICE' && q.options && (
                    <div className="space-y-1">
                      {q.options.map((opt: any) => (
                        <label key={opt.id} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name={q.id}
                            value={opt.id}
                            checked={answers[q.id] === opt.id}
                            onChange={() => handleAnswer(q.id, opt.id, q.type)}
                            className="accent-indigo-600"
                          />
                          {opt.text}
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'MULTIPLE_CHOICE' && q.options && (
                    <div className="space-y-1">
                      {q.options.map((opt: any) => (
                        <label key={opt.id} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            value={opt.id}
                            checked={((answers[q.id] as string[]) || []).includes(opt.id)}
                            onChange={() => handleAnswer(q.id, opt.id, q.type)}
                            className="accent-indigo-600"
                          />
                          {opt.text}
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'TRUE_FALSE' && (
                    <div className="space-y-1">
                      {['true', 'false'].map((val) => (
                        <label key={val} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name={q.id}
                            value={val}
                            checked={answers[q.id] === val}
                            onChange={() => handleAnswer(q.id, val, q.type)}
                            className="accent-indigo-600"
                          />
                          {val === 'true' ? 'True' : 'False'}
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'SHORT_ANSWER' && (
                    <textarea
                      className="w-full border rounded-lg p-2 text-sm"
                      rows={3}
                      placeholder="Type your answer..."
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswer(q.id, e.target.value, q.type)}
                    />
                  )}

                  {q.type === 'FILL_BLANK' && (
                    <input
                      type="text"
                      className="w-full border rounded-lg p-2 text-sm"
                      placeholder="Fill in the blank..."
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswer(q.id, e.target.value, q.type)}
                    />
                  )}
                </div>
              ))}

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Answers'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
