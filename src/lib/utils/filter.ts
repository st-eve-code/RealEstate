export const unde_find = <T>(obj: T): T => {
    // 1. Handle Arrays
    if (Array.isArray(obj)) {
        return obj
            .filter((v) => v !== undefined)
            .map((v) => unde_find(v)) as any;
    }

    // 2. Escape Hatch: Handle Non-Objects and Class Instances
    // - typeof obj !== 'object': Handles primitives
    // - obj === null: Handles null
    // - obj.constructor !== Object: Excludes custom classes (Timestamp, Date, etc.)
    if (
        typeof obj !== 'object' || 
        obj === null || 
        (obj.constructor !== Object && Object.getPrototypeOf(obj) !== null)
    ) {
        return obj;
    }

    // 3. Handle Plain Objects Recursively
    return Object.fromEntries(
        Object.entries(obj)
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => [k, unde_find(v)])
    ) as any;
};
