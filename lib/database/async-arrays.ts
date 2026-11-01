// Preserve synchronous callback order and short-circuiting while awaiting SQL.
export async function mapAsync<T,U>(items:readonly T[],fn:(item:T,index:number,array:readonly T[])=>U|Promise<U>):Promise<U[]> {const out:U[]=[];for(let i=0;i<items.length;i++)out.push(await fn(items[i],i,items));return out;}
export async function filterAsync<T>(items:readonly T[],fn:(item:T,index:number,array:readonly T[])=>unknown):Promise<T[]> {const out:T[]=[];for(let i=0;i<items.length;i++)if(await fn(items[i],i,items))out.push(items[i]);return out;}
export async function forEachAsync<T>(items:readonly T[],fn:(item:T,index:number,array:readonly T[])=>unknown):Promise<void> {for(let i=0;i<items.length;i++)await fn(items[i],i,items);}
export async function everyAsync<T>(items:readonly T[],fn:(item:T,index:number,array:readonly T[])=>unknown):Promise<boolean> {for(let i=0;i<items.length;i++)if(!await fn(items[i],i,items))return false;return true;}
