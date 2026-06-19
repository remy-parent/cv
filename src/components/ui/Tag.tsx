interface TagProps {
  children: string;
}

export default function Tag({ children }: TagProps) {
  return (
    <span className="rounded-full border border-border bg-accent-soft px-3 py-1 text-xs text-accent">
      {children}
    </span>
  );
}
