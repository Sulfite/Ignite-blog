import styles from './header.module.scss';

export default function Header() {
  return (
    <div className={styles.container}>
      <img src="/images/Logo.svg" alt="Logo" />
    </div>
  );
}
