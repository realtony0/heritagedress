import Link from 'next/link';
import { useId } from 'react';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

type BrandLogoProps = {
  tone?: 'dark' | 'light';
  variant?: 'nav' | 'stacked' | 'footer';
  href?: string;
  className?: string;
};

function BrandEmblem({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) {
  const gradientId = useId().replace(/:/g, '');
  const stroke = tone === 'light' ? '#F4E8D8' : '#B27A3E';
  const stem = tone === 'light' ? '#D9B98D' : '#C28C52';
  const silhouette = '#121212';
  const dot = tone === 'light' ? '#F8D8A6' : '#D29B5B';

  return (
    <svg
      viewBox="0 0 220 250"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="70" y1="80" x2="146" y2="148" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDBA43" />
          <stop offset="0.58" stopColor="#FF8A22" />
          <stop offset="1" stopColor="#B56727" />
        </linearGradient>
      </defs>

      <path
        d="M54 194V92C54 61.1 79.1 36 110 36C140.9 36 166 61.1 166 92V194"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M54 194H166" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M110 21L114 31L124 35L114 39L110 49L106 39L96 35L106 31L110 21Z" fill={stroke} />
      <path d="M110 205L114 215L124 219L114 223L110 233L106 223L96 219L106 215L110 205Z" fill={stroke} />
      <path d="M47 118L51 128L61 132L51 136L47 146L43 136L33 132L43 128L47 118Z" fill={stroke} />
      <path d="M173 118L177 128L187 132L177 136L173 146L169 136L159 132L169 128L173 118Z" fill={stroke} />

      <circle cx="110" cy="120" r="39" fill={`url(#${gradientId})`} />
      <path d="M71 120H149" stroke="#FDD38F" strokeOpacity="0.36" strokeWidth="4" />

      <path
        d="M96 72C102 60 122 58 130 70C133 74 135 80 133 86C130 96 119 103 111 105C101 107 90 103 85 95C80 86 84 76 96 72Z"
        fill={silhouette}
      />
      <path
        d="M92 85C84 81 82 66 96 56C109 46 130 51 140 66C146 75 145 90 137 98C133 89 125 85 118 84C109 82 99 89 92 85Z"
        fill={silhouette}
      />
      <path
        d="M111 104C101 112 97 124 97 138V162C97 176 102 188 111 198C100 199 89 197 78 190C67 183 61 171 61 157C61 143 67 133 74 122C81 111 85 99 85 88C85 81 89 75 96 72C93 83 101 94 111 104Z"
        fill={silhouette}
      />
      <path
        d="M112 104C128 110 144 125 145 143C146 154 142 164 135 171C131 175 126 178 120 180L121 160C120 151 126 145 134 139C127 139 119 137 113 132L112 104Z"
        fill={silhouette}
      />
      <path d="M96 93C106 88 122 87 133 93" stroke="#D8A14E" strokeWidth="5" strokeLinecap="round" />
      <circle cx="134" cy="101" r="5.5" fill={dot} />
      <path d="M134 106V115" stroke={dot} strokeWidth="2.4" strokeLinecap="round" />

      <path d="M35 186C47 170 55 154 57 134" stroke={stem} strokeWidth="3" strokeLinecap="round" />
      <path d="M50 162C36 154 27 153 17 157C24 169 34 172 50 162Z" fill={stem} fillOpacity="0.82" />
      <path d="M56 148C47 140 39 138 31 139C35 150 42 154 56 148Z" fill={stem} fillOpacity="0.72" />
      <path d="M40 188C39 180 42 175 48 171C54 176 55 183 53 191C48 193 43 192 40 188Z" fill={stem} fillOpacity="0.72" />

      <path d="M185 186C173 170 165 154 163 134" stroke={stem} strokeWidth="3" strokeLinecap="round" />
      <path d="M170 162C184 154 193 153 203 157C196 169 186 172 170 162Z" fill={stem} fillOpacity="0.82" />
      <path d="M164 148C173 140 181 138 189 139C185 150 178 154 164 148Z" fill={stem} fillOpacity="0.72" />
      <path d="M180 188C181 180 178 175 172 171C166 176 165 183 167 191C172 193 177 192 180 188Z" fill={stem} fillOpacity="0.72" />
    </svg>
  );
}

function BrandText({
  tone = 'dark',
  compact = false,
  align = 'center',
}: {
  tone?: 'dark' | 'light';
  compact?: boolean;
  align?: 'left' | 'center';
}) {
  const textTone = tone === 'light' ? 'text-ivory' : 'text-ink';
  const accentTone = tone === 'light' ? 'text-sand' : 'text-terracotta';

  return (
    <div
      className={cn(
        'flex flex-col',
        compact ? 'gap-0.5' : 'gap-1',
        align === 'left' ? 'text-left' : 'text-center',
      )}
    >
      <span
        className={cn(
          'font-display tracking-[0.08em]',
          textTone,
          compact ? 'text-lg leading-none sm:text-xl' : 'text-2xl leading-none sm:text-3xl',
        )}
      >
        Heritage Dresses
      </span>
      <span
        className={cn(
          'font-display italic',
          accentTone,
          compact ? 'text-sm leading-none sm:text-base' : 'text-xl leading-none sm:text-2xl',
        )}
      >
        By Hady
      </span>
    </div>
  );
}

export function BrandLogo({
  tone = 'dark',
  variant = 'stacked',
  href = '/',
  className,
}: BrandLogoProps) {
  const textAlign = variant === 'footer' ? 'left' : 'center';

  const content =
    variant === 'nav' ? (
      <div className={cn('flex items-center gap-3', className)}>
        <BrandEmblem tone={tone} className="h-11 w-11 shrink-0" />
        <BrandText tone={tone} compact align="left" />
      </div>
    ) : (
      <div className={cn('flex flex-col items-center', variant === 'footer' ? 'gap-4' : 'gap-5', className)}>
        <BrandEmblem tone={tone} className={cn(variant === 'footer' ? 'h-28 w-28' : 'h-36 w-36 sm:h-40 sm:w-40')} />
        <BrandText tone={tone} align={textAlign} />
        <span
          className={cn(
            'font-body text-[0.7rem] uppercase tracking-[0.34em]',
            textAlign === 'left' ? 'text-left' : 'text-center',
            tone === 'light' ? 'text-ivory/75' : 'text-ink/60',
          )}
        >
          {siteConfig.tagline}
        </span>
      </div>
    );

  return (
    <Link href={href} aria-label={siteConfig.name}>
      {content}
    </Link>
  );
}
