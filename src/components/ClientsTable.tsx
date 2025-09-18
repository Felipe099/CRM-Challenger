import { useState, useEffect, useContext } from 'react';
import { Trash2, Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { LeadsContext } from '../context/LeadsContext';
import type { Lead, Client } from '../types';

export function ClientsTable() {
    const [clients, setClients] = useState<Client[]>([]);
    const { setLeads } = useContext(LeadsContext);

    useEffect(() => {
        loadClients();

        const handleClientsUpdate = () => loadClients();
        window.addEventListener('clientsUpdated', handleClientsUpdate);

        return () => {
            window.removeEventListener('clientsUpdated', handleClientsUpdate);
        };
    }, []);

    const loadClients = () => {
        try {
            const stored = localStorage.getItem('clients');
            setClients(stored ? JSON.parse(stored) : []);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            setClients([]);
        }
    };

    const handleRemoveClient = (client: Client) => {
        const updatedClients = clients.filter((user) => user.id !== client.id);
        setClients(updatedClients);
        localStorage.setItem('clients', JSON.stringify(updatedClients));

        const leadToRestore: Lead = {
            id: client.id,
            name: client.name || client.accountName.split(' - ')[0] || '',
            company: client.accountName.split(' - ')[1] || '',
            email: client.email || '',
            source: client.source || 'unknown',
            status: client.status,
            score: client.score || 75,
            value: client.value || undefined,
            image: client.image,
        };

        setLeads((prev: Lead[]) => {
            const newLeads = [...prev, leadToRestore];
            localStorage.setItem('contacts', JSON.stringify(newLeads));
            window.dispatchEvent(new Event('contactsUpdated'));
            return newLeads;
        });
    };

    const getStepColor = (step: string): string => {
        const stepColors: Record<string, string> = {
            prospecting: 'bg-blue-100 text-blue-800 border-blue-200',
            qualified: 'bg-green-100 text-green-800 border-green-200',
            proposal: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            negotiation: 'bg-orange-100 text-orange-800 border-orange-200',
            'closed-won': 'bg-emerald-100 text-emerald-800 border-emerald-200',
            'closed-lost': 'bg-red-100 text-red-800 border-red-200',
        };
        return (
            stepColors[step.toLowerCase()] ||
            'bg-gray-100 text-gray-800 border-gray-200'
        );
    };

    const totalValue = clients.reduce(
        (acc, client) => acc + (client.value || 0),
        0
    );

    console.log(clients);

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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-500/30 rounded-lg">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-purple-200 text-sm font-medium">
                                    All Prospects
                                </p>
                                <p className="text-2xl font-bold">
                                    {clients.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-500/30 rounded-lg">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-purple-200 text-sm font-medium">
                                    Value Total
                                </p>
                                <p className="text-2xl font-bold">
                                    ${totalValue.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-yellow-500/30 rounded-lg">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-purple-200 text-sm font-medium">
                                    Average Value
                                </p>
                                <p className="text-2xl font-bold">
                                    $
                                    {clients.length > 0
                                        ? Math.round(
                                              totalValue / clients.length
                                          ).toLocaleString()
                                        : '0'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {clients.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-gray-100 rounded-full">
                                <Users className="w-12 h-12 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No prospects converted yet
                                </h3>
                                <p className="text-gray-500">
                                    Convert some leads to see your prospects
                                    here
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                                <tr>
                                    <th className="text-left p-6 font-semibold text-gray-700">
                                        ID
                                    </th>
                                    <th className="text-left p-6 font-semibold text-gray-700">
                                        Name Account
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
                                                className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Remove
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
