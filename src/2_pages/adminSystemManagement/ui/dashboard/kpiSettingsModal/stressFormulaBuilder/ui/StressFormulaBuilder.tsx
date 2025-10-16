import { useRef } from 'react';
import { useTheme } from '@emotion/react';
import { useTranslate, Box } from '6_shared';
import { DialogContent, DialogTitle, Typography } from '@mui/material';
import MonacoEditor, { OnMount, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

import { format } from 'sql-formatter';

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { sqlQuery } from '../lib/mockFormulaData';

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      // eslint-disable-next-line new-cap
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      // eslint-disable-next-line new-cap
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      // eslint-disable-next-line new-cap
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      // eslint-disable-next-line new-cap
      return new tsWorker();
    }
    // eslint-disable-next-line new-cap
    return new editorWorker();
  },
};

loader.config({ monaco });

export const StressFormulaBuilder = () => {
  const theme = useTheme();
  const translate = useTranslate();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const getEditorTheme = () => (theme.palette.mode === 'dark' ? 'vs-dark' : 'vs-light');

  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;

    // eslint-disable-next-line no-bitwise
    editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyZ, () => {
      editor.trigger('keyboard', 'undo', null);
    });

    // eslint-disable-next-line no-bitwise
    editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS, () =>
      formatSQL(),
    );
  };

  const formatSQL = () => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const currentValue = editor.getValue();
      const formattedSQL = format(currentValue, { language: 'sql' });
      const fullRange = editor.getModel()?.getFullModelRange();

      if (fullRange) {
        editor.executeEdits('format-sql', [
          {
            range: fullRange,
            text: formattedSQL,
            forceMoveMarkers: true,
          },
        ]);
      }
    }
  };

  return (
    <Box>
      <DialogTitle>{translate('SQL Query for Stress Level Calculation')}</DialogTitle>
      <DialogContent sx={{ padding: '0' }}>
        <Box overflow="hidden" borderRadius="10px" mb={2}>
          <MonacoEditor
            height="400px"
            width="100%"
            defaultLanguage="sql"
            defaultValue={sqlQuery}
            theme={getEditorTheme()}
            options={{
              readOnly: false,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
            onMount={handleEditorDidMount}
          />
        </Box>
      </DialogContent>
      <Typography
        padding="0 20px"
        sx={{
          fontWeight: 'normal',
          lineHeight: 1.5,
        }}
      >
        {translate('You can use')}{' '}
        <span
          style={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
          }}
        >
          ctrl+s
        </span>{' '}
        {translate('to format the code, and also')}{' '}
        <span
          style={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
          }}
        >
          ctrl+z
        </span>{' '}
        {translate('to undo an action or')}{' '}
        <span
          style={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
          }}
        >
          ctrl+shift+z
        </span>{' '}
        {translate('to redo an action')}.
      </Typography>
    </Box>
  );
};
