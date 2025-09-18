import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Lead, Client } from '../types';
import db from '../assets/db.json';
import { LeadsContext } from '../context/LeadsContext';

interface LeadsProviderProps {
    children: ReactNode;
}

export function LeadsProvider({ children }: LeadsProviderProps) {
    const [leads, setLeads] = useState<Lead[]>([]);

    const reloadLeads = () => {
        try {
            const storedClients = localStorage.getItem('clients');
            const clients: Client[] = storedClients
                ? JSON.parse(storedClients)
                : [];
            const clientIds = clients.map((c) => c.id);

            const storedContacts = localStorage.getItem('contacts');
            const allLeads: Lead[] = storedContacts
                ? JSON.parse(storedContacts)
                : (db as Lead[]).filter((lead) => !clientIds.includes(lead.id));

            const uniqueLeads = allLeads.reduce(
                (acc: Lead[], current: Lead) => {
                    const existingLead = acc.find(
                        (lead) => lead.id === current.id
                    );
                    if (!existingLead) {
                        acc.push(current);
                    }
                    return acc;
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
                localStorage.setItem('contacts', JSON.stringify(filteredLeads));
            }

            setLeads(filteredLeads);
        } catch {
            setLeads(db as Lead[]);
        }
    };

    const restoreLeadFromClient = (clientId: number) => {
        const originalLead = (db as Lead[]).find(
            (lead) => lead.id === clientId
        );
        if (!originalLead) return;

        const storedContacts = localStorage.getItem('contacts');
        const currentLeads: Lead[] = storedContacts
            ? JSON.parse(storedContacts)
            : [];

        if (currentLeads.some((lead) => lead.id === clientId)) return;

        const updatedLeads = [...currentLeads, originalLead];

        const uniqueLeads = updatedLeads.reduce(
            (acc: Lead[], current: Lead) => {
                const existingLead = acc.find((lead) => lead.id === current.id);
                if (!existingLead) {
                    acc.push(current);
                }
                return acc;
            },
            []
        );

        localStorage.setItem('contacts', JSON.stringify(uniqueLeads));
        setLeads(uniqueLeads);
        window.dispatchEvent(new Event('contactsUpdated'));
    };

    const updateLead = (id: number, updatedData: Partial<Lead>) => {
        setLeads((prev) => {
            const updatedLeads = prev.map((lead) =>
                lead.id === id ? { ...lead, ...updatedData } : lead
            );
            localStorage.setItem('contacts', JSON.stringify(updatedLeads));

            const storedClients = localStorage.getItem('clients');
            if (storedClients) {
                const clients: Client[] = JSON.parse(storedClients);
                if (clients.some((c) => c.id === id)) {
                    const updatedClients = clients.map((client) =>
                        client.id === id
                            ? {
                                  ...client,
                                  email: updatedData.email ?? client.email,
                                  nome: updatedData.name ?? client.name,
                              }
                            : client
                    );
                    localStorage.setItem(
                        'clients',
                        JSON.stringify(updatedClients)
                    );
                    window.dispatchEvent(new Event('clientsUpdated'));
                }
            }

            window.dispatchEvent(new Event('contactsUpdated'));
            return updatedLeads;
        });
    };

    useEffect(() => {
        reloadLeads();

        const handleContactsUpdate = () => reloadLeads();
        const handleClientsUpdate = () => reloadLeads();
        const handleClientDeleted = (event: CustomEvent) =>
            restoreLeadFromClient(event.detail.clientId);

        window.addEventListener('contactsUpdated', handleContactsUpdate);
        window.addEventListener('clientsUpdated', handleClientsUpdate);
        window.addEventListener(
            'clientDeleted',
            handleClientDeleted as EventListener
        );

        return () => {
            window.removeEventListener('contactsUpdated', handleContactsUpdate);
            window.removeEventListener('clientsUpdated', handleClientsUpdate);
            window.removeEventListener(
                'clientDeleted',
                handleClientDeleted as EventListener
            );
        };
    }, []);

    return (
        <LeadsContext.Provider
            value={{ leads, setLeads, updateLead, reloadLeads }}
        >
            {children}
        </LeadsContext.Provider>
    );
}
