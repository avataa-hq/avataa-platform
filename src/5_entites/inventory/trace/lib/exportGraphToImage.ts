import { Graph } from '@antv/g6';
import { ExportGraphFormat } from '5_entites';

interface IProps {
  graphRef: React.MutableRefObject<Graph | null>;
  format: ExportGraphFormat;
  exportedName: string | undefined;
}

export const exportGraphToImage = ({ graphRef, format, exportedName }: IProps) => {
  if (graphRef && graphRef.current) {
    graphRef.current.downloadFullImage(exportedName ?? 'Graph', `image/${format}`, {
      backgroundColor: '#ddd',
      padding: [50, 70, 50, 50],
    });
  }
};
