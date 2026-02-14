export class FilterParsingError extends Error {
    constructor(message: string, public readonly field?: string, public readonly operator?: string, public readonly value?: string) {
        super(message);
        this.name = 'FilterParsingError';
    }

    static invalidOperator(operator: string): FilterParsingError {
        return new FilterParsingError(`Invalid filter operator: ${operator}`, undefined, operator);
    }

    static unsupportedOperator(operator: string, field: string): FilterParsingError {
        return new FilterParsingError(`Operator ${operator} is not supported for this field`, field, operator);
    }

    static invalidStatusCode(value: string): FilterParsingError {
        return new FilterParsingError(`Invalid status code: ${value}`, 'statusCode', undefined, value);
    }

    static invalidFilterParameters(originalError: string): FilterParsingError {
        return new FilterParsingError(`Invalid filter parameters: ${originalError}`);
    }
}