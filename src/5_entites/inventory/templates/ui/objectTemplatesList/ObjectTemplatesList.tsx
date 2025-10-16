import { useState } from 'react';
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Box,
  ActionTypes,
  CancelIcon,
  IGetTemplatesByFilterResponse,
  IObjectTemplateModel,
  LoadingAvataa,
  useTranslate,
} from '6_shared';
import { ISecondaryActionSlotProps } from '../../model/types';
import { CenteredBox } from './ObjectTemplatesList.styled';

interface IProps {
  selectedTemplateId?: number | null;
  templatesData: IGetTemplatesByFilterResponse | undefined;
  isLoading: boolean;
  onTemplateClick: (template: IObjectTemplateModel) => void;
  onNotValidClick?: (template: IObjectTemplateModel) => void;
  isSelectedIbjectType?: boolean;
  isEditTemplateName?: boolean;
  secondaryActionSlot?: (props: ISecondaryActionSlotProps) => React.ReactNode;
  permissions?: Record<ActionTypes, boolean>;
}

export const ObjectTemplatesList = ({
  selectedTemplateId,
  templatesData,
  isLoading,
  onTemplateClick,
  onNotValidClick,
  isSelectedIbjectType = true,
  isEditTemplateName,
  secondaryActionSlot,
  permissions,
}: IProps) => {
  const translate = useTranslate();

  const [editedTemplateName, setEditedTemplateName] = useState('');

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {isLoading && (
        <CenteredBox>
          <LoadingAvataa />
        </CenteredBox>
      )}

      {!isLoading && (
        <Box
          sx={{
            width: '100%',
            height: '95%',
            overflow: 'auto',
          }}
        >
          {!isSelectedIbjectType && (
            <CenteredBox>
              <Typography sx={{ textAlign: 'center' }}>
                {translate('Select object type')}
              </Typography>
            </CenteredBox>
          )}
          {templatesData?.data?.length === 0 && (
            <CenteredBox>
              <Typography sx={{ textAlign: 'center' }}>
                {translate('There are no templates for selected object type')}
              </Typography>
            </CenteredBox>
          )}
          {templatesData?.data?.length !== 0 && (
            <List>
              {templatesData?.data?.map((item) => (
                <ListItem
                  key={item.id}
                  disablePadding
                  secondaryAction={secondaryActionSlot?.({
                    item,
                    selectedTemplateId,
                    editedTemplateName,
                    isEditTemplateName,
                    setEditedTemplateName,
                  })}
                >
                  <ListItemButton
                    disableRipple
                    selected={item.id === selectedTemplateId}
                    // disableRipple={!item.valid}
                    disabled={permissions?.update !== true}
                    onClick={() => onTemplateClick(item)}
                    sx={{ opacity: item.valid ? 1 : 0.5 }}
                  >
                    {!item.valid && (
                      <Tooltip title={translate('Template is not valid')} placement="top">
                        <ListItemIcon>
                          <IconButton onClick={() => onNotValidClick?.(item)}>
                            <CancelIcon fontSize="small" sx={{ fill: 'red' }} />
                          </IconButton>
                        </ListItemIcon>
                      </Tooltip>
                    )}
                    <ListItemText sx={{ ...(!item.valid && { maxWidth: '150px' }) }}>
                      {isEditTemplateName && selectedTemplateId === item.id ? (
                        <TextField
                          value={editedTemplateName ?? item.name}
                          onChange={(e) => setEditedTemplateName(e.target.value)}
                          variant="standard"
                          autoFocus
                        />
                      ) : (
                        item.name
                      )}
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}
    </Box>
  );
};
