
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export interface Lead {
    id: string;
    created_at: string;
    page_id: string;
    page_owner_id: string;
    name?: string;
    email?: string;
    phone?: string;
    status: LeadStatus;
    source: string;
    notes?: string;
    metadata?: Record<string, any>; // Dynamic fields

    // Computed/Joined fields
    page_title?: string;
}

export interface LeadStats {
    total: number;
    new: number;
    conversion_rate: number;
}
