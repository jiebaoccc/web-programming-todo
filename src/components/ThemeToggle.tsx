import { useTheme } from '../ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function handleToggle() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  return (
    <button type="button" className="theme-toggle" onClick={handleToggle} aria-label="切换主题">
      {theme === 'light' ? '切换深色模式' : '切换浅色模式'}
    </button>
  );
}
