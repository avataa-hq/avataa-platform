import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { BaseViewerOptions } from 'bpmn-js/lib/BaseViewer';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import ZeebeBpmnModdle from 'zeebe-bpmn-moddle/resources/zeebe.json';
import BpmnColorPickerModule from 'bpmn-js-color-picker';
import 'bpmn-js-color-picker/colors/color-picker.css';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  ZeebePropertiesProviderModule,
} from 'bpmn-js-properties-panel';
// import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/diagram-js.css';

import lintModule from 'bpmn-js-bpmnlint';
import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css';

import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded';
import { Divider, IconButton, useTheme } from '@mui/material';

import { BpmnIssueDrawer, IBpmnIssue } from '5_entites';
import { Box, LoadingAvataa, useTranslate, useWorkflows } from '6_shared';

import bpmnlintConfig from '5_entites/workflows/config/bpmnLintConfig';

import { LoadingContainer, PropertiesPanel, PropertiesPanelButton } from './Diagram.styled';
import { getInitialBpmnDiagram } from '../../lib';

interface BpmnEditorProps {
  diagramXml?: string;
  isLoading?: boolean;
}

const BpmnEditor = ({ diagramXml, isLoading = false }: BpmnEditorProps) => {
  const translate = useTranslate();
  const theme = useTheme();

  const { activeItem, bpmnModeler, setBpmnModeler, setIsDiagramChanged } = useWorkflows();

  const [isPropertyPanelOpen, setIsPropertyPanelOpen] = useState(false);
  const [isIssueDrawerOpen, setIsIssueDrawerOpen] = useState(false);
  const [bpmnIssues, setBpmnIssues] = useState<IBpmnIssue[]>([]);
  const editorCanvasRef = useRef<HTMLElement>();
  const propertiesPanelContainerRef = useRef<HTMLElement>();
  const modelerRef = useRef<BpmnModeler | null>(null);
  const isDiagramChangedRef = useRef<boolean>(false);

  const bpmnModelerOptions: BaseViewerOptions = useMemo(
    () => ({
      container: editorCanvasRef.current,
      keyboard: {
        bindTo: document,
      },
      propertiesPanel: {
        parent: propertiesPanelContainerRef.current,
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        ZeebePropertiesProviderModule,
        BpmnColorPickerModule,
        lintModule,
      ],
      moddleExtensions: {
        zeebe: ZeebeBpmnModdle,
      },
      linting: {
        bpmnlint: bpmnlintConfig,
        active: true,
      },
    }),
    // In order to create a BpmnModeler with correct DOM elements' refs, the `bpmnModelerOptions` must be updated when the `activeItem` is changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeItem.item?.key],
  );

  const handleDiagramChanges = useCallback(() => {
    if (!isDiagramChangedRef.current) {
      setIsDiagramChanged(true);
      isDiagramChangedRef.current = true;
    }
  }, []);

  // Display diagram
  useEffect(() => {
    if (!diagramXml || isLoading) return () => {};

    const displayDiagram = async () => {
      const modeler = new BpmnModeler(bpmnModelerOptions);
      modelerRef.current = modeler;

      modeler.on('elements.changed', handleDiagramChanges);
      setBpmnModeler(modeler);

      try {
        await modeler.importXML(diagramXml);
      } catch (err) {
        console.error('❌ Error during import or lint setup:', err);
      }
    };

    displayDiagram();

    return () => {
      modelerRef.current?.off('elements.changed', handleDiagramChanges);
      modelerRef.current?.destroy();
      setBpmnModeler(null);
      isDiagramChangedRef.current = false;
    };
  }, [diagramXml, bpmnModelerOptions, isLoading, handleDiagramChanges]);

  // Create new diagram if there is no XML passed
  useEffect(() => {
    if (diagramXml || isLoading || !activeItem.item) return () => {};

    const createNewDiagram = async () => {
      const modeler = new BpmnModeler(bpmnModelerOptions);
      modeler.on('elements.changed', handleDiagramChanges);
      modelerRef.current = modeler;
      setBpmnModeler(modeler);

      try {
        await modeler.importXML(getInitialBpmnDiagram(activeItem.item?.name ?? 'New Diagram'));
      } catch (err) {
        console.error('BPMN diagram creation error', err);
      }
    };

    createNewDiagram();

    return () => {
      modelerRef.current?.off('elements.changed', handleDiagramChanges);
      modelerRef.current?.destroy();
      setBpmnModeler(null);
      isDiagramChangedRef.current = false;
    };
  }, [
    activeItem.item,
    activeItem.item?.name,
    bpmnModelerOptions,
    diagramXml,
    handleDiagramChanges,
    isLoading,
  ]);

  const zeebeVersion = useMemo(() => {
    if (!diagramXml) return '';

    let bpmnZeeveVersion = '';

    try {
      const bpmnVersion = new DOMParser()
        .parseFromString(diagramXml, 'text/xml')
        .querySelector('definitions')
        ?.getAttribute('modeler:executionPlatformVersion');

      if (bpmnVersion) {
        bpmnZeeveVersion = bpmnVersion;
      }
    } catch (error) {
      console.error('Error during parsing xml', error);
    }

    return bpmnZeeveVersion ?? '';
  }, [diagramXml]);

  useEffect(() => {
    if (!bpmnModeler || !diagramXml) return () => {};
    const linting: any = bpmnModeler.get('linting');

    const runLint = async () => {
      try {
        // await bpmnModeler.importXML(diagramXml);
        // @ts-ignore
        // const moddle = bpmnModeler.get('moddle');
        // const definitions = await moddle.fromXML(diagramXml);
        // const version = definitions?.rootElement?.$attrs?.['modeler:executionPlatformVersion'];
        // setZeebeVersion(version);

        const issues: IBpmnIssue[] = await linting.lint();
        const filteredIssues = Object.values(issues ?? {})
          .flat()
          .filter((issue) => issue.id);

        setBpmnIssues(filteredIssues);
      } catch (error) {
        console.warn('❌ Lint error:', error);
      }
    };

    bpmnModeler.on('linting.completed', runLint);
    // bpmnModeler.on('commandStack.changed', runLint);

    runLint();

    return () => {
      bpmnModeler.off('linting.completed', runLint);
      // bpmnModeler.off('commandStack.changed', runLint);
    };
  }, [bpmnModeler, diagramXml]);

  const handleIssueClick = (issueId: string) => {
    const modeler = modelerRef.current;
    if (!modeler) return;

    const elementRegistry: any = modeler.get('elementRegistry');
    const selection: any = modeler.get('selection');

    const element: any = elementRegistry.get(issueId);
    if (element) {
      selection.select(element);
      // @ts-ignore
      modeler.get('canvas').scrollToElement(element);
    } else {
      console.warn(`⚠️ Element with id ${issueId} not found in diagram.`);
    }
  };

  return (
    <Box className="bpmn-editor" display="flex" width="100%" height="100%" position="relative">
      <>
        <Box
          ref={editorCanvasRef}
          width="100%"
          height="100%"
          className="bpmn-canvas canvas"
          position="relative"
          overflow="hidden"
        >
          {bpmnModeler && !isLoading && (
            <PropertiesPanelButton
              onClick={() => setIsPropertyPanelOpen((prevState) => !prevState)}
              disableRipple
            >
              {translate('Details')} <Divider orientation="vertical" flexItem />
              <SubjectRoundedIcon sx={{ transform: 'rotate(90deg)' }} />
            </PropertiesPanelButton>
          )}
        </Box>
        <PropertiesPanel
          ref={propertiesPanelContainerRef}
          className={classNames('bpmn-properties-panel-parent', {
            open: isPropertyPanelOpen,
          })}
        />
      </>
      {isLoading && (
        <LoadingContainer>
          <LoadingAvataa />
        </LoadingContainer>
      )}

      <BpmnIssueDrawer
        bpmnIssues={bpmnIssues}
        isIssueDrawerOpen={isIssueDrawerOpen}
        setIsIssueDrawerOpen={setIsIssueDrawerOpen}
        handleIssueClick={handleIssueClick}
        zeebeVersion={zeebeVersion}
      />

      {bpmnModeler && (
        <IconButton
          sx={{
            widith: '100px',
            height: '16px',
            borderRadius: '4px',
            position: 'absolute',
            right: '50%',
            bottom: '0',
            backgroundColor: theme.palette.primary.main,
            '&:hover': { backgroundColor: theme.palette.primary.light },
          }}
          onClick={() => setIsIssueDrawerOpen(true)}
        >
          <KeyboardArrowUpIcon sx={{ fill: theme.palette.common.white }} />
        </IconButton>
      )}
    </Box>
  );
};

export default BpmnEditor;
