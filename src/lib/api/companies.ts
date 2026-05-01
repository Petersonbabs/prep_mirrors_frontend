import { Company } from "../types";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444';

export const companiesApi = {
    getUserCompanies: async (profileId: string) => {
        const response = await fetch(`${API_URL}/api/companies/${profileId}`);
        return response.json();
    },

    generateCompanies: async (profileId: string, targetRole: string, experienceLevel: string) => {
        const response = await fetch(`${API_URL}/api/companies/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileId, targetRole, experienceLevel }),
        });
        return response.json();
    },

    refreshCompanies: async (profileId: string, targetRole: string, experienceLevel: string): Promise<{ success: boolean; companies: Company[]; generated: boolean }> => {
        const response = await fetch(`${API_URL}/api/companies/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileId, targetRole, experienceLevel }),
        });
        return response.json();
    },
};