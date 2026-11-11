/* eslint-disable @next/next/no-img-element -- Keep the existing native logo/diagram dimensions, CSS and direct media URLs; image optimization is outside this lint-only repair. */
import Link from "next/link";
import HomepageBanner from "./HomepageBanner";
import { PublicSiteHeader, PublicSiteFooter } from "./components/PublicSiteShell";
import styles from "./homepage.module.css";

export const dynamic = "force-dynamic";
const features = [
  { title: "Listening section", text: "Follow the audio and answer as you listen.", image: "/images/homepage-listening.png" },
  { title: "Reading section", text: "Read passages and answer IELTS-style questions.", image: "/images/homepage-reading.png" },
  { title: "Writing section", text: "Respond to both writing tasks in one workspace.", image: "/images/homepage-writing.png" },
];
function Arrow() { return <span aria-hidden="true" className={styles.arrow}>&#8594;</span>; }

export default function Home() {
  return <main className={styles.home}>
    <PublicSiteHeader />

    <HomepageBanner>
      <p className={styles.eyebrow}>Excel Institute &middot; IELTS Practice</p>
      <h1>Prepare IELTS with confidence.</h1>
      <p>Practice with IELTS mock tests designed to help you experience the test format and build confidence before exam day.</p>
      <Link href="/full-mock-test" className={styles.primaryButton}><span>Browse mock tests</span><Arrow /></Link>
    </HomepageBanner>

    <section id="about" className={styles.welcome}>
      <div className={styles.container}>
        <p className={styles.eyebrow}>Your practice starts here</p>
        <h2>Choose a test and begin</h2>
        <p className={styles.intro}>Enter your candidate login details to access an available mock test.<br />Work through each section in a focused test environment and review your progress.</p>
        <div className={styles.skillCards}>{features.map((feature) => <article key={feature.title} className={styles.skillCard}>
          <img src={feature.image} alt="" />
          <div className={styles.skillCardBody}><div><h3>{feature.title}</h3><p>{feature.text}</p></div><Link href="/full-mock-test" aria-label={`View mock tests for the ${feature.title.toLowerCase()}`}><Arrow /></Link></div>
        </article>)}</div>
        <p className={styles.practiceNote}><strong>Built for practice &middot; A clear way to prepare &middot; Timed practice</strong><span>Work through questions with a countdown timer.</span></p>
      </div>
    </section>

    <section className={styles.choices} aria-labelledby="practice-choice-title">
      <div className={styles.container}>
        <p className={styles.eyebrow}>Choose your practice</p>
        <h2 id="practice-choice-title">How would you like to practise?</h2>
        <div className={styles.choiceGrid}>
          <article className={styles.choiceCard}>
            <h3>Full Mock Test</h3>
            <p>Take an assigned Listening, Reading and Writing mock test in the timed examination environment.</p>
            <Link href="/full-mock-test" className={styles.primaryButton}><span>Choose a mock test</span><Arrow /></Link>
          </article>
          <article className={styles.choiceCard}>
            <h3>Students Practice</h3>
            <p>Build your skills at your own pace with separate practice exercises. No account needed.</p>
            <Link href="/practice" className={styles.primaryButton}><span>Start practising</span><Arrow /></Link>
          </article>
        </div>
      </div>
    </section>



    <PublicSiteFooter />
  </main>;
}
