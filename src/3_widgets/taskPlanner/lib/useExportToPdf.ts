import { MutableRefObject, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

interface IProps {
  ganttChartRef: MutableRefObject<HTMLDivElement | null>;
}

export const useExportToPdf = ({ ganttChartRef }: IProps) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const tasksContent = document.getElementById('tasksContent');
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setWidth(entry.contentRect.width);
        setHeight(entry.contentRect.height + 120);
      });
    });

    if (tasksContent) {
      observer.observe(tasksContent);
    }

    return () => observer.disconnect();
  }, [tasksContent]);

  const exportToPdfFn = useReactToPrint({
    contentRef: ganttChartRef ?? undefined,
    documentTitle: 'Gantt Chart',
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 10mm;
        font-family: Arial, sans-serif !important;
        -webkit-print-color-adjust: exact !important;
         page-break-inside: avoid !important;
         overflow: visible !important;
         width: ${width}px !important;
         height: ${height}px !important;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
        font-family: Arial, sans-serif !important;
        overflow: visible !important;
      }
      body {
        -webkit-print-color-adjust: exact !important;
        background: transparent !important;
        color: inherit !important;
        font-family: Arial, sans-serif !important;
        width: 100% !important;
        overflow: visible !important;
        height: 100% !important;
      }
    `,
    onAfterPrint: () => {
      if (!ganttChartRef.current) return;
      const ganttTimeLineHeaderScale = document.getElementById('ganttTimeLineHeaderScale');
      const tasksContainer = document.getElementById('tasksContainer');

      if (tasksContainer && ganttTimeLineHeaderScale) {
        tasksContainer.style.marginLeft = '0px';
        ganttTimeLineHeaderScale.style.marginLeft = '0px';
      }
    },
  });

  return { exportToPdfFn };
};

// .taskPlannerWidget {
//   -webkit-print-color-adjust: exact !important;
//   background: transparent !important;
//   color: inherit !important;
//   font-family: Arial, sans-serif !important;
//   overflow: visible !important;
//   height: fit-content !important;
//   width: 100% !important;
// }
// .ganttChart {
//   -webkit-print-color-adjust: exact !important;
//   background: transparent !important;
//   color: inherit !important;
//   font-family: Arial, sans-serif !important;
//   overflow: visible !important;
//   height: fit-content !important;
//   width: 100% !important;
// }
// .timeLineArea {
//   -webkit-print-color-adjust: exact !important;
//   background: transparent !important;
//   color: inherit !important;
//   font-family: Arial, sans-serif !important;
//   overflow: visible !important;
//   height: fit-content !important;
//   width: 100% !important;
// }
// .tasksContainer {
//   -webkit-print-color-adjust: exact !important;
//   background: transparent !important;
//   color: inherit !important;
//   font-family: Arial, sans-serif !important;
//   overflow: visible !important;
//   height: fit-content !important;
//   width: 100% !important;
// }
// .tasksContent {
//   -webkit-print-color-adjust: exact !important;
//   background: transparent !important;
//   color: inherit !important;
//   font-family: Arial, sans-serif !important;
//   overflow: visible !important;
//   height: fit-content !important;
//   width: 100% !important;
// }
