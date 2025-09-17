import { useState, useMemo, useContext } from 'react';
import {
    Search,
    Filter,
    ArrowUpDown,
    X,
    Eye,
    Mail,
    Building,
} from 'lucide-react';
import { SlidePanel } from './SlidePanel';
import { LeadsContext } from '../context/LeadsContext';
import type { Lead, SortOrder } from '../types';

export function Table() {
    const { leads, updateLead } = useContext(LeadsContext);

    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

    const getStatusColor = (status: string): string => {
        const statusColors: Record<string, string> = {
            new: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            'in contact': 'bg-blue-100 text-blue-800 border-blue-200',
            qualified: 'bg-purple-100 text-purple-800 border-purple-200',
            disqualified: 'bg-red-100 text-red-800 border-red-200',
            closed: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return (
            statusColors[status.toLowerCase()] ||
            'bg-gray-100 text-gray-800 border-gray-200'
        );
    };

    const getScoreColor = (score: number): string => {
        if (score >= 80) return 'text-emerald-600 font-bold';
        if (score >= 60) return 'text-yellow-600 font-semibold';
        return 'text-red-600 font-semibold';
    };

    const filteredAndSortedData = useMemo(() => {
        let filtered = leads;

        if (searchTerm) {
            filtered = filtered.filter(
                (lead) =>
                    lead.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    lead.company
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter((lead) => lead.status === statusFilter);
        }

        return [...filtered].sort((a, b) =>
            sortOrder === 'desc' ? b.score - a.score : a.score - b.score
        );
    }, [leads, statusFilter, sortOrder, searchTerm]);

    const uniqueStatuses = [...new Set(leads.map((lead) => lead.status))];

    const toggleSort = () =>
        setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));

    const handleLeadClick = (lead: Lead) => {
        setSelectedLeadId(lead.id);
        setTimeout(() => setIsPanelOpen(true), 100);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setTimeout(() => setSelectedLeadId(null), 300);
    };

    const selectedLead = selectedLeadId
        ? leads.find((l) => l.id === selectedLeadId)
        : null;

    return (
        <>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header com filtros */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Busca */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por nome, empresa ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Filtros */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-gray-500" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                                >
                                    <option value="all">Todos os Status</option>
                                    {uniqueStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() +
                                                status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg font-medium">
                                {filteredAndSortedData.length} de {leads.length}{' '}
                                leads
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabela */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left p-4 font-semibold text-gray-700">
                                    Lead
                                </th>
                                <th className="text-left p-4 font-semibold text-gray-700">
                                    Empresa
                                </th>
                                <th className="text-left p-4 font-semibold text-gray-700">
                                    Contato
                                </th>
                                <th className="text-left p-4 font-semibold text-gray-700">
                                    Fonte
                                </th>
                                <th
                                    className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors rounded-lg"
                                    onClick={toggleSort}
                                >
                                    <div className="flex items-center gap-2">
                                        Score
                                        <ArrowUpDown className="w-4 h-4" />
                                        <span className="text-xs text-blue-600">
                                            {sortOrder === 'desc' ? '↓' : '↑'}
                                        </span>
                                    </div>
                                </th>
                                <th className="text-left p-4 font-semibold text-gray-700">
                                    Status
                                </th>
                                <th className="text-center p-4 font-semibold text-gray-700">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAndSortedData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-12 text-gray-500"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="w-12 h-12 text-gray-300" />
                                            <p className="text-lg font-medium">
                                                Nenhum lead encontrado
                                            </p>
                                            <p className="text-sm">
                                                Tente ajustar os filtros de
                                                busca
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredAndSortedData.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        className="hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                                        onClick={() => handleLeadClick(lead)}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    className="w-10 h-10 rounded-full ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all duration-200"
                                                    src={
                                                        lead.image ||
                                                        `https://ui-avatars.com/api/?name=${lead.name}&background=random`
                                                    }
                                                    alt={lead.name}
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                                        {lead.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Building className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-700">
                                                    {lead.company}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-700">
                                                    {lead.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                                {lead.source}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`text-lg font-bold ${getScoreColor(
                                                    lead.score
                                                )}`}
                                            >
                                                {lead.score}
                                            </span>
                                            <span className="text-gray-400 text-sm">
                                                /100
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                    lead.status
                                                )}`}
                                            >
                                                {lead.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    lead.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors group-hover:scale-110 transform duration-200">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <SlidePanel
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                leadData={selectedLead}
                onSave={updateLead}
            />
        </>
    );
}
