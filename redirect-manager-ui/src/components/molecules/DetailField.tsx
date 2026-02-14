import React, {useState} from 'react';
import {Check, Copy, type LucideIcon} from "lucide-react";

export interface DetailFieldProps {
    label: string;
    value?: string;
    hint?: string;
    icon?: LucideIcon;
    iconClassName?: string;
    canCopy?: boolean;
}

const DetailField: React.FC<DetailFieldProps> = ({
                                                     label,
                                                     value,
                                                     hint,
                                                     icon: Icon,
                                                     iconClassName,
                                                     canCopy
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        if (!canCopy || !value) return;

        e.stopPropagation();
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && canCopy && value) {
            e.preventDefault();
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const className = `flex flex-col items-start text-left w-full min-w-0 p-3 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-blue-200 transition-all duration-200 relative group ${canCopy ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20' : ''}`;

    const content = (
        <>
            {canCopy && value && (
                <div className="absolute top-2 right-2 text-gray-400 group-hover:text-blue-500 transition-colors flex items-center gap-1 bg-white/50 px-1 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100">
                    {copied ? (
                        <Check className="w-3 h-3 text-green-600"/>
                    ) : (
                        <Copy className="w-3 h-3"/>
                    )}
                </div>
            )}
            <div className="flex items-center gap-1.5 text-gray-400 mb-1.5">
                {Icon ? <Icon size={14} className={iconClassName}/> : null}
                <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            </div>
            <span className="text-sm text-gray-900 truncate font-semibold leading-none w-full" title={value || undefined}>{value || <span className="italic text-gray-400 font-normal">None</span>}</span>
            {hint && (
                <span className="text-sm text-gray-500 mt-1 truncate italic w-full" title={hint}>
                  {hint}
                </span>
            )}
        </>
    );

    if (canCopy) {
        return (
            <button
                type="button"
                onClick={handleCopy}
                onKeyDown={handleKeyDown}
                className={className}
            >
                {content}
            </button>
        );
    }

    return (
        <div className={`${className} gap-1`}>
            {content}
        </div>
    );
};

export default DetailField;
