import {
    DestinationFilter,
    DestinationFilterOperator,
    FilterOperator,
    RedirectFilterParams,
    SourceFilter,
    SourceFilterOperator,
    StatusCodeFilter,
    SupportedRedirectFilter
} from "./redirect-filters.types";
import {FilterParsingError} from "./filter-parsing.error";
import {RedirectStatusCode} from "../../domains/redirects";

/**
 * Parser for converting query parameters to filter objects
 */
export class RedirectFilterParser {
    private static readonly DEFAULT_OPERATOR = FilterOperator.EQUALS;

    /**
     * Parse filter parameters from query string into filter objects
     */
    static parseFilters(params: RedirectFilterParams): SupportedRedirectFilter[] {
        const filters: SupportedRedirectFilter[] = [];

        // Parse status code filter
        if (params.statusCode) {
            filters.push(this.parseStatusCodeFilter(params.statusCode, params.statusCodeOp));
        }

        // Parse source filter
        if (params.source) {
            filters.push(this.parseSourceFilter(params.source, params.sourceOp));
        }

        // Parse destination filter
        if (params.destination) {
            filters.push(this.parseDestinationFilter(params.destination, params.destinationOp));
        }

        return filters;
    }

    private static parseStatusCodeFilter(value: string, operatorStr?: string): StatusCodeFilter {
        const operator = this.parseOperator(operatorStr, [
            FilterOperator.EQUALS,
            FilterOperator.NOT_EQUALS,
            FilterOperator.IN,
            FilterOperator.NOT_IN
        ]);

        // Handle multiple values for IN/NOT_IN operators
        const values = value.includes(',') ? value.split(',') : [value];
        const statusCodes = values.map(val => this.parseStatusCode(val.trim()));

        return {
            field: 'statusCode',
            operator,
            value: operator === FilterOperator.IN || operator === FilterOperator.NOT_IN
                ? statusCodes
                : statusCodes[0]
        } as StatusCodeFilter;
    }

    private static parseSourceFilter(value: string, operatorStr?: string): SourceFilter {
        const operator = this.parseOperator(operatorStr, [
            FilterOperator.EQUALS,
            FilterOperator.NOT_EQUALS,
            FilterOperator.CONTAINS,
            FilterOperator.STARTS_WITH,
            FilterOperator.ENDS_WITH
        ]) as SourceFilterOperator;

        return {
            field: 'source',
            operator,
            value: value.trim()
        };
    }

    private static parseDestinationFilter(value: string, operatorStr?: string): DestinationFilter {
        const operator = this.parseOperator(operatorStr, [
            FilterOperator.EQUALS,
            FilterOperator.NOT_EQUALS,
            FilterOperator.CONTAINS,
            FilterOperator.STARTS_WITH,
            FilterOperator.ENDS_WITH
        ]) as DestinationFilterOperator;

        return {
            field: 'destination',
            operator,
            value: value.trim()
        };
    }

    private static parseOperator(operatorStr: string | undefined, allowedOperators: FilterOperator[]): FilterOperator {
        if (!operatorStr) {
            return this.DEFAULT_OPERATOR;
        }

        const operator = operatorStr as FilterOperator;
        if (!Object.values(FilterOperator).includes(operator)) {
            throw FilterParsingError.invalidOperator(operatorStr);
        }

        if (!allowedOperators.includes(operator)) {
            throw FilterParsingError.unsupportedOperator(operatorStr, 'filter field');
        }

        return operator;
    }

    private static parseStatusCode(value: string): RedirectStatusCode {
        // Handle both numeric (301, 302) and enum string (STATUS_301, STATUS_302) formats
        const normalizedValue = value.toUpperCase();

        if (normalizedValue === '301' || normalizedValue === 'STATUS_301') {
            return RedirectStatusCode.STATUS_301;
        }
        if (normalizedValue === '302' || normalizedValue === 'STATUS_302') {
            return RedirectStatusCode.STATUS_302;
        }
        if (normalizedValue === '304' || normalizedValue === 'STATUS_304') {
            return RedirectStatusCode.STATUS_304;
        }
        if (normalizedValue === '307' || normalizedValue === 'STATUS_307') {
            return RedirectStatusCode.STATUS_307;
        }
        if (normalizedValue === '308' || normalizedValue === 'STATUS_308') {
            return RedirectStatusCode.STATUS_308;
        }

        throw FilterParsingError.invalidStatusCode(value);
    }

    /**
     * Validate filter parameters
     */
    static validateFilterParams(params: RedirectFilterParams): void {
        try {
            this.parseFilters(params);
        } catch (error) {
            throw FilterParsingError.invalidFilterParameters((error as Error).message);
        }
    }
}