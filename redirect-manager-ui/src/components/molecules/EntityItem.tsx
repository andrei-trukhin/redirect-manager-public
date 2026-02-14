import React, {type ReactNode} from "react";
import {Calendar, Clock} from "lucide-react";
import {Checkbox} from "../atoms";

export interface EntityItemProps {
    header: ReactNode;
    actions?: ReactNode;
    createdAt?: string;
    updatedAt?: string;
    lastUsedAt?: string;
    selected?: boolean;
    onSelected?: (selected: boolean) => void;
}

const EntityItem: React.FC<EntityItemProps> = ({header, actions, createdAt, updatedAt, lastUsedAt, selected, onSelected}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div
            className={`flex items-start justify-between p-5 border-b transition-all duration-200 relative ${
                selected 
                    ? 'bg-blue-50/40 border-blue-300/40 ring-1 ring-inset ring-blue-300 z-10' 
                    : 'border-gray-200 hover:bg-gray-50'
            }`}>
            {onSelected && (
                <div className="flex items-center pr-4 mr-2 pt-1">
                    <Checkbox
                        checked={selected}
                        onChange={(e) => onSelected(e.target.checked)}
                    />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 mr-20 min-w-0">
                    {header}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    {createdAt && (
                        <div className="flex items-center gap-1 mr-4">
                            <Calendar className="w-4 h-4"/>
                            Created: {formatDate(createdAt)}
                        </div>
                    )}
                    {updatedAt && (
                        <div className="flex items-center gap-1 mr-4">
                            <Calendar className="w-4 h-4"/>
                            Updated: {formatDate(updatedAt)}
                        </div>
                    )}
                    {lastUsedAt && (
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4"/>
                            Last used: {formatDate(lastUsedAt)}
                        </div>
                    )}
                </div>
            </div>
            {actions ?
                <div className="flex items-center gap-2 pt-1">
                    {actions}
                </div> :
                null
            }
        </div>
    );
}

export default EntityItem;
