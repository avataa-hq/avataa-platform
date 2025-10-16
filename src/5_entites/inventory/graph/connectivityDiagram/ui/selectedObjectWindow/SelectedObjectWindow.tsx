import { IInventoryObjectModel } from '6_shared';
import { Button, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRef } from 'react';
import Draggable from 'react-draggable';
import {
  Content,
  SelectedObjectWindowStyled,
  Body,
  Footer,
  Header,
  ListItem,
  ObjectWindowBackdrop,
} from './SelectedObjectWindow.styled';

interface IProps {
  isOpen: boolean;
  selectedObjects?: IInventoryObjectModel[];
  selectedObject?: IInventoryObjectModel | null;

  onItemClick?: (item: IInventoryObjectModel) => void;
  onCancel?: () => void;
  onMultipleEdit?: (items: IInventoryObjectModel[]) => void;
}

export const SelectedObjectWindow = ({
  isOpen,
  selectedObjects,
  selectedObject,
  onItemClick,
  onMultipleEdit,
  onCancel,
}: IProps) => {
  const objectListContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <ObjectWindowBackdrop>
      <Draggable
        bounds="parent"
        axis={isOpen ? 'both' : 'none'}
        handle=".handle"
        position={isOpen ? undefined : { x: 0, y: 0 }}
        nodeRef={objectListContainerRef}
      >
        <SelectedObjectWindowStyled className="handle" ref={objectListContainerRef}>
          <Content>
            <Header>
              <Typography variant="h3">Selected objects from edges</Typography>
              <IconButton onClick={onCancel}>
                <CloseIcon />
              </IconButton>
            </Header>
            <Body>
              {selectedObjects?.map((obj) => (
                <ListItem
                  onClick={() => onItemClick?.(obj)}
                  sx={({ palette }) => ({
                    backgroundColor:
                      selectedObject?.id === obj.id ? palette.success.main : 'transparent',
                  })}
                  key={obj.id}
                >
                  <Typography>{obj.name}</Typography>
                </ListItem>
              ))}
            </Body>
            <Footer>
              <Button onClick={onCancel} size="small" color="error" variant="contained">
                Cancel
              </Button>
              <Button
                onClick={() => onMultipleEdit?.(selectedObjects ?? [])}
                size="small"
                variant="contained"
              >
                Multiple Edit
              </Button>
            </Footer>
          </Content>
        </SelectedObjectWindowStyled>
      </Draggable>
    </ObjectWindowBackdrop>
  );
};
