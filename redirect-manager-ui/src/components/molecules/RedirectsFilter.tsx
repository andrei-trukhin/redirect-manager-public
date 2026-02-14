import React, { useState } from 'react';
import Select from '../atoms/Select';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import type { FilterProps } from "../../services/redirects.service.ts";

const RedirectsFilter: React.FC<RedirectsFilterProps> = ({ onFilter, initialValues, className = '' }) => {
    const [statusCode, setStatusCode] = useState(initialValues?.statusCode);
    const [source, setSource] = useState(initialValues?.source || '');
    const [destination, setDestination] = useState(initialValues?.destination || '');

    const handleStatusCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusCode(Number.parseInt(e.target.value) || undefined);
    };

    const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSource(e.target.value);
    };

    const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDestination(e.target.value);
    };

    const handleSubmit = () => {
        onFilter({
            statusCode,
            source: source.trim() || undefined,
            destination: destination.trim() || undefined,
        });
    };

    const handleClear = () => {
        setStatusCode(undefined);
        setSource('');
        setDestination('');
        onFilter({});
    };

    return (
        <div className={`${className} bg-white border border-gray-300 rounded-lg p-4`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Input
                    label="Source URL"
                    name="source"
                    type="text"
                    placeholder="Enter source URL..."
                    value={source}
                    onChange={handleSourceChange}
                    helperText="Filter by source URL (partial match)"
                />

                <Input
                    label="Destination URL"
                    name="destination"
                    type="text"
                    placeholder="Enter destination URL..."
                    value={destination}
                    onChange={handleDestinationChange}
                    helperText="Filter by destination URL (partial match)"
                />

                <Select
                    name="statusCode"
                    label="HTTP Status Code"
                    value={statusCode?.toString() || ''}
                    onChange={handleStatusCodeChange}
                    helperText="Filter by HTTP status code"
                >
                    <option value={undefined}>All Status Codes</option>
                    <option value={301}>301 - Moved Permanently</option>
                    <option value={302}>302 - Found (Temporary)</option>
                    <option value={304}>304 - Not Modified</option>
                    <option value={307}>307 - Temporary Redirect</option>
                    <option value={308}>308 - Permanent Redirect</option>
                </Select>
            </div>

            <div className="flex gap-2 justify-end">
                <Button variant="ghost-secondary" onClick={handleClear}>
                    Clear Filters
                </Button>
                <Button onClick={handleSubmit} variant="ghost-primary">
                    Apply Filters
                </Button>
            </div>
        </div>

    );
};



type RedirectsFilterProps = {
    onFilter: (props: FilterProps) => void;
    initialValues?: FilterProps;
    className?: string;
};

export default RedirectsFilter;