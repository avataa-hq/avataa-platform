import styled from '@emotion/styled';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view';
import { GANT_ROW_HEIGHT } from '6_shared';

interface ITreeItemProps extends TreeItemProps {
  barcolor?: string;
}

export const TreeItemStyled = styled(TreeItem)<ITreeItemProps>`
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
  height: ${GANT_ROW_HEIGHT}px;
  box-sizing: border-box;

  /* Если внутри (в потомках) есть элемент с классом .Mui-expanded,
     то этому родителю поставить height: auto */
  &:has(.Mui-expanded) {
    height: auto;
  }

  & .MuiTreeItem-content {
    height: ${GANT_ROW_HEIGHT}px;
    padding: 0 5px;
    ::before {
      content: '';
      display: ${({ barcolor }) => (barcolor ? 'block' : 'none')};
      width: 5px;
      height: 37px;
      background: ${({ barcolor }) => barcolor};

      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      border-radius: 0 10px 10px 0;
      z-index: 2;
    }
  }
`;

export const TreeItemTaskStyled = styled(TreeItemStyled)`
  .MuiTreeItem-iconContainer {
    display: none;
  }
  & .MuiTreeItem-content {
    padding: 0 5px;
  }
`;
