import React from 'react';
import EmptyState from './EmptyState';

export interface EntitiesListProps {
    children: React.ReactNode;
    isLoading?: boolean;
    isEmpty?: boolean;
    emptyIcon?: React.ReactNode;
    emptyMessage?: string;
    skeletonCount?: number;
}

const EntitiesList: React.FC<EntitiesListProps> = ({
    children,
    isLoading,
    isEmpty,
    emptyIcon,
    emptyMessage,
    skeletonCount = 3
}) => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: skeletonCount }).map((_, i) => (
                    <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
                ))}
            </div>
        );
    }

    if (isEmpty) {
        return (
            <EmptyState
                icon={emptyIcon}
                message={emptyMessage || "No entities found."}
            />
        );
    }

    return (
        <div className="space-y-4">
            {children}
        </div>
    );
};

export default EntitiesList;

