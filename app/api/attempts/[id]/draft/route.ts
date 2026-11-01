import { saveAcknowledgement } from "@/lib/results/save-acknowledgement";
import { actor, body, candidatePayload, endpoint, reject, reply, text } from "@/lib/results/http";
import { db, transaction } from "@/lib/results/db";
import { acceptDraftRevision, requireLease, requireSection } from "@/lib/results/lifecycle";
import { authorizeAttempt } from "@/lib/results/assignments";
type Context={params:Promise<{id:string}>};
async function owned(id:string,user:Awaited<ReturnType<typeof actor>>) {const row=(await db().prepare("SELECT * FROM attempts WHERE id=? AND student_id=?").get(id,user.id));if(!row)reject(404,"Attempt not found.");(await authorizeAttempt(user,row));return row;}
export async function GET(request:Request,{params}:Context){return endpoint(async()=>{
 const user=await actor("student",request),row=(await owned((await params).id,user)),draft=row.data?JSON.parse(String(row.data)):{};
 const raw=(skill:string)=>Object.fromEntries((draft[skill]?.questions??[]).map((q:{number:number;answer:string})=>[String(q.number),q.answer]));
 return reply({answerRevisions:draft.answerRevisions??{},listening:raw('listening'),reading:raw('reading'),writing:draft.writingDraft??{task1:'',task2:''}});
},request);}
export async function PATCH(request:Request,{params}:Context){return endpoint(async()=>{
 const user=await actor("student",request),b=await body(request),{id}=await params;candidatePayload(b);
 const task1=text(b.task1,100000),task2=text(b.task2,100000);
 const acknowledgement=(await transaction(async ()=>{const row=(await owned(id,user));(await requireLease(row,request.headers.get("x-ielts-tab")));const state=(await requireSection(row,"writing"));if(state.deadline&&Date.now()>state.deadline+5000)reject(409,"Writing time has finished. Please submit your saved response.","ANSWER_WINDOW_CLOSED");if(b.testId!==row.test_id)reject(400,"Wrong test.");const draft=row.data?JSON.parse(String(row.data)):{};if(!acceptDraftRevision(draft,"writing",b.revision))return saveAcknowledgement(draft,"writing",{task1,task2},b.revision);draft.writingDraft={task1,task2};(await db().prepare("UPDATE attempts SET data=? WHERE id=?").run(JSON.stringify(draft),id));return saveAcknowledgement(draft,"writing",{task1,task2},b.revision,true);}));return reply({saved:acknowledgement.matches,saveAcknowledgement:acknowledgement});
},request);}
