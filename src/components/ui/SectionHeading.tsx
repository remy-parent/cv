interface SectionHeadingProps {
  eyebrow: string;
  title: string;
}

export default function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="mb-10 text-center">
      <p className="mb-2 font-mono text-sm uppercase tracking-widest text-accent">{eyebrow}</p>
      <h2 className="text-3xl text-text md:text-4xl">{title}</h2>
    </div>
  );
}
