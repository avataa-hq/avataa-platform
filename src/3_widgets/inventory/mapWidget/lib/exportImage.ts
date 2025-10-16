import { MutableRefObject } from 'react';
import * as htmlToImage from 'html-to-image';

type ExportFormat = 'jpeg' | 'png';
interface IProps {
  mapContainerRef: MutableRefObject<HTMLElement | null>;
  exportFormat: ExportFormat;
}

export const exportImage = async ({ exportFormat, mapContainerRef }: IProps) => {
  if (mapContainerRef && mapContainerRef.current) {
    try {
      let dataUrl = '';

      if (exportFormat === 'jpeg') {
        dataUrl = await htmlToImage.toJpeg(mapContainerRef.current, {
          quality: 0.95,
          cacheBust: true,
        });
      }
      if (exportFormat === 'png') {
        dataUrl = await htmlToImage.toPng(mapContainerRef.current, {
          quality: 0.95,
          cacheBust: true,
        });
      }

      const link = document.createElement('a');
      link.download = `exportedMap.${exportFormat}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      throw new Error(error);
    }
  }
};
