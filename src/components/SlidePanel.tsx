import { useState, useEffect, useContext } from 'react';
import {
    X,
    Edit3,
    Save,
    XCircle,
    CheckCircle,
    Mail,
    Building,
    Star,
    TrendingUp,
} from 'lucide-react';
import { LeadsContext } from '../context/LeadsContext';
import type { Lead } from '../types';

interface SlidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    leadData: Lead | null;
    onSave: (id: number, data: Partial<Lead>) => void;
}

export function SlidePanel({
    isOpen,
    onClose,
    leadData,
    onSave,
}: SlidePanelProps) {
    const { updateLead } = useContext(LeadsContext);

    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({
        email: '',
        status: '',
    });
    const [emailError, setEmailError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (leadData) {
            setEditedData({
                email: leadData.email || '',
                status: leadData.status || '',
            });
            setEmailError('');
            setIsEditing(false);
        }
    }, [leadData]);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.keyCode === 27) onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const validateEmail = (email: string) =>
        email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleFieldChange = (field: string, value: string) => {
        setEditedData((prev) => ({ ...prev, [field]: value }));
        if (field === 'email' && emailError) setEmailError('');
    };

    const handleSave = () => {
        if (!editedData.email || !validateEmail(editedData.email)) {
            setEmailError(
                !editedData.email
                    ? 'O email não pode estar em branco'
                    : 'Por favor, insira um email válido'
            );
            return;
        }

        if (leadData) {
            setIsSaving(true);

            console.log('Salvando lead:', leadData.id, editedData);
            updateLead(leadData.id, editedData);

            onSave(leadData.id, editedData);

            setIsEditing(false);
            setIsSaving(false);

            console.log('Lead salvo com sucesso');
        }
    };

    const handleCancel = () => {
        if (leadData) {
            setEditedData({
                email: leadData.email || '',
                status: leadData.status || '',
            });
        }
        setEmailError('');
        setIsEditing(false);
    };

    const handleConvertLead = () => {
        if (!leadData) return;

        const storedClients = localStorage.getItem('clients');
        const clients = storedClients ? JSON.parse(storedClients) : [];

        if (clients.some((client: any) => client.id === leadData.id)) return;

        const newClient = {
            id: leadData.id,
            accountName: `${leadData.name} - ${leadData.company}`,
            etapa: 'Prospecting',
            valor: leadData.value || null,
            created: new Date().toLocaleDateString('pt-BR'),
            nome: leadData.name,
            email: leadData.email,
            score: leadData.score,
            source: leadData.source,
        };

        clients.push(newClient);
        localStorage.setItem('clients', JSON.stringify(clients));
        window.dispatchEvent(new Event('clientsUpdated'));

        const storedLeads = localStorage.getItem('contacts');
        const leads = storedLeads ? JSON.parse(storedLeads) : [];
        const updatedLeads = leads.filter(
            (lead: Lead) => lead.id !== leadData.id
        );
        localStorage.setItem('contacts', JSON.stringify(updatedLeads));
        window.dispatchEvent(new Event('contactsUpdated'));

        onClose();
    };

    if (!leadData) return null;

    const getStatusColor = (status: string) => {
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

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const isAlreadyConverted = (() => {
        const storedClients = localStorage.getItem('clients');
        const clients = storedClients ? JSON.parse(storedClients) : [];
        return clients.some((client: any) => client.id === leadData.id);
    })();

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out ${
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out ${
                    isOpen
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-full opacity-0'
                }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">
                                Detalhes do Lead
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Profile */}
                    <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center space-x-4">
                            <img
                                className="w-16 h-16 rounded-2xl ring-4 ring-blue-100 shadow-lg"
                                src={
                                    leadData.image ||
                                    `https://ui-avatars.com/api/?name=${leadData.name}&background=random`
                                }
                                alt={leadData.name}
                            />
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {leadData.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Building className="w-4 h-4 text-gray-500" />
                                    <p className="text-gray-600 font-medium">
                                        {leadData.company}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                    Status
                                </label>
                            </div>
                            {isEditing ? (
                                <select
                                    value={editedData.status}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'status',
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="new">New</option>
                                    <option value="in contact">
                                        In Contact
                                    </option>
                                    <option value="qualified">Qualified</option>
                                    <option value="disqualified">
                                        Disqualified
                                    </option>
                                    <option value="closed">Closed</option>
                                </select>
                            ) : (
                                <span
                                    className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(
                                        leadData.status
                                    )}`}
                                >
                                    {leadData.status.charAt(0).toUpperCase() +
                                        leadData.status.slice(1)}
                                </span>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                    Pontuação
                                </label>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span
                                    className={`text-3xl font-bold ${getScoreColor(
                                        leadData.score
                                    )}`}
                                >
                                    {leadData.score}
                                </span>
                                <span className="text-gray-400 text-lg">
                                    /100
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-blue-500" />
                            Informações de Contato
                        </h4>
                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </label>
                                {isEditing ? (
                                    <div>
                                        <input
                                            type="email"
                                            value={editedData.email}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    'email',
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                                emailError
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-300'
                                            }`}
                                            placeholder="Digite o email do lead"
                                        />
                                        {emailError && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                <XCircle className="w-4 h-4" />
                                                {emailError}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <p className="text-gray-800 font-medium">
                                            {leadData.email}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                                    Fonte
                                </label>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                                        {leadData.source}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lead ID */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="text-xs text-gray-500 font-mono">
                            ID: {leadData.id}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                    {isEditing ? (
                        <div className="flex gap-3">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-semibold transition-all duration-200 ${
                                    isSaving
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg transform hover:-translate-y-0.5'
                                }`}
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200"
                            >
                                <XCircle className="w-4 h-4" />
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={handleConvertLead}
                                disabled={isAlreadyConverted}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-semibold transition-all duration-200 ${
                                    isAlreadyConverted
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                                }`}
                            >
                                <CheckCircle className="w-4 h-4" />
                                {isAlreadyConverted
                                    ? 'Já Convertido'
                                    : 'Converter Lead'}
                            </button>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex-1 flex items-center justify-center gap-2 border-2 border-blue-300 text-blue-700 py-3 px-6 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200"
                            >
                                <Edit3 className="w-4 h-4" />
                                Editar Lead
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
