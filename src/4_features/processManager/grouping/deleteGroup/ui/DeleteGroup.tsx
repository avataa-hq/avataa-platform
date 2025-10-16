import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { Box, IProcessGroupModel } from '6_shared';

const EMPTY_GROUP_ERROR_MESSAGE = 'At least one group must be selected';

interface IProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  groupList?: IProcessGroupModel[];
  isLoadingGroupList?: boolean;
  isLoadingDeleteGroup?: boolean;
  onDeleteClick?: (group: string[]) => Promise<void>;
  selectedGroup?: string[];
}

export const DeleteGroup = ({
  setIsOpen,
  isOpen,
  groupList,
  isLoadingGroupList,
  isLoadingDeleteGroup,
  onDeleteClick,
  selectedGroup,
}: IProps) => {
  const [value, setValue] = useState<IProcessGroupModel[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const selGroup: IProcessGroupModel[] = [];
    if (selectedGroup && groupList) {
      groupList.forEach((gItem) => {
        if (selectedGroup.includes(gItem.group_name)) {
          selGroup.push(gItem);
        }
      });
      setValue(selGroup);
    }
  }, [selectedGroup, groupList]);

  const clearStates = () => {
    setValue([]);
    setIsError(false);
    setErrorMessage('');
    setIsOpen(false);
  };

  const handleClose = () => {
    clearStates();
  };

  const onChange = (newValue: IProcessGroupModel[]) => {
    setIsError(false);
    setValue(newValue);
  };

  const onDelete = async () => {
    // validation
    if (value == null) {
      setIsError(true);
      setErrorMessage(EMPTY_GROUP_ERROR_MESSAGE);
      return;
    }

    // call function from props
    await onDeleteClick?.(value.map((v) => v.group_name));

    // clear
    clearStates();
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Delete group</DialogTitle>
        <DialogContent>
          <DialogContentText>You must select the group that will be deleted</DialogContentText>
          <Box display="flex" justifyContent="center" width="100%" mt={2}>
            <FormControl error={isError} fullWidth>
              <FormLabel color="primary" sx={{ mb: 1 }}>
                Select Group
              </FormLabel>
              <Autocomplete
                selectOnFocus
                clearOnBlur
                multiple
                options={groupList || []}
                getOptionLabel={(opt) => opt.group_name}
                value={value}
                onChange={(_, newValue) => onChange(newValue)}
                loading={isLoadingGroupList}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingGroupList ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              {isError && <FormHelperText sx={{ mb: 0.5 }}>{errorMessage}</FormHelperText>}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant={isLoadingDeleteGroup ? 'text' : 'contained'} onClick={onDelete}>
            {isLoadingDeleteGroup ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
