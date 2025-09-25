import React from 'react';

interface HeaderProps {
    title: string | null;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {title ? (
                        <h2 className="text-2xl font-semibold text-text">{title}</h2>
                    ) : (
                        <div className="flex items-center gap-1" aria-label="TrendsAI Logo">
                            <span className="material-icons text-primary text-3xl">analytics</span>
                            <div className="flex items-baseline text-xl">
                               <span className="font-semibold text-text tracking-tight">Trends</span>
                               <span className="font-bold text-primary tracking-tight">AI</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center">
                    <button 
                        className="p-2 rounded-full text-text-secondary hover:bg-slate-100 hover:text-text transition-colors"
                        aria-label="Dúvidas"
                    >
                        <span className="material-icons">help_outline</span>
                    </button>
                </div>
            </div>
        </header>
    );
};