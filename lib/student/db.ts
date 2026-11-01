import "server-only";
import {dirname,resolve} from "node:path";
import {mysqlDatabase,mysqlTransaction} from "../database/runtime";
export function studentDatabasePath(){return resolve(/*turbopackIgnore: true*/ process.env.STUDENT_DB_PATH||resolve(dirname(process.env.RESULTS_DB_PATH||"private/results.sqlite"),"students.sqlite"));}
export function studentDb(){return mysqlDatabase("students");}
export function studentTransaction<T>(action:()=>T|Promise<T>):Promise<T>{return mysqlTransaction("students",action);}
