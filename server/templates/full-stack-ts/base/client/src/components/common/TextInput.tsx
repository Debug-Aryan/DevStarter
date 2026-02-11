import type { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextInput({ label, error, className, ...props }: TextInputProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-200">{label}</span>
      <input
        {...props}
        className={[
          'w-full rounded-lg border bg-slate-900/40 px-3 py-2 text-slate-100 outline-none',
          'border-slate-800 focus:border-slate-600 focus:ring-2 focus:ring-slate-700/40',
          error ? 'border-rose-700 focus:border-rose-600 focus:ring-rose-700/30' : '',
          className ?? '',
        ].join(' ')}
      />
      {error ? <span className="mt-1 block text-sm text-rose-300">{error}</span> : null}
    </label>
  );
}
