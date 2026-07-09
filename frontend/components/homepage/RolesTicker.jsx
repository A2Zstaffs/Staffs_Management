'use client';

import { TrendingUp } from 'lucide-react';

/**
 * RolesTicker — a thin marquee of role categories the agency hires for.
 * Signals breadth + momentum to prospective clients. Self-contained motion
 * (styled-jsx keyframes), pauses on hover, and freezes for reduced-motion users.
 *
 * These are role *categories* (true for a full-service agency), not counts —
 * so nothing here is a fabricated metric.
 */
const ROLES = [
  'Software Engineers',
  'Sales & Business Development',
  'Finance & Accounting',
  'Data & Analytics',
  'Product Managers',
  'Customer Success',
  'HR & Talent',
  'Marketing & Growth',
  'Operations',
  'Design & UX',
  'DevOps & Cloud',
  'Leadership & CXO',
];

export default function RolesTicker() {
  // Duplicate the list once so the loop is seamless; the copy is aria-hidden.
  const items = [...ROLES, ...ROLES];

  return (
    <div className="border-y border-secondary-100 bg-white/70 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="hidden flex-shrink-0 items-center gap-2 sm:flex">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-100">
            <TrendingUp className="h-4 w-4 text-primary-600" />
          </span>
          <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-secondary-500">
            Roles we fill
          </span>
        </div>

        {/* Fade-masked marquee viewport */}
        <div className="ticker-mask relative flex-1 overflow-hidden">
          <ul className="ticker-track flex w-max items-center gap-3">
            {items.map((role, i) => (
              <li
                key={i}
                aria-hidden={i >= ROLES.length}
                className="flex items-center gap-2 whitespace-nowrap rounded-full border border-secondary-200 bg-white px-4 py-1.5 text-sm font-medium text-secondary-700 shadow-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                {role}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .ticker-mask {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 6%,
            black 94%,
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            black 6%,
            black 94%,
            transparent
          );
        }
        .ticker-track {
          animation: ticker-scroll 40s linear infinite;
        }
        .ticker-mask:hover .ticker-track {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          from {
            transform: translateX(0);
          }
          to {
            /* half, because the list is duplicated once */
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
