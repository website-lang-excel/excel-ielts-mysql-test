import type { Metadata } from "next";
import Link from "next/link";
import { PublicSiteHeader, PublicSiteFooter } from "../components/PublicSiteShell";
import styles from "../homepage.module.css";

export const metadata: Metadata = { title: "Full Mock Test ? Excel Institute" };
const mockTests = Array.from({ length: 40 }, (_, index) => index + 1);
// Except for Tests 27, 30, 33, 36 and 39, tests 25–40 are empty catalogue entries until their content is supplied.
// Keep the existing live exam IDs, renderers and database mechanisms unchanged.
function Arrow() { return <span aria-hidden="true" className={styles.arrow}>&#8594;</span>; }

export default function FullMockTestPage() {
  return <main className={styles.home}>
    <PublicSiteHeader fullMock />
    <section id="mock-tests" className={styles.tests}>
      <div className={styles.container}>
        <p className={styles.eyebrow}>Practice library</p>
        <h1 className={styles.mockPageTitle}>Choose your mock test</h1>
        <p className={styles.intro}>Select an available test to continue to candidate login.</p>
        <p className={styles.testSummary}>Listening, Reading and Writing &middot; Tests 1&ndash;40 &middot; ready tests available below</p>
        <div className={styles.testGrid}>{mockTests.map((number) => <article key={number} className={styles.testTile}>
          <div className={styles.testCardTop}><span className={styles.testNumber}>{String(number).padStart(2, "0")}</span>{(number <= 24 || number === 27 || number === 30 || number === 33 || number === 36 || number === 39) && <span className={styles.available}>Available</span>}</div>
          <h3>IELTS Mock Test {number}</h3>
          <p>Listening, Reading and Writing</p>
          {(number <= 24 || number === 27 || number === 30 || number === 33 || number === 36 || number === 39)
            ? <Link href={`/verify?test=${number}`} className={styles.testButton} aria-label={`Start Test ${number}`}><span>Start Test</span><Arrow /></Link>
            : <button type="button" disabled className={styles.testButton} aria-label={`Test ${number}: no content added yet`} title="No content added yet"><span>Start Test</span><Arrow /></button>}
        </article>)}</div>
        <div className={styles.ready}><div><h3>Ready to begin?</h3><p>Choose one of the available mock tests above.</p></div><Link href="#mock-tests" className={styles.testButton}><span>View tests</span><Arrow /></Link></div>
      </div>
    </section>
    <PublicSiteFooter fullMock />
  </main>;
}
