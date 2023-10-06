import { ComponentPropsWithoutRef, forwardRef } from 'react';

export const Button = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  function Button({ className, ...props }, ref) {
    return (
      <button
        className={`cursor-pointer rounded bg-slate-300 px-2 py-1 text-sm ${className}`}
        {...props}
        ref={ref}
      />
    );
  }
);
