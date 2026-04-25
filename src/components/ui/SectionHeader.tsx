import ScrollReveal from '@/components/ui/ScrollReveal';

interface SectionHeaderProps {
  strapline?: string;
  heading: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionHeader({
  strapline,
  heading,
  subtitle,
  align = 'center',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';
  const maxWidthClass = align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl';

  return (
    <ScrollReveal className={`flex flex-col gap-4 ${alignClass} ${maxWidthClass}`}>
      {strapline && (
        <span className="text-gold-500 text-xs font-medium uppercase tracking-[0.2em] font-body">
          {strapline}
        </span>
      )}
      <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight" style={{ letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
        {heading}
      </h2>
      {subtitle && (
        <p className="text-slate-400 text-base md:text-lg leading-relaxed mt-2">
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}
