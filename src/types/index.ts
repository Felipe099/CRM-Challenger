export interface Lead {
    id: number;
    name: string;
    company: string;
    email: string;
    source: string;
    status: string;
    score: number;
    image?: string;
    value?: number;
}

export interface Client {
    id: number;
    accountName: string;
    etapa: string;
    valor: number | null;
    created: string;
    nome?: string;
    email?: string;
    score?: number;
    source?: string;
}

export interface LeadsContextType {
    leads: Lead[];
    setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
    updateLead: (id: number, updatedData: Partial<Lead>) => void;
    reloadLeads: () => void;
}

export type TabType = 'leads' | 'clients';

export type StatusType =
    | 'new'
    | 'in contact'
    | 'qualified'
    | 'disqualified'
    | 'closed';

export type SortOrder = 'asc' | 'desc';
