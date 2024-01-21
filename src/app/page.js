import styles from "./page.module.css";
import Picture from '../Picture';

export default function Home() {
  return (
    <main className={styles.main}>
        {
            [...Array(5)].map((_, i) => {
                return <Picture key={i} src={`/images/${i+1}.jpeg`} src10={`/images/${i+1}_low.jpeg`}/>
            })
        }
    </main>
  );
}
