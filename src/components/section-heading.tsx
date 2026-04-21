import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  index?: string;
  eyebrow?: string;
  title: string;
  italic?: string;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  className?: string;
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  italic,
  description,
  align = 'left',
  tone = 'dark',
  className,
}: SectionHeadingProps) {
  const isLight = tone === 'light';

  return (
    <div
      className={cn(
        'grid w-full gap-8 lg:grid-cols-12',
        align === 'center' ? 'text-center' : 'text-left',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-start gap-6 lg:col-span-4',
          align === 'center' && 'justify-center',
        )}
      >
        {index ? (
          <span
            className={cn(
              'mono-tag pt-2',
              isLight ? 'text-ivory/60' : 'text-ink/45',
            )}
          >
            {index}
          </span>
        ) : null}
        {eyebrow ? (
          <div
            className={cn(
              'flex flex-col gap-3',
              align === 'center' && 'items-center',
            )}
          >
            <span
              className={cn(
                'mono-label',
                isLight ? 'text-sand' : 'text-terracotta',
              )}
            >
              {eyebrow}
            </span>
            <span
              className={cn(
                'block h-px w-12',
                isLight ? 'bg-ivory/30' : 'bg-ink/20',
              )}
            />
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          'lg:col-span-8',
          align === 'center' && 'mx-auto max-w-3xl',
        )}
      >
        <h2
          className={cn(
            'font-display font-light leading-[0.96] tracking-editorial text-balance',
            'text-[2.5rem] sm:text-[3.5rem] lg:text-[4.75rem]',
            isLight ? 'text-ivory' : 'text-ink',
          )}
        >
          {title}
          {italic ? (
            <>
              {' '}
              <em className="font-display italic font-normal text-terracotta">
                {italic}
              </em>
            </>
          ) : null}
        </h2>
        {description ? (
          <p
            className={cn(
              'mt-8 max-w-xl text-base leading-[1.75] text-pretty',
              isLight ? 'text-ivory/70' : 'text-ink/65',
              align === 'center' && 'mx-auto',
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
