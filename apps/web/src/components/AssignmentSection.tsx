'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface AssignmentData {
  id: string;
  title: string;
  description: string;
  dueDays: number | null;
  maxScore: number;
  mySubmission: { id: string; content: string | null; fileUrl: string | null; score: number | null; feedback: string | null; submittedAt: string; gradedAt: string | null } | null;
  submissions?: { id: string; content: string | null; fileUrl: string | null; score: number | null; feedback: string | null; submittedAt: string; user: { id: string; name: string; email: string } }[];
}

export function AssignmentSection({ lessonId }: { lessonId: string }) {
  const { user, token } = useAuth();
  const [assignment, setAssignment] = useState<AssignmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');

  useEffect(() => {
    if (!lessonId) return;
    api.get<AssignmentData>(`/lessons/${lessonId}/assignment`)
      .then((a) => { setAssignment(a); setExpanded(true); })
      .catch(() => setAssignment(null))
      .finally(() => setLoading(false));
  }, [lessonId]);

  if (loading || !assignment) return null;

  const isInstructor = assignment.submissions !== undefined;

  const handleSubmit = async () => {
    if (!token) return;
    setSubmitting(true);
    setMsg('');
    try {
      const res = await api.post<any>(`/assignments/${assignment.id}/submit`, { content });
      setAssignment({ ...assignment, mySubmission: res });
      setMsg('Submitted successfully');
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGrade = async (submissionId: string) => {
    if (!token) return;
    try {
      const updated = await api.patch<any>(`/submissions/${submissionId}/grade`, {
        score: parseInt(gradeScore),
        feedback: gradeFeedback,
      });
      setAssignment((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          submissions: prev.submissions?.map((s) =>
            s.id === submissionId ? { ...s, ...updated } : s
          ),
        };
      });
      setGradingId(null);
      setGradeScore('');
      setGradeFeedback('');
    } catch (err: any) {
      setMsg(err.message);
    }
  };

  return (
    <div className="border-t mt-8 pt-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4"
      >
        <span>{expanded ? '▼' : '▶'}</span>
        Assignment: {assignment.title}
      </button>

      {expanded && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <p className="text-sm text-gray-600">{assignment.description}</p>
          <div className="text-xs text-gray-400">
            Max score: {assignment.maxScore}
            {assignment.dueDays && <> · Due: {assignment.dueDays} day{assignment.dueDays > 1 ? 's' : ''} after enrollment</>}
          </div>

          {isInstructor ? (
            <div>
              <h4 className="font-medium text-sm mb-2">Submissions ({assignment.submissions?.length || 0})</h4>
              {assignment.submissions?.length === 0 && <p className="text-sm text-gray-400">No submissions yet.</p>}
              {assignment.submissions?.map((sub) => (
                <div key={sub.id} className="border rounded-lg p-3 mb-2 text-sm">
                  <p className="font-medium">{sub.user.name} ({sub.user.email})</p>
                  {sub.content && <p className="text-gray-600 mt-1">{sub.content}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                    {sub.score !== null && <span className="text-green-600 font-medium">Score: {sub.score}</span>}
                    {sub.score === null && <span className="text-yellow-600">Ungraded</span>}
                  </div>
                  {sub.feedback && <p className="text-xs mt-1 text-gray-500">Feedback: {sub.feedback}</p>}
                  {gradingId === sub.id ? (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <input type="number" placeholder="Score" max={assignment.maxScore}
                        className="w-20 border rounded px-2 py-1 text-xs"
                        value={gradeScore} onChange={(e) => setGradeScore(e.target.value)} />
                      <input type="text" placeholder="Feedback"
                        className="flex-1 border rounded px-2 py-1 text-xs"
                        value={gradeFeedback} onChange={(e) => setGradeFeedback(e.target.value)} />
                      <button onClick={() => handleGrade(sub.id)}
                        className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">Save</button>
                      <button onClick={() => setGradingId(null)}
                        className="text-xs text-gray-500 hover:underline">Cancel</button>
                    </div>
                  ) : (
                    sub.score === null && (
                      <button onClick={() => setGradingId(sub.id)}
                        className="text-xs text-indigo-600 hover:underline mt-1">Grade</button>
                    )
                  )}
                </div>
              ))}
            </div>
          ) : (
            assignment.mySubmission ? (
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm font-medium text-green-700">Submitted</p>
                {assignment.mySubmission.content && (
                  <p className="text-sm text-gray-600 mt-1">{assignment.mySubmission.content}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>{new Date(assignment.mySubmission.submittedAt).toLocaleString()}</span>
                  {assignment.mySubmission.score !== null && (
                    <span className="text-green-600 font-medium">Score: {assignment.mySubmission.score}/{assignment.maxScore}</span>
                  )}
                </div>
                {assignment.mySubmission.feedback && (
                  <p className="text-xs mt-1 text-gray-500">Feedback: {assignment.mySubmission.feedback}</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  className="w-full border rounded-lg p-3 text-sm"
                  rows={4}
                  placeholder="Write your answer..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                {msg && <p className={`text-sm ${msg.includes('Success') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !content.trim()}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Assignment'}
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
