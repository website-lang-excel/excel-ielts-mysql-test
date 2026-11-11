import { accessError, AccessDenied } from "@/lib/results/TestAccess";
import WritingTest from "./WritingTestClient";

type WritingRouteProps = {
  searchParams: Promise<{ test?: string | string[]; mode?: string | string[] }>;
};

export default async function WritingTestPage({ searchParams }: WritingRouteProps) {
  const query=await searchParams,message=await accessError(query,"writing");
  if(message)return <AccessDenied message={message}/>;
  const requestedTest = query.test ?? "1";
  const queryValue = Array.isArray(requestedTest) ? requestedTest[0] : requestedTest;
  const parsedTest = Number(queryValue);
  const testNumber = queryValue && Number.isInteger(parsedTest) && parsedTest >= 1 && (parsedTest <= 10 || [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 27, 30, 33, 36, 39].includes(parsedTest)) ? parsedTest : null;
  return <WritingTest key={testNumber ?? "existing"} testNumber={testNumber} />;
}
