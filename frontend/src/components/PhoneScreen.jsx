export default function PhoneScreen({ title, subtitle, children, accent = false }) {
  return (
    <article className={`phone ${accent ? 'accent' : ''}`}>
      <header>
        <p className="screen-title">{title}</p>
        {subtitle && <p className="screen-subtitle">{subtitle}</p>}
      </header>
      <section className="screen-content">{children}</section>
    </article>
  );
}
