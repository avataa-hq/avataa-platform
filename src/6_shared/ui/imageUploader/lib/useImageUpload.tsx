import { ClipboardEvent, DragEvent, MutableRefObject, useCallback, useState } from 'react';

interface IProps {
  dropContainerRef: MutableRefObject<HTMLDivElement | null>;
}

export const useImageUpload = ({ dropContainerRef }: IProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>): File => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    const files = Array.from(e?.dataTransfer?.files ?? []);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    return imageFiles[imageFiles.length - 1];
  }, []);

  const onDragLeave = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      if (!dropContainerRef.current?.contains(e.relatedTarget as Node)) {
        setIsDragging(false);
      }
    },
    [dropContainerRef],
  );

  const onPaste = useCallback((e: ClipboardEvent<HTMLDivElement>): File => {
    const files = Array.from(e?.clipboardData?.files ?? []);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    return imageFiles[imageFiles.length - 1];
  }, []);

  return {
    onDragEnter,
    onDrop,
    onDragOver,
    onDragLeave,
    onPaste,

    isDragging,
  };
};
