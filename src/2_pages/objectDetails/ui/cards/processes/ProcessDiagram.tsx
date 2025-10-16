import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import { useEffect, useRef } from 'react';
import { ImportDoneEvent } from 'bpmn-js/lib/BaseViewer';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import ZeebeBpmnModdle from 'zeebe-bpmn-moddle/resources/zeebe.json';
import { Button } from '6_shared';
import { renderToString } from 'react-dom/server';
import { Box, useTheme } from '@mui/material';

import { ripples } from 'ldrs';

ripples.register();

const Circle = ({ type }: { type: 'error' | 'success' }) => {
  const { palette } = useTheme();
  const color = type === 'error' ? palette.error.light : palette.success.light;
  return <l-ripples size="50" speed="5" color={color} />;
};

const goToElement = (modeler: BpmnModeler, elementId: string) => {
  if (!modeler) return;

  const elementRegistry: any = modeler.get('elementRegistry');
  const selection: any = modeler.get('selection');

  const element: any = elementRegistry.get(elementId);
  if (element) {
    selection.select(element);
    // @ts-ignore
    modeler.get('canvas').scrollToElement(element);
  } else {
    console.warn(`⚠️ Element with id ${elementId} not found in diagram.`);
  }
};

const fitToViewport = (modeler: BpmnModeler) => {
  const canvas = modeler.get('canvas');
  if (canvas) {
    // @ts-ignore
    canvas.zoom('fit-viewport', null);
  }
};

export interface ICurrentProcessElement {
  taskId: string;
  type: 'error' | 'success';
}
interface IProps {
  bpmnXMLDiagram?: string;
  currentProcessElement?: ICurrentProcessElement[];
}
export const ProcessDiagram = ({ bpmnXMLDiagram, currentProcessElement }: IProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const modelerRef = useRef<BpmnModeler | null>(null);

  useEffect(() => {
    if (!bpmnXMLDiagram) return () => {};

    (async () => {
      const modeler = new BpmnModeler({
        container: containerRef.current || '',
        keyboard: {
          bindTo: null,
        },
        interaction: {
          draggables: false,
        },
        additionalModules: [
          {
            paletteProvider: ['value', null],
            contextPadProvider: ['value', null],
            bendpoints: ['value', null],
            move: ['value', null],
            labelEditingProvider: ['value', null],
          },
        ],
        moddleExtensions: {
          zeebe: ZeebeBpmnModdle,
        },
      });
      modelerRef.current = modeler;

      try {
        await modeler.importXML(bpmnXMLDiagram);
      } catch (err) {
        console.error('❌ Error during import or lint setup:', err);
      }
    })();

    return () => {
      modelerRef.current?.destroy();
    };
  }, [bpmnXMLDiagram, containerRef.current]);

  useEffect(() => {
    if (!modelerRef.current || !currentProcessElement?.length) return () => {};
    const eventBus = modelerRef.current.get('eventBus');

    const onImportDone = (e: ImportDoneEvent) => {
      goToElement(
        modelerRef.current!,
        currentProcessElement?.[currentProcessElement.length - 1].taskId,
      );
      const overlays = modelerRef.current!.get('overlays');

      currentProcessElement.forEach(({ taskId, type }) => {
        // @ts-ignore
        overlays.add(taskId, {
          position: {
            bottom: 25,
            left: -25,
          },
          html: renderToString(<Circle type={type} />),
        });
      });
    };
    // @ts-ignore
    eventBus?.on('import.done', onImportDone);

    return () => {
      // @ts-ignore
      eventBus?.off('import.done', onImportDone);
    };
  }, [modelerRef.current, bpmnXMLDiagram, currentProcessElement]);

  return (
    <Box
      component="div"
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '.djs-container > svg': {
          background: 'white',
          backgroundImage: 'radial-gradient(black 1px, transparent 0)',
          backgroundSize: '20px 20px',
        },
      }}
    >
      <div style={{ width: '100%', height: '100%' }} ref={containerRef} />
      <Button
        onClick={() => {
          fitToViewport(modelerRef.current!);
        }}
      >
        Zoom to fit
      </Button>
    </Box>
  );
};
