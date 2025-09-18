import React from 'react';

export interface Lead {
    id: number;
    name: string;
    company: string;
    email: string;
    source: string;
    status: StatusType;
    score: number;
    image?: string;
    value?: number;
}

export interface Client {
    id: number;
    accountName: string;
    step: string;
    value: number | null;
    created: string;
    name?: string;
    email?: string;
    score?: number;
    source?: string;
    company?: string;
    image?: string;
    status: StatusType;
}

export interface LeadsContextType {
    leads: Lead[];
    setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
    updateLead: (id: number, updatedData: Partial<Lead>) => Promise<void>;
    reloadLeads: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
}

export type TabType = 'leads' | 'clients';

export type StatusType =
    | 'New'
    | 'In Contact'
    | 'Qualified'
    | 'Disqualified'
    | 'Closed';

export type SortOrder = 'asc' | 'desc';

export interface AppState {
    isLoading: boolean;
    error: string | null;
}
