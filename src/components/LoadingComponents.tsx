import { Loader2, AlertCircle, Search } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LoadingSpinner({
    size = 'md',
    className = '',
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    return (
        <Loader2 className={`${sizeClasses[size]} animate-spin ${className}`} />
    );
}

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorMessage({
    message,
    onRetry,
    className = '',
}: ErrorMessageProps) {
    return (
        <div
            className={`bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 ${className}`}
        >
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
                <p className="text-red-800 font-medium">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-2 text-red-600 hover:text-red-800 underline text-sm transition-colors"
                    >
                        Try again
                    </button>
                )}
            </div>
        </div>
    );
}

interface LoadingTableProps {
    rows?: number;
    columns?: number;
}

export function LoadingTable({ rows = 5, columns = 7 }: LoadingTableProps) {
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-64 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                        <div className="w-32 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                    </div>
                    <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {Array.from({ length: columns }).map((_, index) => (
                                <th key={index} className="text-left p-4">
                                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                                {Array.from({ length: columns }).map(
                                    (_, colIndex) => (
                                        <td key={colIndex} className="p-4">
                                            <div className="flex items-center space-x-3">
                                                {colIndex === 0 && (
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                                                )}
                                                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                                            </div>
                                        </td>
                                    )
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function EmptyState({
    title,
    description,
    icon: Icon = Search,
}: {
    title: string;
    description: string;
    icon?: React.ComponentType<any>;
}) {
    return (
        <div className="text-center py-16">
            <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-100 rounded-full">
                    <Icon className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-500">{description}</p>
                </div>
            </div>
        </div>
    );
}

export function LoadingCard() {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm animate-pulse">
            <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                <div className="flex-1">
                    <div className="w-32 h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="w-full h-4 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}

interface InlineLoadingProps {
    text?: string;
}

export function InlineLoading({ text = 'Loading...' }: InlineLoadingProps) {
    return (
        <div className="flex items-center gap-2 text-gray-600">
            <LoadingSpinner size="sm" />
            <span className="text-sm">{text}</span>
        </div>
    );
}
