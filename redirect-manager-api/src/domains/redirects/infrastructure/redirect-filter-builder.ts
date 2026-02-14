import {
    DestinationFilter,
    FilterOperator,
    RedirectFilter,
    SourceFilter,
    StatusCodeFilter,
    SupportedRedirectFilter
} from "../../../dtos";
import {RedirectStatusCode} from "../entities";
import {RedirectStatusCode as PrismaRedirectStatusCode} from "../../../generated/prisma/enums";
import {Prisma} from "../../../generated/prisma/client";

/**
 * Abstract base class for filter builders
 */
export abstract class BaseFilterBuilder<T extends RedirectFilter> {
    abstract buildWhereClause(filter: T): Prisma.RedirectWhereInput;
}

/**
 * Status code filter builder
 */
export class StatusCodeFilterBuilder extends BaseFilterBuilder<StatusCodeFilter> {
    buildWhereClause(filter: StatusCodeFilter): Prisma.RedirectWhereInput {
        const prismaValue = Array.isArray(filter.value) 
            ? filter.value.map(val => this.mapStatusCodeToPrisma(val))
            : this.mapStatusCodeToPrisma(filter.value);

        switch (filter.operator) {
            case FilterOperator.EQUALS:
                return { statusCode: prismaValue as PrismaRedirectStatusCode };
            case FilterOperator.NOT_EQUALS:
                return { statusCode: { not: prismaValue as PrismaRedirectStatusCode } };
            case FilterOperator.IN:
                return { statusCode: { in: prismaValue as PrismaRedirectStatusCode[] } };
            case FilterOperator.NOT_IN:
                return { statusCode: { notIn: prismaValue as PrismaRedirectStatusCode[] } };
            default:
                throw new Error(`Unsupported operator ${filter.operator} for statusCode filter`);
        }
    }

    private mapStatusCodeToPrisma(statusCode: RedirectStatusCode): PrismaRedirectStatusCode {
        switch (statusCode) {
            case RedirectStatusCode.STATUS_301:
                return PrismaRedirectStatusCode.STATUS_301;
            case RedirectStatusCode.STATUS_302:
                return PrismaRedirectStatusCode.STATUS_302;
            case RedirectStatusCode.STATUS_304:
                return PrismaRedirectStatusCode.STATUS_304;
            case RedirectStatusCode.STATUS_307:
                return PrismaRedirectStatusCode.STATUS_307;
            case RedirectStatusCode.STATUS_308:
                return PrismaRedirectStatusCode.STATUS_308;
            default:
                throw new Error(`Invalid status code: ${statusCode}`);
        }
    }
}

/**
 * Source filter builder
 */
export class SourceFilterBuilder extends BaseFilterBuilder<SourceFilter> {
    buildWhereClause(filter: SourceFilter): Prisma.RedirectWhereInput {
        switch (filter.operator) {
            case FilterOperator.EQUALS:
                return { source: filter.value };
            case FilterOperator.NOT_EQUALS:
                return { source: { not: filter.value } };
            case FilterOperator.CONTAINS:
                return { source: { contains: filter.value } };
            case FilterOperator.STARTS_WITH:
                return { source: { startsWith: filter.value } };
            case FilterOperator.ENDS_WITH:
                return { source: { endsWith: filter.value } };
            default:
                throw new Error(`Unsupported operator ${filter.operator} for source filter`);
        }
    }
}

/**
 * Destination filter builder
 */
export class DestinationFilterBuilder extends BaseFilterBuilder<DestinationFilter> {
    buildWhereClause(filter: DestinationFilter): Prisma.RedirectWhereInput {
        switch (filter.operator) {
            case FilterOperator.EQUALS:
                return { destination: filter.value };
            case FilterOperator.NOT_EQUALS:
                return { destination: { not: filter.value } };
            case FilterOperator.CONTAINS:
                return { destination: { contains: filter.value } };
            case FilterOperator.STARTS_WITH:
                return { destination: { startsWith: filter.value } };
            case FilterOperator.ENDS_WITH:
                return { destination: { endsWith: filter.value } };
            default:
                throw new Error(`Unsupported operator ${filter.operator} for destination filter`);
        }
    }
}

/**
 * Factory for creating filter builders
 */
export class FilterBuilderFactory {
    private static readonly builders = new Map<string, BaseFilterBuilder<any>>([
        ['statusCode', new StatusCodeFilterBuilder()],
        ['source', new SourceFilterBuilder()],
        ['destination', new DestinationFilterBuilder()]
    ]);

    static getBuilder<T extends RedirectFilter>(field: string): BaseFilterBuilder<T> {
        const builder = this.builders.get(field);
        if (!builder) {
            throw new Error(`No filter builder found for field: ${field}`);
        }
        return builder;
    }

    static addBuilder<T extends RedirectFilter>(field: string, builder: BaseFilterBuilder<T>): void {
        this.builders.set(field, builder);
    }
}

/**
 * Main filter builder class that combines all filters
 */
export class RedirectFilterBuilder {
    static buildWhereClause(filters: SupportedRedirectFilter[]): Prisma.RedirectWhereInput {
        if (filters.length === 0) {
            return {};
        }

        const whereConditions = filters.map(filter => {
            const builder = FilterBuilderFactory.getBuilder(filter.field);
            return builder.buildWhereClause(filter);
        });

        // Combine all conditions with AND
        return whereConditions.length === 1 
            ? whereConditions[0]
            : { AND: whereConditions };
    }
}