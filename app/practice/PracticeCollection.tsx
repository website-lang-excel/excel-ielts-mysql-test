"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./practice.module.css";

const skills = ["Listening", "Reading", "Writing"] as const;
export type PracticeSkill = typeof skills[number];
const books = Array.from({ length: 21 }, (_, index) => 21 - index);

export default function PracticeCollection({ initialSkill = null, initialBook = null }: { initialSkill?: PracticeSkill | null; initialBook?: number | null }) {
  const [selected, setSelected] = useState<PracticeSkill | null>(initialSkill);
  const [selectedBook, setSelectedBook] = useState<number | null>(initialBook);
  return <>
    <h1>Free Online IELTS {selected ?? "Practice"} Test Collection</h1>
    <nav className={styles.skills} aria-label="Choose a practice skill">
      {skills.map(skill => <button key={skill} type="button" aria-pressed={selected === skill} onClick={() => { setSelected(skill); setSelectedBook(null); }}>{skill}</button>)}
    </nav>
    {selected && selectedBook === null && (
    <div id="practice-books" className={styles.books} role="region" aria-label={`${selected} practice books`}>
      {books.map(number => <article key={number} className={styles.book} aria-labelledby={`book-${number}`}>
        <button type="button" className={styles.bookButton} aria-labelledby={`book-${number}`} onClick={() => setSelectedBook(number)}>
        <span className={styles.cover}>
          <Image src="/images/practice/ielts-academic-cover.png" alt={`IELTS Academic ${number} practice book`} width={1096} height={1436} sizes="(max-width: 480px) 42vw, (max-width: 800px) 28vw, (max-width: 1100px) 21vw, 230px" />
          <span className={styles.number} aria-hidden="true">{number}</span>
        </span>
        <span className={styles.bookTitle} id={`book-${number}`}>IELTS Academic {number}</span>
        </button>
      </article>)}
    </div>
    )}
    {selected && selectedBook !== null && <section aria-labelledby="selected-book-title">
      <button type="button" className={styles.backButton} onClick={() => setSelectedBook(null)}>← Back to books</button>
      <h2 id="selected-book-title" className={styles.selectedBookTitle}>IELTS Academic {selectedBook} · {selected}</h2>
      <div className={styles.tests}>
        {[1, 2, 3, 4].map(test => <article key={test} className={styles.testCard}>
          <h3><Link className={styles.testLink} href={`/practice/${selected.toLowerCase()}/${selectedBook}/${test}`}>Test {test}</Link></h3>
        </article>)}
      </div>
    </section>}
  </>;
}
