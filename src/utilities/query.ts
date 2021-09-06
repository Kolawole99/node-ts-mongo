import { QueryBuildQueryResponse } from '../datatypes/customIntegrations';

export const buildSortOrderString = (value: string): string => value.replace(/,/gi, ' ');

export const buildReturnFieldsString = (value: string): string => value.replace(/,/gi, ' ');

export const determinePagination = (
    page: number,
    population: number,
): { limit: number; skip: number } => ({
    limit: Number(population),
    skip: page * population,
});

export const buildInQuery = (value: string): { $in: Array<unknown> } => {
    const values = value.split(':');
    return { $in: [...values] };
};

export const buildNorQuery = (value: string): { $nin: Array<unknown> } => {
    const values = value.split('!');
    return { $nin: [...values.slice(1)] };
};

export const buildRangeQuery = (value: string): { $gte: number; $lte: number } => {
    const values = value.split('~');
    return {
        $gte: values[0] ? Number(values[0]) : Number.MIN_SAFE_INTEGER,
        $lte: values[1] ? Number(values[1]) : Number.MAX_SAFE_INTEGER,
    };
};

export const buildOrQuery = (value: string): { $in: Array<unknown> } => {
    const values = value.split(',');
    return { $in: [...values] };
};

export const buildQuery = (options: Record<string, unknown>): QueryBuildQueryResponse => {
    const sortCondition = options.sortBy ? buildSortOrderString(options.sortBy as string) : '';
    const fieldsToReturn = options.returnOnly
        ? buildReturnFieldsString(options.returnOnly as string)
        : '';
    const allowedToCount: boolean = (options.count as boolean) || false;

    let skip = 0;
    let limit = Number.MAX_SAFE_INTEGER;

    if ((options.page as number) >= 0 && options.population) {
        const pagination = determinePagination(
            options.page as number,
            options.population as number,
        );
        limit = pagination.limit;
        skip = pagination.skip;
    }

    /** Delete sort and return fields */
    const { count, page, population, returnOnly, sortBy, ...remainingQueryItems } = options;

    const seekConditions: Record<string, unknown> = {};
    Object.keys(remainingQueryItems).forEach((field) => {
        const hasProperty: boolean = Object.prototype.hasOwnProperty.call(
            remainingQueryItems,
            field,
        );

        const fieldValue =
            hasProperty === true
                ? (remainingQueryItems[field as keyof typeof remainingQueryItems] as string)
                : '';
        fieldValue.toLowerCase();

        if (fieldValue !== '') {
            let condition;
            if (fieldValue.includes(':')) {
                condition = buildInQuery(fieldValue);
            } else if (fieldValue.includes('!')) {
                condition = buildNorQuery(fieldValue);
            } else if (fieldValue.includes('~')) {
                condition = buildRangeQuery(fieldValue);
            } else {
                condition = buildOrQuery(fieldValue);
            }

            seekConditions[field] = { ...condition };
        }
    });

    return {
        count: allowedToCount,
        fieldsToReturn,
        limit,
        seekConditions,
        skip,
        sortCondition,
    };
};

export const buildWildcardOptions = (keyList: string, value: string): { $or: unknown } => {
    const keys = keyList.split(',');
    return {
        $or: keys.map((key) => ({
            [key]: {
                $regex: `${value}`,
                $options: 'i',
            },
        })),
    };
};
