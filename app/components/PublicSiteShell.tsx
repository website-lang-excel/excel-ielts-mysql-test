/* eslint-disable @next/next/no-img-element -- Preserve existing public-site logo dimensions and direct media URLs. */
import Link from "next/link";
import styles from "../homepage.module.css";

export function PublicSiteHeader({ fullMock = false }: { fullMock?: boolean }) {
  return <header className={styles.header}>
      <div className={`${styles.container} ${styles.masthead}`}>
        <Link href="/" aria-label="Excel Institute IELTS home" className={styles.logo}><img src="/images/excel-institute-logo.jpg" alt="Excel Institute" /><span className={styles.headerTestTitle}>IELTS Mock Test</span></Link>
        <div className={styles.loginLinks}>
          <Link href="/verify"><svg aria-hidden="true" viewBox="0 0 20 20"><circle cx="10" cy="6" r="3" /><path d="M4 17v-2a6 6 0 0 1 12 0v2z" /></svg>Candidate Login</Link>
          <Link href="/admin/login"><svg aria-hidden="true" viewBox="0 0 20 20"><path d="m8 1-1 3-3 1 1 3-3 2 3 2-1 3 3 1 1 3 3-1 1-3 3-1-1-3 3-2-3-2 1-3-3-1-1-3z" /><circle cx="10" cy="10" r="3" fill="white" /></svg>Admin Login</Link>
        </div>
      </div>
      <nav className={styles.navigation} aria-label="Main navigation"><div className={styles.container}>
        <Link href="/" aria-current={fullMock ? undefined : "page"}>Home</Link><Link href="/full-mock-test" aria-current={fullMock ? "page" : undefined}>Mock Tests</Link><Link href={fullMock ? "/#about" : "#about"}>About</Link><Link href="/full-mock-test">Start a test</Link>
      </div></nav>
    </header>;
}

export function PublicSiteFooter({ fullMock = false }: { fullMock?: boolean }) {
  return <footer id="contact" className={styles.footer}>
      <div className={`${styles.container} ${styles.contactDetails}`}>
        <h2>Contact us</h2>
        <address>
          <a href="mailto:excelinstitute.sylhet@gmail.com">excelinstitute.sylhet@gmail.com</a>
          <a href="tel:+8801711184799">+880 171 118 4799</a>
          <span>Point View Shopping Centre, Amberkhana, Sylhet, 3100</span>
        </address>
      </div>
      <div className={`${styles.container} ${styles.footerContent}`}>
        <div className={styles.footerBrand}><img src="/images/excel-institute-logo.jpg" alt="Excel Institute" /><span>IELTS Mock Tests</span></div>
        <nav aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/full-mock-test">Mock Tests</Link><Link href={fullMock ? "/#about" : "#about"}>About</Link></nav>
        <p>&copy; 2026 Excel Institute. All rights reserved.</p>
      </div>
    </footer>;
}
