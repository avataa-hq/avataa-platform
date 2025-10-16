import { Button, Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { inventoryParamValTypes } from '5_entites';
import { IObjectComponentParams, Modal, useTranslate } from '6_shared';
import { StringMultipleComponent } from '../StringMultipleComponent/StringMultipleComponent';
import { BooleanMultipleComponent } from '../BooleanMultipleComponent/BooleanMultipleComponent';
import { DateMultipleComponent } from '../DateMultipleComponent/DateMultipleComponent';
import { SubText } from '../../commonComponents';
import { DateTimeMultipleComponent } from '../DateTimeMultipleComponent/DateTimeMultipleComponent';

interface IProps {
  isModalOpen: boolean;
  handleClose: () => void;
  param: IObjectComponentParams;
}

export const MultipleModal = ({ isModalOpen, handleClose, param }: IProps) => {
  const translate = useTranslate();
  const { formState, clearErrors, setValue, getValues } = useFormContext();

  const onSaveClick = () => {
    handleClose();
    const paramValue = getValues(param.id.toString());
    setValue(param.id.toString(), paramValue);
    clearErrors(param.id.toString());
  };

  const onCancelClick = () => {
    if (Object.keys(formState.errors).some((key) => key.startsWith(`${param.id.toString()}`))) {
      setValue(param.id.toString(), '');
    }

    handleClose();
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      title={`Set value for existing objects for the ${param.name} field`}
      width={420}
      actions={
        <>
          <Button variant="outlined" onClick={onCancelClick}>
            {translate('Cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={onSaveClick}
            disabled={Object.keys(formState.errors).some((key) =>
              key.startsWith(`${param.id.toString()}`),
            )}
          >
            {translate('Save')}
          </Button>
        </>
      }
    >
      <>
        <SubText sx={{ marginBottom: '16px' }}>
          {`You specified this parameter type as multiple and required. Please enter the default list
          of ${inventoryParamValTypes[param.val_type]} values:`}
        </SubText>

        <Box component="div">
          {['str', 'int', 'float'].includes(param.val_type) && (
            <StringMultipleComponent param={param} />
          )}
          {param.val_type === 'bool' && <BooleanMultipleComponent param={param} />}
          {param.val_type === 'date' && <DateMultipleComponent param={param} />}
          {param.val_type === 'datetime' && <DateTimeMultipleComponent param={param} />}
        </Box>
      </>
    </Modal>
  );
};
