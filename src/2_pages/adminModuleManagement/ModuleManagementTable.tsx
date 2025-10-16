import { Dispatch, SetStateAction, useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Checkbox, IconButton } from '@mui/material';
import { Edit as EditIcon, Check as CheckIcon } from '@mui/icons-material';
import { useTheme } from '@emotion/react';

import { DarkDisabledTextField, useTranslate } from '6_shared';
import type { ModuleSettings } from './ModuleManagement';

interface IProps {
  moduleSettings: ModuleSettings;
  setModuleSettings: Dispatch<SetStateAction<ModuleSettings>>;
  editRow: number | null;
  setEditRow: Dispatch<SetStateAction<number | null>>;
}

export const ModuleManagementTable = ({
  moduleSettings,
  setModuleSettings,
  editRow,
  setEditRow,
}: IProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const translate = useTranslate();

  const handleEditStart = (index: number) => {
    setEditRow(index);
    const textField = inputRef.current;
    if (textField) {
      textField.focus();
    }
  };

  const handleEditEnd = () => {
    setEditRow(null);
  };

  const handleInputChange = (key: string, newValue: string) => {
    setModuleSettings((prevModuleSettings: ModuleSettings) => ({
      ...prevModuleSettings,
      [key]: { ...prevModuleSettings[key], customName: newValue },
    }));
  };

  const handleCheckboxChange = (key: any) => {
    setModuleSettings((prevModuleSettings: ModuleSettings) => ({
      ...prevModuleSettings,
      [key]: {
        ...prevModuleSettings[key],
        accessibility: !prevModuleSettings[key].accessibility,
      },
    }));
  };

  if (moduleSettings) {
    return (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              style={{
                fontWeight: 'bold',
                padding: '0 2rem',
                width: '20%',
                border: `1px solid ${theme.palette.neutralVariant.outline}`,
              }}
            >
              {translate('Module accessibility')}
            </TableCell>
            <TableCell
              align="center"
              style={{
                fontWeight: 'bold',
                padding: '1rem 2rem',
                border: `1px solid ${theme.palette.neutralVariant.outline}`,
              }}
            >
              {translate('Default module name')}
            </TableCell>
            <TableCell
              align="center"
              style={{
                fontWeight: 'bold',
                padding: '0 2rem',
                border: `1px solid ${theme.palette.neutralVariant.outline}`,
              }}
            >
              {translate('Custom module name')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(moduleSettings)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([key, { accessibility, customName, defaultName }], index) => (
              <TableRow key={key}>
                <TableCell
                  style={{
                    border: `1px solid ${theme.palette.neutralVariant.outline}`,
                  }}
                  align="center"
                >
                  <Checkbox
                    checked={accessibility}
                    onChange={() => handleCheckboxChange(key)}
                    inputProps={{
                      'aria-label': 'controlled',
                    }}
                    data-testid={`${defaultName}__accessibility`}
                  />
                </TableCell>
                <TableCell
                  style={{
                    padding: '0 1rem',
                    border: `1px solid ${theme.palette.neutralVariant.outline}`,
                  }}
                >
                  <DarkDisabledTextField
                    InputProps={{
                      disableUnderline: true,
                    }}
                    variant="standard"
                    value={translate(defaultName as any)}
                    fullWidth
                    size="small"
                    disabled
                  />
                </TableCell>
                <TableCell
                  style={{
                    padding: '0 1rem',
                    border: `1px solid ${theme.palette.neutralVariant.outline}`,
                  }}
                >
                  <DarkDisabledTextField
                    ref={inputRef}
                    variant="standard"
                    value={customName}
                    onChange={(e: { target: { value: string } }) =>
                      handleInputChange(key, e.target.value)
                    }
                    fullWidth
                    size="small"
                    disabled={editRow !== index}
                    InputProps={{
                      autoFocus: editRow === index,
                      disableUnderline: true,
                      onKeyPress: (event: { key: string; preventDefault: () => void }) => {
                        if (event.key === 'Enter') {
                          setEditRow(null);
                          event.preventDefault();
                        }
                      },
                      onDoubleClick: () => {
                        handleEditStart(index);
                      },
                      inputProps: {
                        'data-testid': `${defaultName}__custom-name`,
                      },
                      endAdornment: (
                        <IconButton
                          onClick={
                            editRow === index ? () => handleEditEnd() : () => handleEditStart(index)
                          }
                          style={{ float: 'right' }}
                        >
                          {editRow === index ? <CheckIcon /> : <EditIcon />}
                        </IconButton>
                      ),
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    );
  }

  return <h1>{translate('Something went wrong when loading')}</h1>;
};
