import { DiagnosticEvaluationSchema } from '../types/diagnostic.types';

const API_URL = import.meta.env.VITE_API_URL;

export interface EvaluateDiagnosticParams {
    question: string;
    answer: string;
    role: string;
    company?: string;
    timelineDays: number;
}

export type EvaluateDiagnosticResult =
    | { success: true; evaluation: DiagnosticEvaluationSchema }
    | { success: false; error: string };

// Public endpoint: the diagnostic is taken before signup, so this deliberately
// does not go through apiClient (no session to attach).
export const diagnosticApi = {
    evaluate: async (params: EvaluateDiagnosticParams): Promise<EvaluateDiagnosticResult> => {
        try {
            const response = await fetch(`${API_URL}/api/diagnostic/evaluate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            });

            if (response.status === 429) {
                return { success: false, error: "You've run a few of these already. Try again a little later." };
            }

            const data = await response.json().catch(() => null);

            if (!response.ok || !data?.success || !data?.evaluation) {
                // No fabricated fallback: a made-up scorecard is worse than an
                // honest error, since the whole promise here is a real read.
                return { success: false, error: "We couldn't score that answer. Give it another go." };
            }

            return { success: true, evaluation: data.evaluation };
        } catch {
            return { success: false, error: 'Network problem — check your connection and try again.' };
        }
    },
};
