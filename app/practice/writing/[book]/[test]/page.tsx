import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WritingPractice from "../../WritingPractice";

export const metadata: Metadata = { title: "Writing Practice · Excel Institute" };

export default async function WritingPracticePage({ params }: { params: Promise<{ book: string; test: string }> }) {
  const { book, test } = await params;
  if (!/^(?:[1-9]|1\d|2[01])$/.test(book) || !/^[1-4]$/.test(test)) notFound();
  return <WritingPractice key={`${book}:${test}`} book={Number(book)} test={Number(test)} />;
}
