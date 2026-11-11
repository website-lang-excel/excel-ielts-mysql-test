import Link from "next/link";
import type { PracticeSkill } from "./PracticeCollection";

export default function PracticeHeader({ book, test, skill }: { book: number; test: number; skill: PracticeSkill }) {
  return <header className="flex min-h-[56px] shrink-0 flex-wrap items-center justify-between gap-3 border-y border-[#d5d5d5] bg-white px-4 py-2 text-[14px] leading-5">
    <h1 className="font-bold">IELTS Academic {book} · {skill} · Test {test}</h1>
    <Link href={`/practice?skill=${skill.toLowerCase()}&book=${book}`} className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#2185d0]">Back to tests</Link>
  </header>;
}
