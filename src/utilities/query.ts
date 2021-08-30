export const determinePagination = (page: number, population: number) => ({
    limit: Number(population),
    skip: page * population,
});

export const buildReturnFieldsString = (value: string) => value.replace(/,/gi, ' ');

export const buildSortOrderString = (value: string) => value.replace(/,/gi, ' ');

export const buildInQuery = (value: string) => {
    const values = value.split(':');
    return { $in: [...values] };
};

export const buildNorQuery = (value: string) => {
    const values = value.split('!');
    return { $nin: [...values.slice(1)] };
};

export const buildOrQuery = (value: string) => {
    const values = value.split(',');
    return { $in: [...values] };
};

export const buildRangeQuery = (value: string) => {
    const values = value.split('~');
    return {
        $gte: values[0] ? Number(values[0]) : Number.MIN_SAFE_INTEGER,
        $lte: values[1] ? Number(values[1]) : Number.MAX_SAFE_INTEGER,
    };
};

export const buildWildcardOptions = (keyList: string, value: string) => {
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

export const buildQuery = (options: any) => {
    let seekConditions: any;
    const sortCondition = options.sortBy ? buildSortOrderString(options.sortBy) : '';
    const fieldsToReturn = options.returnOnly ? buildReturnFieldsString(options.returnOnly) : '';
    const count = options.count || false;

    let skip = 0;
    let limit = Number.MAX_SAFE_INTEGER;

    if (options.page >= 0 && options.population) {
        const pagination = determinePagination(options.page, options.population);
        limit = pagination.limit;
        skip = pagination.skip;
    }

    /** Delete sort and return fields */
    delete options.count;
    delete options.page;
    delete options.population;
    delete options.returnOnly;
    delete options.sortBy;

    Object.keys(options).forEach((field) => {
        const hasProperty = Object.prototype.hasOwnProperty.call(options, field);
        const fieldValue = hasProperty === true ? options[field].toLowerCase() : '';

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
        count,
        fieldsToReturn,
        limit,
        seekConditions,
        skip,
        sortCondition,
    };
};
