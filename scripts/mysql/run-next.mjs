// Keep credentials out of argv and avoid forwarding --env-file into Next build workers.
import {spawn} from 'node:child_process';
import {resolve} from 'node:path';
import {localEnvironment} from './local-env.mjs';
const environment=localEnvironment();
const args=process.argv.slice(2);if(!['build','start','dev'].includes(args[0]))throw Error('Choose build, start or dev');
const child=spawn(process.execPath,[resolve('node_modules/next/dist/bin/next'),...args],{cwd:process.cwd(),env:environment,stdio:'inherit',windowsHide:true});
child.on('exit',(code)=>{process.exitCode=code??1;});
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>child.kill(signal));
