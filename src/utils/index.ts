import type { Lead } from '../types';

export const simulateApiCall = (
    ms: number = 800,
    failureRate: number = 0.1
): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < failureRate) {
                reject(new Error('Network error occurred'));
            } else {
                resolve();
            }
        }, ms);
    });
};

export const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const getStatusColor = (status: string): string => {
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

export const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-emerald-600 font-bold';
    if (score >= 60) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
};

export const getStepColor = (step: string): string => {
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

export const getImageUrl = (lead: Lead): string => {
    return (
        lead.image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            lead.name
        )}&background=4f46e5&color=ffffff&bold=true&size=128`
    );
};

export const safeLocalStorage = {
    getItem: (key: string): string | null => {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    setItem: (key: string, value: string): boolean => {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },

    removeItem: (key: string): boolean => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },
};
