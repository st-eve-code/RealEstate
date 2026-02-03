export const unde_find = (obj: any): any => {
    // 1. Handle Arrays (Already recursive in your version)
    if (Array.isArray(obj)) {
        return obj.filter(v => v !== undefined).map(v => unde_find(v));
    }

    // 2. Handle Non-Objects/Null
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    // 3. Handle Objects (Added recursion here)
    return Object.fromEntries(
        Object.entries(obj)
            .filter(([_, v]) => v !== undefined) // Remove top-level undefined
            .map(([k, v]) => [k, unde_find(v)])   // RECURSIVELY clean the values we kept
    );
}