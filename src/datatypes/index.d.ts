declare class Stringified<T> extends String {
    private ___stringified: T;
}

interface JSON {
    stringify<T>(
        value: T,
        replacer?: (key: string, value: unknown) => unknown,
        space?: string | number,
    ): string & Stringified<T>;
    parse<T>(text: Stringified<T>, reviver?: (key: unknown, value: unknown) => unknown): T;
    parse(text: string, reviver?: (key: unknown, value: unknown) => unknown): unknown;
}
