import React from 'react';
import {useNavigate} from 'react-router-dom';
import EntityItem from './EntityItem';
import {Button} from "../atoms";
import {ArrowRightFromLine, ArrowRightToLine, FileSearch, Globe, LaptopMinimal} from "lucide-react";
import DetailField from "./DetailField.tsx";

interface RedirectRowProps {
    id: string;
    source: string;
    destination: string;
    httpCode: string | number;
    domain?: string | null;
    createdAt?: string;
    updatedAt?: string;
    selected?: boolean;
    onSelected?: (selected: boolean) => void;
}

const RedirectRow: React.FC<RedirectRowProps> = ({
                                                     id,
                                                     source,
                                                     destination,
                                                     httpCode,
                                                     domain,
                                                     createdAt,
                                                     updatedAt,
                                                     selected,
                                                     onSelected,
                                                 }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/redirects/${id}`);
    };

    const header = (
        <div className="grid grid-cols-1 md:grid-cols-[0.5fr_1fr_1fr_1fr] gap-4 w-full mb-4">
            <DetailField
                label="Code"
                value={httpCode.toString()}
                icon={LaptopMinimal}/>
            <DetailField
                label="Source"
                value={source}
                icon={ArrowRightToLine}
                canCopy/>
            <DetailField
                label="Destination"
                value={destination}
                icon={ArrowRightFromLine}
                canCopy/>
            <DetailField
                label="Domain"
                value={domain || undefined}
                icon={Globe}
                iconClassName={domain ? "text-blue-500" : ""}
                canCopy={!!domain}
            />
        </div>
    );

    const actions = (
        <div className="content-start">
            <Button
                size="sm"
                variant="outline"
                onClick={handleClick}
                className="flex items-center gap-2"
                title="Edit Redirect"
            >
                <FileSearch/>
                Details
            </Button>
        </div>
    );

    return (
        <EntityItem
            header={header}
            actions={actions}
            createdAt={createdAt}
            updatedAt={updatedAt}
            selected={selected}
            onSelected={onSelected ? (selected) => onSelected(selected) : undefined}
        />
    );
};

export default RedirectRow;
