import { AuditDateRange } from '5_entites/adminAudit/auditDateRange/AuditDateRange';
import { SessionAuditHeaderStyled } from './SessionAuditHeader.styled';

interface IProps {
  onApplyDateFilter: (dateFrom: string | undefined, dateTo: string | undefined) => void;
}

export const SessionAuditHeader = ({ onApplyDateFilter }: IProps) => {
  return (
    <SessionAuditHeaderStyled>
      <AuditDateRange onApplyDateRange={onApplyDateFilter} />
    </SessionAuditHeaderStyled>
  );
};
