export const unde_find: (obj:any)=>any = (obj:any) => {
    if(Array.isArray(obj)) {
        return obj.filter(v => v !== undefined).map(v => unde_find(v));
    }
    if(typeof obj !== 'object' || obj === null) {
        return obj;
    }
    return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );
}