"use client";

import { useState, type PointerEvent as ReactPointerEvent } from "react";
import PartNavigation from "@/app/test/PartNavigation";
import PracticeHeader from "../PracticeHeader";
import typography from "../practice-test.module.css";

// Keep this practice-only shell separate from exam authentication, drafts and clocks.
// Pane behavior follows Reading; larger practice-only typography matches the owner reference.
export default function ReadingPractice({ book, test }: { book: number; test: number }) {
  const [paneSplit, setPaneSplit] = useState(50);
  const [passage, setPassage] = useState(1);

  const movePaneDivider = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!bounds || bounds.width === 0) return;
    const percentage = ((event.clientX - bounds.left) / bounds.width) * 100;
    setPaneSplit(Math.min(75, Math.max(25, percentage)));
  };
  const releaseDivider = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return <main className={`${typography.screen} flex h-screen flex-col`}>
    <PracticeHeader book={book} test={test} skill="Reading" />
    <div className="mx-5 mt-2 mb-1 min-h-[58px] shrink-0 rounded border border-[#d5d5d5] bg-[#f2f2ef] px-4 py-1 text-[14px] leading-5">
      <h2 className="font-bold">Part {passage}</h2>
    </div>
    <div className="relative flex min-h-0 flex-1 overflow-hidden bg-white">
      <section key={`passage-${passage}`} style={{ width: `${paneSplit}%` }} className="h-full min-w-0 shrink-0 overflow-y-auto border-r border-[#999] bg-white" aria-label={`Reading Passage ${passage}`}>
        <article className={`${typography.content} space-y-4 px-5 py-4`}>
          <h2 className="text-center font-bold">Reading Passage {passage}</h2>
        </article>
      </section>
      <section key={`questions-${passage}`} style={{ width: `${100 - paneSplit}%` }} className="h-full min-w-0 shrink-0 overflow-y-auto bg-white pb-20" aria-label={`Reading questions for Passage ${passage}`}>
        <div className={`${typography.content} space-y-8 px-5 py-5`}><h2 className="font-bold">Questions</h2></div>
      </section>
      <div role="separator" aria-label="Resize passage and question panels" aria-orientation="vertical" aria-valuemin={25} aria-valuemax={75} aria-valuenow={Math.round(paneSplit)} tabIndex={0}
        onPointerDown={event => event.currentTarget.setPointerCapture(event.pointerId)} onPointerMove={movePaneDivider} onPointerUp={releaseDivider} onPointerCancel={releaseDivider}
        onKeyDown={event => {
          if (event.key === "ArrowLeft") { event.preventDefault(); setPaneSplit(value => Math.max(25, value - 2)); }
          if (event.key === "ArrowRight") { event.preventDefault(); setPaneSplit(value => Math.min(75, value + 2)); }
        }} style={{ left: `${paneSplit}%` }} className="absolute top-0 z-20 h-full w-3 -translate-x-1/2 cursor-col-resize touch-none outline-none focus-visible:ring-2 focus-visible:ring-[#2185d0]">
        <span className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 bg-[#999]" />
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[#555] bg-white text-[20px] leading-none shadow-sm">↔</span>
      </div>
    </div>
    <PartNavigation floating current={passage} total={3} onChange={setPassage} />
    <footer data-ielts-test-footer className="grid shrink-0 grid-cols-3 items-center justify-items-center gap-4 border-t border-[#d5d5d5] bg-white px-3 py-2">
      {[1, 2, 3].map(number => <button type="button" key={number} onClick={() => setPassage(number)} aria-current={passage === number ? "page" : undefined} className={`px-3 py-1 text-[14px] focus-visible:outline-2 focus-visible:outline-[#2185d0] ${passage === number ? "font-bold text-[#111]" : "font-normal text-[#111] hover:underline"}`}>Passage {number}</button>)}
    </footer>
  </main>;
}
