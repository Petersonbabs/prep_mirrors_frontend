// Shape of the public diagnostic evaluation returned by
// POST /api/diagnostic/evaluate.
//
// This mirrors diagnosticEvaluationSchema in the backend repo. It is declared
// here rather than imported from there: the two repos deploy separately, so a
// relative import reaching into ../../prepmirrors-backend resolves on a dev
// machine where the folders sit side by side and fails the build anywhere else.

export type BenchmarkStatus =
    | 'Needs Focused Prep'
    | 'Developing Competency'
    | 'Strong Candidate'
    | 'Top 10% Interview Ready';

export type RedFlagType =
    | 'hedging_language'
    | 'passive_pronoun'
    | 'missing_metrics'
    | 'rambling'
    | 'vague_technical_depth';

export interface DiagnosticEvaluationSchema {
    /** Overall readiness for this answer, 0-100. */
    readiness_score: number;
    benchmark_status: BenchmarkStatus;

    /** Each pillar is a 0-100 percentage, rendered as a filled bar. */
    pillar_scores: {
        star_structure: number;
        conciseness_clarity: number;
        domain_keywords: number;
        delivery_confidence: number;
        executive_impact: number;
    };

    star_analysis: {
        has_situation: boolean;
        has_task: boolean;
        has_action: boolean;
        has_result: boolean;
        missing_elements: string[];
    };

    red_flags: Array<{
        type: RedFlagType;
        issue: string;
        recommendation: string;
    }>;

    quote_rewrites: Array<{
        user_said: string;
        recruiter_rewrite: string;
        rationale: string;
    }>;

    /** Computed server-side from the readiness gap and the user's deadline. */
    timeline_pace: {
        target_timeline_days: number;
        estimated_practice_hours: number;
        sessions_per_day: number;
        minutes_per_day: number;
        target_ready_date: string;
        pace_headline: string;
    };

    strengths: string[];
    quick_wins: string[];
    final_verdict: string;
}
