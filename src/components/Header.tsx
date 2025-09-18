import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';
import { useContext } from 'react';
import { LeadsContext } from '../context/LeadsContext';
import { LoadingSpinner, ErrorMessage } from './LoadingComponents';

export function Header() {
    const { leads, isLoading, error, reloadLeads } = useContext(LeadsContext);

    const stats = {
        totalLeads: leads.length,
        qualifiedLeads: leads.filter(
            (lead) => lead.status.toLowerCase() === 'qualified'
        ).length,
        averageScore:
            Math.round(
                leads.reduce((acc, lead) => acc + lead.score, 0) / leads.length
            ) || 0,
        totalValue: leads.reduce((acc, lead) => acc + (lead.value || 0), 0),
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-8 mb-8 text-white shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                            <TrendingUp className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                Mini Seller Console
                            </h1>
                            <p className="text-blue-200 mt-2 text-lg">
                                Manage your leads and prospects intelligently
                            </p>
                        </div>
                    </div>

                    {isLoading && (
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                            <LoadingSpinner size="sm" className="text-white" />
                            <span className="text-white text-sm">
                                Loading...
                            </span>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-6">
                        <ErrorMessage
                            message={error}
                            onRetry={reloadLeads}
                            className="bg-red-900/30 border-red-400/30 backdrop-blur-sm"
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={Users}
                        label="All Leads"
                        value={stats.totalLeads}
                        isLoading={isLoading}
                        iconBg="bg-blue-500/30"
                    />

                    <StatCard
                        icon={Target}
                        label="Qualified"
                        value={stats.qualifiedLeads}
                        isLoading={isLoading}
                        iconBg="bg-green-500/30"
                    />

                    <StatCard
                        icon={TrendingUp}
                        label="Average Score"
                        value={`${stats.averageScore}/100`}
                        isLoading={isLoading}
                        iconBg="bg-yellow-500/30"
                    />

                    <StatCard
                        icon={DollarSign}
                        label="Total Value"
                        value={`$${stats.totalValue.toLocaleString()}`}
                        isLoading={isLoading}
                        iconBg="bg-purple-500/30"
                    />
                </div>
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
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center space-x-4">
                <div className={`p-3 ${iconBg} rounded-xl`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-blue-200 text-sm font-medium">{label}</p>
                    <div className="text-3xl font-bold">
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
