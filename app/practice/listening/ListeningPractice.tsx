"use client";

import { useState } from "react";
import PartNavigation from "@/app/test/PartNavigation";
import PracticeHeader from "../PracticeHeader";
import typography from "../practice-test.module.css";

export default function ListeningPractice({ book, test }: { book: number; test: number }) {
  const [part, setPart] = useState(1);
  return <main className={`${typography.screen} flex h-screen flex-col`}>
    <PracticeHeader book={book} test={test} skill="Listening" />
    <div className="mx-5 mt-2 mb-1 flex min-h-[58px] shrink-0 flex-wrap items-center justify-between gap-3 rounded border border-[#d5d5d5] bg-[#f2f2ef] px-4 py-2">
      <h2 className="text-[14px] font-bold leading-5">Part {part}</h2>
      {/* No source until the owner supplies this book/test's practice recording. */}
      <audio controls preload="none" aria-label="Listening practice audio" className="max-w-full" />
    </div>
    <section key={part} aria-label={`Listening Part ${part} questions`} className={`${typography.content} min-h-0 flex-1 overflow-y-auto bg-white px-5 py-3`}>
      <h2 className="font-bold">Questions</h2>
    </section>
    <PartNavigation current={part} total={4} onChange={setPart} />
    <footer data-ielts-test-footer className="grid shrink-0 grid-cols-4 items-center justify-items-center gap-4 border-t border-[#d5d5d5] bg-white px-3 py-2">
      {[1, 2, 3, 4].map(number => <button key={number} type="button" onClick={() => setPart(number)} aria-current={part === number ? "page" : undefined} className={`px-3 py-1 text-[14px] focus-visible:outline-2 focus-visible:outline-[#2185d0] ${part === number ? "font-bold" : "hover:underline"}`}>Part {number}</button>)}
    </footer>
  </main>;
}
