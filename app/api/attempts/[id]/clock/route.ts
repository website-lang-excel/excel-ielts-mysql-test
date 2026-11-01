import { actor, body, candidatePayload, endpoint, reject, reply } from "@/lib/results/http";
import { db, transaction } from "@/lib/results/db";
import { requireLease, requireSection } from "@/lib/results/lifecycle";
import { authorizeAttempt } from "@/lib/results/assignments";
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}) {return endpoint(async()=>{
 const user=await actor("student",request),b=await body(request),{id}=await params;candidatePayload(b);
 if(b.skill!=="reading"&&b.skill!=="writing")reject(400,"Invalid timed section.");
 const skill=b.skill;
 const deadline=(await transaction(async ()=>{
  const row=(await db().prepare("SELECT * FROM attempts WHERE id=? AND student_id=?").get(id,user.id));if(!row)reject(404,"Attempt not found.");(await authorizeAttempt(user,row));(await requireLease(row,request.headers.get("x-ielts-tab")));const state=(await requireSection(row,skill));if(b.testId!==row.test_id)reject(400,"Wrong test.");
  const draft=row.data?JSON.parse(String(row.data)):{};draft.sectionClocks??={};
  if(!draft.sectionClocks[skill]){draft.sectionClocks[skill]=state.deadline||Date.now()+3600000;(await db().prepare("UPDATE attempt_progress SET deadline=? WHERE attempt_id=?").run(draft.sectionClocks[skill],id));(await db().prepare("UPDATE attempts SET data=? WHERE id=?").run(JSON.stringify(draft),id));}
  return Number(draft.sectionClocks[skill]);
 }));return reply({deadline,serverNow:Date.now()});
},request);}
