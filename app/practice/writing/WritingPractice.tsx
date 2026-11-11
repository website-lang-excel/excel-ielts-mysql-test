"use client";

import { useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import PracticeHeader from "../PracticeHeader";
import typography from "../practice-test.module.css";

export default function WritingPractice({ book, test }: { book: number; test: number }) {
  const [task, setTask] = useState<1 | 2>(1);
  const [task1, setTask1] = useState("");
  const [task2, setTask2] = useState("");
  const [paneSplit, setPaneSplit] = useState(50);
  const answer = task === 1 ? task1 : task2;
  const setAnswer = task === 1 ? setTask1 : setTask2;
  const moveDivider = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!bounds || bounds.width === 0) return;
    setPaneSplit(Math.min(75, Math.max(25, ((event.clientX - bounds.left) / bounds.width) * 100)));
  };
  const releaseDivider = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return <main className={`${typography.screen} flex h-screen flex-col`}>
    <PracticeHeader book={book} test={test} skill="Writing" />
    <section className="mx-5 my-3 flex min-h-0 flex-1 flex-col overflow-hidden border border-[#c9c9c9]">
      <nav aria-label="Writing tasks" className="flex shrink-0 items-center gap-2 border-b border-[#d5d5d5] bg-white px-4 py-2">
        {([1, 2] as const).map(number => <button type="button" key={number} onClick={() => setTask(number)} aria-current={task === number ? "page" : undefined} className={`rounded-sm border px-4 py-2 text-[14px] font-bold focus-visible:outline-2 focus-visible:outline-[#2185d0] ${task === number ? "border-[#2185d0] bg-[#eaf4fc]" : "border-transparent hover:bg-[#f2f2f2]"}`}>Task {number}</button>)}
        <span className="ml-auto text-[13px] text-[#444]">Task {task} of 2</span>
      </nav>
      <div className="relative grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-3 overflow-hidden p-3 lg:grid-cols-[minmax(0,var(--writing-left))_12px_minmax(0,var(--writing-right))] lg:grid-rows-1 lg:gap-4" style={{ "--writing-left": `${paneSplit}fr`, "--writing-right": `${100 - paneSplit}fr` } as CSSProperties}>
        <section key={task} aria-label={`Writing Task ${task} prompt`} className={`${typography.content} min-h-0 overflow-y-auto rounded border border-[#d5d5d5] bg-white p-4`}>
          <h2 className="font-bold">WRITING TASK {task}</h2>
        </section>
        <div role="separator" aria-label="Resize task and writing panels" aria-orientation="vertical" aria-valuemin={25} aria-valuemax={75} aria-valuenow={Math.round(paneSplit)} tabIndex={0}
          onPointerDown={event => event.currentTarget.setPointerCapture(event.pointerId)} onPointerMove={moveDivider} onPointerUp={releaseDivider} onPointerCancel={releaseDivider}
          onKeyDown={event => {
            if (event.key === "ArrowLeft") { event.preventDefault(); setPaneSplit(value => Math.max(25, value - 2)); }
            if (event.key === "ArrowRight") { event.preventDefault(); setPaneSplit(value => Math.min(75, value + 2)); }
          }} className="relative hidden cursor-col-resize touch-none outline-none focus-visible:ring-2 focus-visible:ring-[#2185d0] lg:block">
          <span className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 bg-[#999]" />
          <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[#555] bg-white text-[20px] leading-none shadow-sm">↔</span>
        </div>
        <section className="flex min-h-0 flex-col rounded border border-[#d5d5d5] bg-white p-4" aria-label="Writing answer area">
          <label htmlFor="practice-writing-answer" className="mb-2 text-[14px] font-bold">Your answer</label>
          <textarea id="practice-writing-answer" value={answer} onChange={event => setAnswer(event.target.value)} spellCheck={false} autoCorrect="off" autoCapitalize="off" autoComplete="off" data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false" className={`${typography.editor} min-h-0 flex-1 resize-none rounded-sm border border-[#888] bg-white p-3 outline-none focus:border-[#2185d0] focus:ring-1 focus:ring-[#2185d0]`} />
          <p className="mt-2 self-end text-[13px] text-[#444]">Word count: {answer.trim() ? answer.trim().split(/\s+/).length : 0}</p>
        </section>
      </div>
    </section>
    <footer data-ielts-test-footer className="flex shrink-0 items-center justify-between border-t border-[#d5d5d5] bg-[#f2f2f2] px-5 py-2">
      <div className="flex items-center gap-4 text-[14px] font-bold"><span>Writing</span>{([1, 2] as const).map(number => <button type="button" key={number} aria-label={`Go to Task ${number}`} aria-current={task === number ? "page" : undefined} onClick={() => setTask(number)} className={`rounded-sm px-2 py-1 focus-visible:outline-2 focus-visible:outline-[#2185d0] ${task === number ? "border border-[#2185d0] bg-white" : "hover:bg-white"}`}>{number}</button>)}</div>
      <button type="button" onClick={() => setTask(task === 1 ? 2 : 1)} className="rounded-sm bg-black px-4 py-2 text-[14px] font-bold text-white focus-visible:outline-2 focus-visible:outline-[#2185d0]">{task === 1 ? "Next Task →" : "← Previous Task"}</button>
    </footer>
  </main>;
}
