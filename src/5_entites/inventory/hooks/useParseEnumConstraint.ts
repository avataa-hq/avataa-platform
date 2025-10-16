import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';

interface IProps {
  constraint?: string | null;
}

export const useParseEnumConstraint = ({ constraint }: IProps) => {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!constraint) return;

    try {
      const formattedOptions = constraint
        .slice(1, -1)
        .replace(/'/g, '')
        .split(',')
        .map((item) => `${item}`);

      setOptions(formattedOptions);
    } catch (error) {
      enqueueSnackbar('Error parsing JSON', { variant: 'error' });
      console.error('Error parsing JSON:', error);
      setOptions([]);
    }
  }, [constraint]);

  return { options };
};
