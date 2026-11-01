import "server-only";
import {resolve} from "node:path";
import {mysqlDatabase,mysqlTransaction} from "../database/runtime";
// Retained for private backup/media path configuration; no SQLite connection is opened.
export function databasePath(){return resolve(/*turbopackIgnore: true*/ process.env.RESULTS_DB_PATH||"private/results.sqlite");}
export function db(){return mysqlDatabase("results");}
export function transaction<T>(action:()=>T|Promise<T>):Promise<T>{return mysqlTransaction("results",action);}
