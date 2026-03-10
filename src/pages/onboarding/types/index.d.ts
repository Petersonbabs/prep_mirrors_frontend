export interface Option {
  id: string;
  label: string;
  emoji?: string;
  response?: {
    headline: string;
    body: string;
    stat?: string;
  };
}
export interface EducationFact {
  emoji: string;
  label: string;
  headline: string;
  body: string;
  source: string;
}