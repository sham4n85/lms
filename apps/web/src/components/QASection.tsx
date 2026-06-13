'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface Answer {
  id: string;
  content: string;
  isAccepted: boolean;
  createdAt: string;
  user: { id: string; name: string; avatarUrl: string | null };
}

interface Question {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  isResolved: boolean;
  createdAt: string;
  user: { id: string; name: string; avatarUrl: string | null };
  answers: Answer[];
  answerCount: number;
}

export function QASection({ courseId }: { courseId: string }) {
  const { user, token } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [answerContent, setAnswerContent] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchQuestions = () => {
    api.get<Question[]>(`/courses/${courseId}/questions`)
      .then(setQuestions)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!courseId) return;
    fetchQuestions();
  }, [courseId]);

  const handleAsk = async () => {
    if (!token || !title.trim() || !content.trim()) return;
    try {
      await api.post(`/courses/${courseId}/questions`, { title, content });
      setTitle('');
      setContent('');
      setShowForm(false);
      setMsg('Question posted!');
      fetchQuestions();
    } catch (err: any) {
      setMsg(err.message);
    }
  };

  const handleUpvote = async (questionId: string) => {
    if (!token) return;
    try {
      await api.post(`/questions/${questionId}/upvote`, {});
      setQuestions((prev) =>
        prev.map((q) => q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q)
      );
    } catch {}
  };

  const handleAnswer = async (questionId: string) => {
    if (!token || !answerContent[questionId]?.trim()) return;
    try {
      await api.post(`/questions/${questionId}/answers`, { content: answerContent[questionId] });
      setAnswerContent({ ...answerContent, [questionId]: '' });
      fetchQuestions();
    } catch {}
  };

  const handleAccept = async (answerId: string, questionId: string) => {
    if (!token) return;
    try {
      await api.patch(`/answers/${answerId}/accept`, {});
      fetchQuestions();
    } catch {}
  };

  return (
    <div className="mt-8 pt-8 border-t">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4"
      >
        <span>{expanded ? '▼' : '▶'}</span>
        Q&A ({questions.length})
      </button>

      {expanded && (
        <div className="space-y-4">
          {user && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              {showForm ? 'Cancel' : 'Ask a Question'}
            </button>
          )}

          {showForm && (
            <div className="bg-white border rounded-xl p-4 space-y-3">
              <input
                type="text"
                placeholder="Question title"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Your question..."
                className="w-full border rounded-lg px-3 py-2 text-sm"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button
                onClick={handleAsk}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
              >
                Post Question
              </button>
            </div>
          )}

          {msg && <p className="text-sm text-green-600">{msg}</p>}

          {questions.length === 0 && !loading && (
            <p className="text-sm text-gray-400">No questions yet. Be the first to ask!</p>
          )}

          {questions.map((q) => (
            <div key={q.id} className="bg-white border rounded-xl p-4">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleUpvote(q.id)}
                  className="flex flex-col items-center text-sm text-gray-400 hover:text-indigo-600"
                >
                  <span>▲</span>
                  <span className="font-medium">{q.upvotes}</span>
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{q.title}</h4>
                    {q.isResolved && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Resolved</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{q.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {q.user.name} &middot; {new Date(q.createdAt).toLocaleDateString()}
                  </p>

                  <div className="mt-3 space-y-2">
                    {q.answers.map((a) => (
                      <div
                        key={a.id}
                        className={`text-sm p-2 rounded ${a.isAccepted ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}
                      >
                        <p>{a.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-400">{a.user.name}</span>
                          {!a.isAccepted && user && (user.id === q.user.id || user.id === q.user.id) && (
                            <button
                              onClick={() => handleAccept(a.id, q.id)}
                              className="text-xs text-green-600 hover:underline"
                            >
                              Accept
                            </button>
                          )}
                          {a.isAccepted && <span className="text-xs text-green-600 font-medium">Accepted</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {user && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        placeholder="Write an answer..."
                        className="flex-1 border rounded px-3 py-1.5 text-sm"
                        value={answerContent[q.id] || ''}
                        onChange={(e) => setAnswerContent({ ...answerContent, [q.id]: e.target.value })}
                      />
                      <button
                        onClick={() => handleAnswer(q.id)}
                        className="text-sm bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200"
                      >
                        Answer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
