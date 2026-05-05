// frontend/src/lib/api/client.ts
import { supabase } from "../supabase";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444';

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    // Get session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });
    
    // Handle non-200 responses gracefully
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      return { success: false, ...error };
    }
    
    return response.json();
  },
  
  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  },
  
  post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  
  put(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  
  patch(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  
  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};