import { useState } from 'react';
import { Users, Target } from 'lucide-react';
import { Table } from './components/Table';
import { Header } from './components/Header';
import { ClientsTable } from './components/ClientsTable';
import { LeadsProvider } from './provider/LeadsProvider';
import type { TabType } from './types';

export function App() {
    const [activeTab, setActiveTab] = useState<TabType>('leads');

    return (
        <LeadsProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col max-w-[1920px] mx-auto p-6">
                <Header />

                <div className="flex gap-2 mb-6">
                    <button
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm cursor-pointer ${
                            activeTab === 'leads'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('leads')}
                    >
                        <Users className="w-5 h-5" />
                        Leads
                        {activeTab === 'leads' && (
                            <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                                Active
                            </span>
                        )}
                    </button>

                    <button
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm cursor-pointer ${
                            activeTab === 'clients'
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('clients')}
                    >
                        <Target className="w-5 h-5" />
                        Prospects
                        {activeTab === 'clients' && (
                            <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                                Active
                            </span>
                        )}
                    </button>
                </div>

                <div className="flex-1 transition-all duration-300 ease-in-out">
                    {activeTab === 'leads' ? (
                        <div className="animate-fadeIn">
                            <Table />
                        </div>
                    ) : (
                        <div className="animate-fadeIn">
                            <ClientsTable />
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </LeadsProvider>
    );
}
