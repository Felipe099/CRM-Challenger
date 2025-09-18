import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Lead, Client } from '../types';
import { LeadsContext } from '../context/LeadsContext';
import { safeLocalStorage } from '../utils';
import db from '../assets/db.json';

interface LeadsProviderProps {
    children: ReactNode;
}

export function LeadsProvider({ children }: LeadsProviderProps) {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const reloadLeads = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const storedClients = safeLocalStorage.getItem('clients');
            const clients: Client[] = storedClients
                ? JSON.parse(storedClients)
                : [];
            const clientIds = clients.map((c) => c.id);

            const storedContacts = safeLocalStorage.getItem('contacts');
            const allLeads: Lead[] = storedContacts
                ? JSON.parse(storedContacts)
                : db.filter((lead) => !clientIds.includes(lead.id));

            const uniqueLeads = allLeads.reduce(
                (account: Lead[], current: Lead) => {
                    const existingLead = account.find(
                        (lead) => lead.id === current.id
                    );
                    if (!existingLead) {
                        account.push(current);
                    }
                    return account;
                },
                []
            );

            const filteredLeads = uniqueLeads.filter(
                (lead) => !clientIds.includes(lead.id)
            );

            if (
                filteredLeads.length !== allLeads.length ||
                uniqueLeads.length !== allLeads.length
            ) {
                safeLocalStorage.setItem(
                    'contacts',
                    JSON.stringify(filteredLeads)
                );
            }

            setLeads(filteredLeads);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to load leads';
            setError(errorMessage);
            console.error('Error loading leads:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const restoreLeadFromClient = useCallback(async (clientId: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const originalLead = db.find((lead) => lead.id === clientId);
            if (!originalLead) return;

            const storedContacts = safeLocalStorage.getItem('contacts');
            const currentLeads: Lead[] = storedContacts
                ? JSON.parse(storedContacts)
                : [];

            if (currentLeads.some((lead) => lead.id === clientId)) return;

            const updatedLeads = [...currentLeads, originalLead];

            const uniqueLeads = updatedLeads.filter(
                (lead, index, self) =>
                    index === self.findIndex((steer) => steer.id === lead.id)
            );

            const success = safeLocalStorage.setItem(
                'contacts',
                JSON.stringify(uniqueLeads)
            );
            if (!success) {
                throw new Error('Failed to save to local storage');
            }

            setLeads(uniqueLeads as Lead[]);
            window.dispatchEvent(new Event('contactsUpdated'));
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to restore lead';
            setError(errorMessage);
            console.error('Error restoring lead:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateLead = useCallback(
        async (id: number, updatedData: Partial<Lead>) => {
            setIsLoading(true);
            setError(null);

            try {
                const updatedLeads = leads.map((lead) =>
                    lead.id === id ? { ...lead, ...updatedData } : lead
                );

                const success = safeLocalStorage.setItem(
                    'contacts',
                    JSON.stringify(updatedLeads)
                );
                if (!success) {
                    throw new Error('Failed to save to local storage');
                }

                const storedClients = safeLocalStorage.getItem('clients');
                if (storedClients) {
                    const clients: Client[] = JSON.parse(storedClients);
                    const clientIndex = clients.findIndex((c) => c.id === id);

                    if (clientIndex !== -1) {
                        const updatedClients = clients.map((client, index) =>
                            index === clientIndex
                                ? {
                                      ...client,
                                      email: updatedData.email ?? client.email,
                                      name: updatedData.name ?? client.name,
                                      status:
                                          updatedData.status ?? client.status,
                                  }
                                : client
                        );

                        safeLocalStorage.setItem(
                            'clients',
                            JSON.stringify(updatedClients)
                        );
                        window.dispatchEvent(new Event('clientsUpdated'));
                    }
                }

                setLeads(updatedLeads);
                window.dispatchEvent(new Event('contactsUpdated'));
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : 'Failed to update lead';
                setError(errorMessage);
                console.error('Error updating lead:', err);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [leads]
    );

    useEffect(() => {
        reloadLeads();

        const handleContactsUpdate = () => reloadLeads();
        const handleClientsUpdate = () => reloadLeads();

        const handleClientDeleted = (event: Event) => {
            const customEvent = event as CustomEvent<{ clientId: number }>;
            restoreLeadFromClient(customEvent.detail.clientId);
        };

        window.addEventListener('contactsUpdated', handleContactsUpdate);
        window.addEventListener('clientsUpdated', handleClientsUpdate);
        window.addEventListener('clientDeleted', handleClientDeleted);

        return () => {
            window.removeEventListener('contactsUpdated', handleContactsUpdate);
            window.removeEventListener('clientsUpdated', handleClientsUpdate);
            window.removeEventListener('clientDeleted', handleClientDeleted);
        };
    }, []);

    useEffect(() => {
        const persistFilters = () => {
            const filters = safeLocalStorage.getItem('leadFilters');
            if (filters) {
                try {
                    const {
                        statusFilter: _statusFilter,
                        sortOrder: _sortOrder,
                        searchTerm: _searchTerm,
                    } = JSON.parse(filters);
                } catch (err) {
                    console.warn('Invalid filter data in localStorage');
                }
            }
        };

        persistFilters();
    }, []);

    return (
        <LeadsContext.Provider
            value={{
                leads,
                setLeads,
                updateLead,
                reloadLeads,
                isLoading,
                error,
                clearError,
            }}
        >
            {children}
        </LeadsContext.Provider>
    );
}
