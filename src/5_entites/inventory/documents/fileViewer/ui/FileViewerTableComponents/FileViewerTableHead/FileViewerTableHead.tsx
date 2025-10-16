import { ArrowDropUp } from '@mui/icons-material';
import { TableRow, TableSortLabel, Typography } from '@mui/material';
import { useTranslate } from '6_shared';
import * as SC from './FileViewerTableHead.styled';

interface IProps {
  onSortLabelClick: (type: string) => void;
}

export const FileViewerTableHead = ({ onSortLabelClick }: IProps) => {
  const translate = useTranslate();

  return (
    <TableRow>
      <SC.TableCellStyled>
        <TableSortLabel IconComponent={ArrowDropUp} onClick={() => onSortLabelClick('')}>
          <Typography whiteSpace="nowrap">{translate('File name')}</Typography>
        </TableSortLabel>
      </SC.TableCellStyled>

      <SC.TableCellStyled align="center">
        <TableSortLabel IconComponent={ArrowDropUp} onClick={() => onSortLabelClick('')}>
          <Typography>{translate('Type')}</Typography>
        </TableSortLabel>
      </SC.TableCellStyled>

      <SC.TableCellStyled align="center">
        <TableSortLabel IconComponent={ArrowDropUp} onClick={() => onSortLabelClick('')}>
          <Typography>{translate('Download')}</Typography>
        </TableSortLabel>
      </SC.TableCellStyled>

      <SC.TableCellStyled align="center">
        <TableSortLabel IconComponent={ArrowDropUp} onClick={() => onSortLabelClick('')}>
          <Typography>{translate('Preview')}</Typography>
        </TableSortLabel>
      </SC.TableCellStyled>

      <SC.TableCellStyled align="center">
        <TableSortLabel IconComponent={ArrowDropUp} onClick={() => onSortLabelClick('')}>
          <Typography>{translate('Update')}</Typography>
        </TableSortLabel>
      </SC.TableCellStyled>

      <SC.TableCellStyled align="center">
        <TableSortLabel IconComponent={ArrowDropUp} onClick={() => onSortLabelClick('')}>
          <Typography>{translate('Link')}</Typography>
        </TableSortLabel>
      </SC.TableCellStyled>

      <SC.TableCellStyled align="center">
        <TableSortLabel IconComponent={ArrowDropUp} onClick={() => onSortLabelClick('')}>
          <Typography>{translate('Status')}</Typography>
        </TableSortLabel>
      </SC.TableCellStyled>

      <SC.TableCellStyled align="center">
        <TableSortLabel IconComponent={ArrowDropUp} onClick={() => onSortLabelClick('')}>
          <Typography>{translate('Owner')}</Typography>
        </TableSortLabel>
      </SC.TableCellStyled>

      <SC.TableCellStyled>
        <TableSortLabel IconComponent={ArrowDropUp} onClick={() => onSortLabelClick('date')}>
          <Typography whiteSpace="nowrap">{translate('Creation date')}</Typography>
        </TableSortLabel>
      </SC.TableCellStyled>

      <SC.TableCellStyled> </SC.TableCellStyled>

      <SC.TableCellStyled> </SC.TableCellStyled>
    </TableRow>
  );
};
