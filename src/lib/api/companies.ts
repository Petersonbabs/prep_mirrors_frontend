import { Company } from "../types";
import { apiClient } from "./client";

// These endpoints are authenticated and scoped server-side to the signed-in
// user, so the profileId arguments below are no longer what identifies the
// account — the bearer token is. They are kept in the signatures because
// callers already have the id to hand and the routes still take the param.
export const companiesApi = {
    getUserCompanies: async (profileId: string) => {
        return apiClient.get(`/api/companies/${profileId}`);
    },

    generateCompanies: async (profileId: string, targetRole: string, experienceLevel: string) => {
        return apiClient.post('/api/companies/generate', { profileId, targetRole, experienceLevel });
    },

    refreshCompanies: async (profileId: string, targetRole: string, experienceLevel: string): Promise<{ success: boolean; companies: Company[]; generated: boolean }> => {
        return apiClient.post('/api/refresh', { profileId, targetRole, experienceLevel });
    },

    getCompanyDetails: async (companyId: string) => {
        return apiClient.get(`/api/company/${companyId}`);
    }
};
