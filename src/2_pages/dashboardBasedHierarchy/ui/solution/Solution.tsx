import { memo, useCallback } from 'react';
import { ErrorData, ErrorPage, InventoryAndHierarchyObjectTogether } from '6_shared';
import { SolutionTable } from './table/SolutionTable';
import { SolutionTableSkeleton } from './table/SolutionTableSkeleton';
import { SolutionStyled } from './Solution.styled';

interface IProps {
  solutionData?: InventoryAndHierarchyObjectTogether[];
  isLoading?: boolean;
  error?: ErrorData;
  refetchFn?: () => void;
  onSolutionRowClick?: (row: InventoryAndHierarchyObjectTogether) => void;
  onSolutionContextMenuClick?: (t: any, r: any) => void;
}

export const Solution = memo(
  ({
    solutionData,
    isLoading,
    error,
    refetchFn,
    onSolutionRowClick,
    onSolutionContextMenuClick,
  }: IProps) => {
    const handleRowClick = useCallback(
      (
        e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
        r: InventoryAndHierarchyObjectTogether,
      ) => {
        onSolutionRowClick?.(r);
      },
      [onSolutionRowClick],
    );

    if (isLoading) {
      return (
        <SolutionStyled>
          <SolutionTableSkeleton />
        </SolutionStyled>
      );
    }

    if (error) {
      return (
        <SolutionStyled>
          <ErrorPage error={error} refreshFn={refetchFn} />
        </SolutionStyled>
      );
    }

    return (
      <SolutionStyled>
        {solutionData && (
          <SolutionTable
            onTableContextMenuClick={onSolutionContextMenuClick}
            onRowClick={handleRowClick}
            solutionData={solutionData}
          />
        )}
      </SolutionStyled>
    );
  },
);
