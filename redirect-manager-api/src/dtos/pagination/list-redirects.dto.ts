import {EnumProperty, IntegerProperty, NumberProperty, StringProperty} from "bookish-potato-dto";
import {PaginationType, SortField, SortOrder} from "./pagination.types";
import {RedirectFilterParams} from "../filters";

export class ListRedirectsDto implements RedirectFilterParams {
    @EnumProperty(PaginationType, {
        isOptional: true,
        defaultValue: PaginationType.OFFSET,
        useDefaultValueOnParseError: true
    })
    readonly paginationType!: PaginationType;

    // Offset pagination parameters
    @IntegerProperty({
        isOptional: true,
        defaultValue: 1,
        useDefaultValueOnParseError: true,
        minValue: 1
    })
    readonly page!: number;

    @IntegerProperty({
        isOptional: true,
        defaultValue: 10,
        useDefaultValueOnParseError: true,
        minValue: 1,
        maxValue: 100
    })
    readonly limit!: number;

    // Cursor pagination parameters
    @NumberProperty({
        isOptional: true,
        isNullable: true,
        defaultValue: null,
        useDefaultValueOnParseError: true
    })
    readonly cursor?: string | null;

    @NumberProperty({
        isOptional: true,
        defaultValue: 10,
        useDefaultValueOnParseError: true,
        minValue: 1,
        maxValue: 100
    })
    readonly first!: number;

    // Common sorting parameters
    @EnumProperty(SortField, {
        isOptional: true,
        defaultValue: SortField.ID,
        useDefaultValueOnParseError: true
    })
    readonly sortBy!: SortField;

    @EnumProperty(SortOrder, {
        isOptional: true,
        defaultValue: SortOrder.ASC,
        useDefaultValueOnParseError: true
    })
    readonly sortOrder!: SortOrder;

    // Filter parameters
    @StringProperty({
        isOptional: true,
        isNullable: true
    })
    readonly statusCode?: string;

    @StringProperty({
        isOptional: true,
        isNullable: true
    })
    readonly statusCodeOp?: string;

    @StringProperty({
        isOptional: true,
        isNullable: true
    })
    readonly source?: string;

    @StringProperty({
        isOptional: true,
        isNullable: true
    })
    readonly sourceOp?: string;

    @StringProperty({
        isOptional: true,
        isNullable: true
    })
    readonly destination?: string;

    @StringProperty({
        isOptional: true,
        isNullable: true
    })
    readonly destinationOp?: string;
}