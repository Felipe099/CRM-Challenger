import { useState, useEffect, useContext } from 'react';
import { Trash2, Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { LeadsContext } from '../context/LeadsContext';
import {
    LoadingSpinner,
    ErrorMessage,
    EmptyState,
    LoadingTable,
} from './LoadingComponents';
import { getStepColor, simulateApiCall, safeLocalStorage } from '../utils';
import type { Lead, Client } from '../types';

export function ClientsTable() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [removingId, setRemovingId] = useState<number | null>(null);
    const { setLeads } = useContext(LeadsContext);

    useEffect(() => {
        loadClients();

        const handleClientsUpdate = () => loadClients();
        window.addEventListener('clientsUpdated', handleClientsUpdate);

        return () => {
            window.removeEventListener('clientsUpdated', handleClientsUpdate);
        };
    }, []);

    const loadClients = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await simulateApiCall(600, 0.03);

            const stored = safeLocalStorage.getItem('clients');
            const clientsData = stored ? JSON.parse(stored) : [];
            setClients(clientsData);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to load prospects';
            setError(errorMessage);
            console.error('Error loading clients:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveClient = async (client: Client) => {
        setRemovingId(client.id);
        setError(null);

        try {
            await simulateApiCall(800, 0.05);

            const updatedClients = clients.filter(
                (user) => user.id !== client.id
            );
            setClients(updatedClients);

            const success = safeLocalStorage.setItem(
                'clients',
                JSON.stringify(updatedClients)
            );
            if (!success) {
                throw new Error('Failed to save changes');

                console.log(client);
            }

            const leadToRestore: Lead = {
                id: client.id,
                name: client.name || client.accountName.split(' - ')[0] || '',
                company:
                    client.company || client.accountName.split(' - ')[1] || '',
                email: client.email || '',
                source: client.source || 'unknown',
                status: client.status,
                score: client.score || 75,
                value: client.value || undefined,
                image: client.image,
            };

            setLeads((prev: Lead[]) => {
                const newLeads = [...prev, leadToRestore];
                safeLocalStorage.setItem('contacts', JSON.stringify(newLeads));
                window.dispatchEvent(new Event('contactsUpdated'));
                return newLeads;
            });

            window.dispatchEvent(
                new CustomEvent('clientDeleted', {
                    detail: { clientId: client.id },
                })
            );
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Failed to remove prospect';
            setError(errorMessage);
            console.error('Error removing client:', err);
        } finally {
            setRemovingId(null);
        }
    };

    const totalValue = clients.reduce(
        (account, client) => account + (client.value || 0),
        0
    );

    if (isLoading && clients.length === 0) {
        return <LoadingTable rows={6} columns={6} />;
    }

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">
                                Converted Prospects
                            </h2>
                            <p className="text-purple-200 mt-1">
                                Leads that became active opportunities
                            </p>
                        </div>
                    </div>

                    {isLoading && clients.length > 0 && (
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                            <LoadingSpinner size="sm" className="text-white" />
                            <span className="text-white text-sm">
                                Updating...
                            </span>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-6">
                        <ErrorMessage
                            message={error}
                            onRetry={() => {
                                setError(null);
                                loadClients();
                            }}
                            className="bg-red-900/30 border-red-400/30 backdrop-blur-sm"
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        icon={Users}
                        label="All Prospects"
                        value={clients.length}
                        isLoading={isLoading && clients.length === 0}
                        iconBg="bg-green-500/30"
                    />

                    <StatCard
                        icon={DollarSign}
                        label="Total Value"
                        value={`$${totalValue.toLocaleString()}`}
                        isLoading={isLoading && clients.length === 0}
                        iconBg="bg-blue-500/30"
                    />

                    <StatCard
                        icon={TrendingUp}
                        label="Average Value"
                        value={`$${
                            clients.length > 0
                                ? Math.round(
                                      totalValue / clients.length
                                  ).toLocaleString()
                                : '0'
                        }`}
                        isLoading={isLoading && clients.length === 0}
                        iconBg="bg-yellow-500/30"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {clients.length === 0 && !isLoading ? (
                    <EmptyState
                        title="No prospects converted yet"
                        description="Convert some leads to see your prospects here"
                        icon={Users}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                                <tr>
                                    <th className="text-left p-6 font-semibold text-gray-700">
                                        ID
                                    </th>
                                    <th className="text-left p-6 font-semibold text-gray-700">
                                        Account Name
                                    </th>
                                    <th className="text-left p-6 font-semibold text-gray-700">
                                        Step
                                    </th>
                                    <th className="text-left p-6 font-semibold text-gray-700">
                                        Value
                                    </th>
                                    <th className="text-left p-6 font-semibold text-gray-700">
                                        Creation Date
                                    </th>
                                    <th className="text-center p-6 font-semibold text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {clients.map((client) => (
                                    <tr
                                        key={client.id}
                                        className="hover:bg-gray-50 transition-colors group"
                                    >
                                        <td className="p-6">
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">
                                                #{client.id}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                                                {client.accountName}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStepColor(
                                                    client.step
                                                )}`}
                                            >
                                                {client.step}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            {client.value ? (
                                                <span className="text-lg font-bold text-green-600">
                                                    $
                                                    {client.value.toLocaleString()}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic">
                                                    Not informed
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                {client.created}
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <button
                                                onClick={() =>
                                                    handleRemoveClient(client)
                                                }
                                                disabled={
                                                    removingId === client.id
                                                }
                                                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                                    removingId === client.id
                                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                                        : 'bg-red-500 hover:bg-red-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                                                }`}
                                            >
                                                {removingId === client.id ? (
                                                    <LoadingSpinner size="sm" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                                {removingId === client.id
                                                    ? 'Removing...'
                                                    : 'Remove'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

interface StatCardProps {
    icon: React.ComponentType<any>;
    label: string;
    value: string | number;
    isLoading: boolean;
    iconBg: string;
}

function StatCard({
    icon: Icon,
    label,
    value,
    isLoading,
    iconBg,
}: StatCardProps) {
    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-3">
                <div className={`p-2 ${iconBg} rounded-lg`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-purple-200 text-sm font-medium">
                        {label}
                    </p>
                    <div className="text-2xl font-bold">
                        {isLoading ? (
                            <div className="flex items-center">
                                <LoadingSpinner
                                    size="sm"
                                    className="text-white mr-2"
                                />
                                <span className="text-lg">--</span>
                            </div>
                        ) : (
                            value
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
