import { JsonEditor } from 'json-edit-react';
import { IInventoryGeometryModel } from '6_shared';
import { useTheme, Typography } from '@mui/material';
import * as SC from './ObjectGeometryEditor.styled';

interface IProps {
  geometry: IInventoryGeometryModel | null;
  getNewObjectGeometry: (newGeometry: IInventoryGeometryModel) => void;
}

export const ObjectGeometryEditor = ({ geometry, getNewObjectGeometry }: IProps) => {
  const theme = useTheme();

  const jsonEditorTheme = {
    styles: {
      container: {
        backgroundColor: theme.palette.neutral.surfaceContainerLowestVariant2,
        fontSize: '12px',
      },
      property: {
        color: theme.palette.text.primary,
      },
      bracket: {
        color: theme.palette.text.primary,
      },
      string: {
        color: theme.palette.text.primary,
      },
      collectionInner: {
        marginBottom: '10px',
        paddingBottom: '10px',
      },
      iconEdit: {
        color: theme.palette.primary.main,
      },
    },
  };

  const handleUpdate = ({ newData }: any) => {
    getNewObjectGeometry(newData as IInventoryGeometryModel);
  };

  // const handleRestrictEdit = ({ level, key, value }: any) => {
  //   return (
  //     level === 0 ||
  //     (key === 'path' && value === 'string') ||
  //     key === 'coordinates' ||
  //     typeof value === 'object'
  //   );
  // };

  return (
    <SC.ObjectGeometryEditorStyled>
      <Typography sx={{ marginBottom: '10px' }}>Geometry</Typography>
      <SC.GeometryEditWrapper>
        <JsonEditor
          data={geometry ?? {}}
          onUpdate={handleUpdate}
          theme={jsonEditorTheme}
          maxWidth={300}
          restrictDelete
          restrictAdd
          restrictTypeSelection
          // restrictEdit={handleRestrictEdit}
          rootName="geometry"
          enableClipboard={false}
          showCollectionCount={false}
        />
      </SC.GeometryEditWrapper>
    </SC.ObjectGeometryEditorStyled>
  );
};
