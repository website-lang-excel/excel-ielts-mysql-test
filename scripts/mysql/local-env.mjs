import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {parseEnv} from 'node:util';
export function localEnvironment(){const file=['.env.mysql.private','.env.local'].map(f=>resolve(f)).find(existsSync);if(!file)throw Error('Private local MySQL environment file is missing.');const env={...process.env,...parseEnv(readFileSync(file,'utf8')),NEXT_TELEMETRY_DISABLED:'1'};for(const key of Object.keys(env))if(key.startsWith('RAILWAY_'))delete env[key];return env;}
export function localMetadata(){const file=resolve('.local-mysql.json');if(!existsSync(file))throw Error('Local MySQL runtime metadata is missing.');return JSON.parse(readFileSync(file,'utf8'));}
