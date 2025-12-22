import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { ErrorMessage } from './ErrorMessage';
import { tw } from '../../utils';

type BaseInputProps = {
  label: string;
  error?: string;
  size?: 'sm' | 'md';
};

type InputProps = BaseInputProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    as?: 'input';
  };

type TextareaProps = BaseInputProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> & {
    as: 'textarea';
  };

type InputComponentProps = InputProps | TextareaProps;

export const Input = (props: InputComponentProps) => {
  const { label, error, size = 'md', className = '', id, as, ...restProps } = props;

  const sizeStyles = {
    sm: 'px-2 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
  };

  const labelSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
  };

  const baseInputStyles =
    'w-full border border-surface-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface transition-colors';

  const inputClassName = `${baseInputStyles} ${sizeStyles[size]} ${className}`;

  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div>
      <label htmlFor={inputId} className={`block font-medium text-gray-dark mb-1 ${labelSizeStyles[size]}`}>
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={inputId}
          className={`${inputClassName} resize-none`}
          {...(restProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={inputId}
          className={inputClassName}
          {...(restProps as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
          <ErrorMessage message={error} className={tw(size === 'sm' && 'text-xs')} />
    </div>
  );
};

