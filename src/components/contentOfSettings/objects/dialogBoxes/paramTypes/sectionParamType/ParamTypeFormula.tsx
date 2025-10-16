import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import {
  debounce,
  IconButton,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import { Box, useSettingsObject, useTranslate } from '6_shared';
import {
  ConstraintContainer,
  InputTitle,
  StrInputContainer,
} from '../../ObjectAndParamTypeModal.styled';

export const ParamTypeFormula = () => {
  const translate = useTranslate();
  const theme = useTheme();

  const { paramState, isEditParamModalOpen, setParamState } = useSettingsObject();

  const [formula, setFormula] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  interface FormulaHint {
    expression_type: string;
    example: string;
    example2: null | string;
  }

  const formulaHint: FormulaHint[] = [
    {
      expression_type: translate('Ordinary Expression'),
      example: `parameter['tprm_name'] + 24423`,
      example2: null,
    },
    {
      expression_type: translate('True'),
      example: 'True',
      example2: null,
    },
    {
      expression_type: translate('False'),
      example: 'False',
      example2: null,
    },
    {
      expression_type: translate('Multiple Check'),
      example: `if parameter['tprm_name'] == 15 and parameter['tprm_name'] > 20 then parameter['tprm_name'] + 1;`,
      example2: null,
    },
    {
      expression_type: translate('Or'),
      example: `if parameter['tprm_name'] == 15 or parameter['tprm_name'] > 20 then parameter['tprm_name'] + 1;`,
      example2: null,
    },
    {
      expression_type: translate('Just If'),
      example: `if parameter['tprm_name'] == 15 then parameter['tprm_name'] + 1;`,
      example2: null,
    },
    {
      expression_type: translate('If-Else'),
      example: `if parameter['tprm_name'] == 15 and parameter['tprm_name'] > 20 then parameter['tprm_name'] + 1; else parameter['tprm_name'] + 22`,
      example2: null,
    },
    {
      expression_type: translate('If with elif'),
      example: `if parameter['tprm_name'] > 1 then parameter['tprm_name'] + 1; elif parameter['tprm_name'] == 2 then parameter['tprm_name'] + 1;`,
      example2: null,
    },
    {
      expression_type: 'If / elif / else',
      example: `if parameter['tprm_name'] > 1 then parameter['tprm_name'] + 1; elif parameter['tprm_name'] == 2 then parameter['tprm_name'] + 1; else parameter['tprm_name'] + 22`,
      example2: null,
    },
    {
      expression_type: 'X',
      example: 'x + 1',
      example2: null,
    },
    {
      expression_type: 'Math expression',
      example: `parameter['tprm_name'] + math.sin(30)`,
      example2: `parameter['tprm_name'] + math.sqrt(4)`,
    },
    {
      expression_type: 'Execute some python function',
      example: `if parameter['tprm_name'] > 5 then int('ffff', 16); else 10/5`,
      example2: null,
    },
  ];

  useEffect(() => {
    setFormula(paramState.formula);
  }, []);

  const debounceDispatchFormula = debounce((newFormula) => {
    setParamState({
      ...paramState,
      formula: newFormula,
      isErrorFormula: false,
      errorFormulaMessage: ' ',
    });
  }, 300);

  const handleFormulaChange = (event: any) => {
    const newFormula = event.target.value;
    setFormula(newFormula);
    debounceDispatchFormula(newFormula);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ConstraintContainer mb="20px">
      <StrInputContainer>
        <InputTitle>{translate('Constraint')}</InputTitle>
        <Box
          display="flex"
          justifyContent="space-between"
          marginBottom={isEditParamModalOpen ? '20px' : '0px'}
        >
          <TextField
            size="small"
            autoComplete="off"
            placeholder="formula"
            value={formula}
            onChange={handleFormulaChange}
            error={paramState.isErrorFormula}
            helperText={paramState.errorFormulaMessage}
            sx={{ width: '100%' }}
          />
          <Box>
            <IconButton aria-describedby={id} sx={{ height: '40px' }} onClick={handleClick}>
              <LiveHelpIcon />
            </IconButton>
            <Popover id={id} open={open} onClose={handleClose} anchorEl={anchorEl}>
              <TableContainer component={Paper} sx={{}}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          borderRight: `1px solid ${theme.palette.neutralVariant.tableBorder}`,
                          padding: '5px 20px',
                          fontWeight: 600,
                        }}
                      >
                        {translate('Expression Type')}
                      </TableCell>
                      <TableCell sx={{ padding: '5px 20px', fontWeight: 600 }}>
                        {translate('Example')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formulaHint.map((hint) => (
                      <TableRow key={hint.expression_type}>
                        <TableCell
                          sx={{
                            borderRight: `1px solid ${theme.palette.neutralVariant.tableBorder}`,
                            padding: '5px 20px',
                          }}
                        >
                          {hint.expression_type}
                        </TableCell>
                        <TableCell sx={{ padding: '5px 20px', fontStyle: 'italic' }}>
                          {hint.example}
                          <br />
                          {hint.example2 || null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Popover>
          </Box>
        </Box>
      </StrInputContainer>
    </ConstraintContainer>
  );
};
