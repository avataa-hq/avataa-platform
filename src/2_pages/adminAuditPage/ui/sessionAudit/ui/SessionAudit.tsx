import { useState } from 'react';
import { GridPaginationModel } from '@mui/x-data-grid-pro';
import {
  AuditOptionsType,
  SessionAuditHeader,
  SessionAuditTable,
  useGetSessionRegistryData,
} from '5_entites';
import { useGenerateSessionAuditColumns } from '../lib';
import { SessionAuditStyled, SessionAuditContainer, SessionAuditBody } from './SessionAudit.styled';

interface IProps {
  onSelectedAuditChange: (item: AuditOptionsType) => void;
}

export const SessionAudit = ({ onSelectedAuditChange }: IProps) => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 20,
    page: 0,
  });
  const [dateRange, setDateRange] = useState<{
    dateFrom: string | undefined;
    dateTo: string | undefined;
  }>({ dateFrom: undefined, dateTo: undefined });

  const { sessionAuditData, isSessionAuditFetching } = useGetSessionRegistryData({
    limit: paginationModel.pageSize,
    offset: paginationModel.page * paginationModel.pageSize,
    datetime_from: dateRange.dateFrom,
    datetime_to: dateRange.dateTo,
  });

  const { columns, rows } = useGenerateSessionAuditColumns({
    sessionAuditData: sessionAuditData?.response_data,
    onSelectedAuditChange,
  });

  const handlePaginationChange = (newModel: GridPaginationModel) => {
    setPaginationModel(newModel);
  };

  const onApplyDateFilter = (dateFrom: string | undefined, dateTo: string | undefined) => {
    setDateRange({ dateFrom, dateTo });
  };

  return (
    <SessionAuditStyled>
      <SessionAuditContainer>
        <SessionAuditHeader onApplyDateFilter={onApplyDateFilter} />

        <SessionAuditBody>
          <SessionAuditTable
            rows={rows}
            columns={columns}
            isLoading={isSessionAuditFetching}
            paginationModel={paginationModel}
            handlePaginationChange={handlePaginationChange}
            total={sessionAuditData?.total}
          />
        </SessionAuditBody>
      </SessionAuditContainer>
    </SessionAuditStyled>
  );
};
