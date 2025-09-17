import { createContext, useState, useEffect, ReactNode } from 'react';
import type { Lead, LeadsContextType, Client } from '../types';
import db from '../assets/db.json';

export const LeadsContext = createContext<LeadsContextType>({
    leads: [],
    setLeads: () => {},
    updateLead: () => {},
    reloadLeads: () => {},
});

interface LeadsProviderProps {
    children: ReactNode;
}

export function LeadsProvider({ children }: LeadsProviderProps) {
    const [leads, setLeads] = useState<Lead[]>([]);

    const reloadLeads = () => {
        try {
            const storedContacts = localStorage.getItem('contacts');
            let allLeads: Lead[];

            if (storedContacts) {
                allLeads = JSON.parse(storedContacts);
            } else {
                const storedClients = localStorage.getItem('clients');
                const clients: Client[] = storedClients
                    ? JSON.parse(storedClients)
                    : [];
                const clientIds = clients.map((c) => c.id);

                allLeads = (db as Lead[]).filter(
                    (lead) => !clientIds.includes(lead.id)
                );

                localStorage.setItem('contacts', JSON.stringify(allLeads));
            }

            setTimeout(() => setLeads(allLeads), 500);
        } catch (error) {
            console.error('Erro ao recarregar leads:', error);
            setLeads(db as Lead[]);
        }
    };

    const updateLead = (id: number, updatedData: Partial<Lead>) => {
        console.log('Atualizando lead:', id, updatedData);

        setLeads((prevLeads) => {
            const updatedLeads = prevLeads.map((lead) =>
                lead.id === id ? { ...lead, ...updatedData } : lead
            );

            console.log('Leads atualizados:', updatedLeads);

            try {
                localStorage.setItem('contacts', JSON.stringify(updatedLeads));
                console.log('Salvou no localStorage');
            } catch (error) {
                console.error('Erro ao salvar no localStorage:', error);
            }

            window.dispatchEvent(new Event('contactsUpdated'));

            try {
                const storedClients = localStorage.getItem('clients');
                if (storedClients) {
                    const clients: Client[] = JSON.parse(storedClients);
                    const clientExists = clients.some((c) => c.id === id);

                    if (clientExists) {
                        const updatedClients = clients.map((c) =>
                            c.id === id
                                ? {
                                      ...c,
                                      email: updatedData.email || c.email,
                                  }
                                : c
                        );
                        localStorage.setItem(
                            'clients',
                            JSON.stringify(updatedClients)
                        );
                        window.dispatchEvent(new Event('clientsUpdated'));
                        console.log('Atualizou clients também');
                    }
                }
            } catch (error) {
                console.error('Erro ao atualizar clients:', error);
            }

            return updatedLeads;
        });
    };

    useEffect(() => {
        reloadLeads();

        const handleContactsUpdate = () => {
            console.log('Evento contactsUpdated recebido');
            reloadLeads();
        };

        window.addEventListener('contactsUpdated', handleContactsUpdate);

        return () => {
            window.removeEventListener('contactsUpdated', handleContactsUpdate);
        };
    }, []);

    useEffect(() => {
        console.log('Estado de leads mudou:', leads.length, 'leads');
    }, [leads]);

    return (
        <LeadsContext.Provider
            value={{ leads, setLeads, updateLead, reloadLeads }}
        >
            {children}
        </LeadsContext.Provider>
    );
}
