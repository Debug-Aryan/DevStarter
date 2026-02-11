import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2';

  const variants: Record<Variant, string> = {
    primary:
      'bg-indigo-500 text-white hover:bg-indigo-400 focus:ring-indigo-400/50 disabled:bg-indigo-500/40',
    secondary:
      'bg-slate-800 text-slate-100 hover:bg-slate-700 focus:ring-slate-400/30 disabled:bg-slate-800/50',
  };

  return <button {...props} className={[base, variants[variant], className ?? ''].join(' ')} />;
}
