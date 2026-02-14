import {RedirectStatusCode} from "../../domains/redirects";


/**
 * Base interface for all redirect filters
 */
export interface RedirectFilter {
    readonly field: string;
    readonly operator: FilterOperator;
    readonly value: any;
}

/**
 * Available filter operators
 */
export enum FilterOperator {
    EQUALS = 'eq',
    NOT_EQUALS = 'ne',
    CONTAINS = 'contains',
    STARTS_WITH = 'startsWith',
    ENDS_WITH = 'endsWith',
    IN = 'in',
    NOT_IN = 'notIn'
}

/**
 * Allowed operators for status code filtering
 */
export type StatusCodeFilterOperator = FilterOperator.EQUALS | FilterOperator.NOT_EQUALS | FilterOperator.IN | FilterOperator.NOT_IN;

/**
 * Allowed operators for source filtering
 */
export type SourceFilterOperator = FilterOperator.EQUALS | FilterOperator.NOT_EQUALS | FilterOperator.CONTAINS | FilterOperator.STARTS_WITH | FilterOperator.ENDS_WITH;

/**
 * Allowed operators for destination filtering
 */
export type DestinationFilterOperator = FilterOperator.EQUALS | FilterOperator.NOT_EQUALS | FilterOperator.CONTAINS | FilterOperator.STARTS_WITH | FilterOperator.ENDS_WITH;

/**
 * Status code filter
 */
export interface StatusCodeFilter extends RedirectFilter {
    readonly field: 'statusCode';
    readonly operator: StatusCodeFilterOperator;
    readonly value: RedirectStatusCode | RedirectStatusCode[];
}

/**
 * Source filter
 */
export interface SourceFilter extends RedirectFilter {
    readonly field: 'source';
    readonly operator: SourceFilterOperator;
    readonly value: string;
}

/**
 * Destination filter
 */
export interface DestinationFilter extends RedirectFilter {
    readonly field: 'destination';
    readonly operator: DestinationFilterOperator;
    readonly value: string;
}

/**
 * Union type for all supported redirect filters
 */
export type SupportedRedirectFilter = StatusCodeFilter | SourceFilter | DestinationFilter;

/**
 * Filter query parameters interface
 */
export interface RedirectFilterParams {
    readonly statusCode?: string;
    readonly statusCodeOp?: string;
    readonly source?: string;
    readonly sourceOp?: string;
    readonly destination?: string;
    readonly destinationOp?: string;
}