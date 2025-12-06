'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Logo({ href = '/', className = '', showText = true, size = 'default' }) {
  const sizeClasses = {
    small: 'h-8',
    default: 'h-12',
    large: 'h-16',
  };

  return (
    <Link href={href} className={`flex-shrink-0 relative ${className}`}>
      <Image
        src="/image/a2zstaff logo.png"
        alt="A2Z STAFFS Logo"
        width={150}
        height={50}
        className={`${sizeClasses[size]} w-auto object-contain`}
        priority
      />
    </Link>
  );
}

// Alternative text-based logo component matching the design
export function A2ZStaffsLogo({ href = '/', className = '', size = 'default' }) {
  const textSizes = {
    small: { text: 'text-sm', box: 'px-2 py-1' },
    default: { text: 'text-lg', box: 'px-3 py-1.5' },
    large: { text: 'text-2xl', box: 'px-4 py-2' },
  };

  const sizeConfig = textSizes[size];

  return (
    <Link href={href} className={`flex items-center ${className}`}>
      <div className={`bg-[#1A73FF] ${sizeConfig.box} flex items-center`}>
        <span className={`${sizeConfig.text} font-bold text-white`}>A2Z</span>
      </div>
      <span className={`${sizeConfig.text} font-bold text-[#1A73FF] ml-0`}>STAFFS</span>
    </Link>
  );
}


