import 'cron-input-ui/script';
import 'cron-input-ui/styles';
import 'cron-input-ui/locales-en';

import { useTheme } from '@mui/material';

import { useEffect, useRef } from 'react';
import { CronExpressionInputContainer } from './CronExpressionInput.styled';

interface CronExpressionInputProps {
  onChange?: (value: string) => void;
  initialValue?: string;
  required?: boolean;
  hotValidate?: boolean;
}

export const CronExpressionInput = ({
  onChange,
  hotValidate = true,
  initialValue,
  required = false,
}: CronExpressionInputProps) => {
  const theme = useTheme();
  const cronInputRef = useRef<HTMLElement>();

  useEffect(() => {
    if (!cronInputRef.current) return;

    const inputElement = cronInputRef.current.querySelector('input');
    if (!inputElement) return;

    inputElement.value = initialValue ?? '';
  }, []);

  useEffect(() => {
    if (!cronInputRef.current) return () => {};

    const inputElement = cronInputRef.current.querySelector('input');
    const closeButtonElement = cronInputRef.current.querySelector('span.cronClose');
    const modalElement = cronInputRef.current.querySelector('div.modal');

    const handleClose: EventListener = () => {
      modalElement?.classList.remove('show');
    };

    closeButtonElement?.addEventListener('click', handleClose);
    const emptyExpressionErrorElement: HTMLElement | null = cronInputRef.current.querySelector(
      'small.cronExpressionMissing',
    );

    if (!required && !inputElement?.value?.length && emptyExpressionErrorElement?.style) {
      emptyExpressionErrorElement.style.display = 'none';
    }

    return () => {
      closeButtonElement?.removeEventListener('click', handleClose);
    };
  }, [required]);

  return (
    <CronExpressionInputContainer>
      {/* @ts-ignore */}
      <cron-input-ui
        ref={cronInputRef}
        onInput={(e: any) => onChange?.(e.nativeEvent.detail.value)}
        color={theme.palette.primary.main}
        height="40px"
        required={required}
        hotValidate={hotValidate}
      />
    </CronExpressionInputContainer>
  );
};
