export async function register(){
 if(process.env.NEXT_RUNTIME==="nodejs"&&process.env.NEXT_PHASE!=="phase-production-build"){
  const {startMaintenance}=await import("./lib/results/maintenance");(await startMaintenance());
  const {startRuntimeDiagnostics}=await import("./lib/results/runtime-diagnostics");startRuntimeDiagnostics();
  const state=globalThis as typeof globalThis&{mysqlShutdownInstalled?:boolean};
  if(!state.mysqlShutdownInstalled){state.mysqlShutdownInstalled=true;for(const signal of ['SIGTERM','SIGINT'])process.once(signal,()=>{void import('./lib/database/runtime').then(m=>m.closeMysql()).catch(()=>console.error('MySQL pool shutdown could not be confirmed.'));});}
 }
}
