import type { Metadata } from "next";
import PracticeCollection, { type PracticeSkill } from "./PracticeCollection";
import styles from "./practice.module.css";

export const metadata: Metadata = { title: "Students Practice ? Excel Institute" };

export default async function PracticePage({ searchParams }: { searchParams: Promise<{ skill?: string | string[]; book?: string | string[] }> }) {
  const query = await searchParams;
  const initialSkill: PracticeSkill | null = query.skill === "reading" ? "Reading" : query.skill === "listening" ? "Listening" : query.skill === "writing" ? "Writing" : null;
  const initialBook = initialSkill && typeof query.book === "string" && /^(?:[1-9]|1\d|2[01])$/.test(query.book) ? Number(query.book) : null;
  return <main className={styles.page}>
    <PracticeCollection key={`${initialSkill}:${initialBook}`} initialSkill={initialSkill} initialBook={initialBook} />
  </main>;
}
