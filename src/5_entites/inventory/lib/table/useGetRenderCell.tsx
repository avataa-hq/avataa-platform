import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { useCallback } from 'react';
import {
  ColoredBooleanCell,
  parametersApi,
  objectsApi,
  InternalProjectLink,
  HasFileCell,
  HAS_FILE,
  ROW_GROUPING_COLUMN_PREFIX,
} from '6_shared';
import { InventoryValType } from '6_shared/api/inventory/types';
import { useLinkClicks } from './useLinkClicks';

interface IProps {
  type: string;
  params: GridRenderCellParams;
  val_type?: InventoryValType;
}

export const useGetRenderCell = () => {
  const { useLazyGetParameterQuery } = parametersApi;
  const { useLazyGetObjectWithParametersQuery } = objectsApi;

  const [getParameter] = useLazyGetParameterQuery();
  const [getAttributes] = useLazyGetObjectWithParametersQuery();

  const { handleObjectLinkClick, handleAttributesClick } = useLinkClicks({
    getParameter,
    getAttributes,
  });

  const getRenderCell = useCallback(
    ({ params, type, val_type }: IProps) => {
      if (type === 'boolean') {
        return <ColoredBooleanCell value={params.value} />;
      }

      if (
        params.rowNode.type === 'group' &&
        params.field === `${ROW_GROUPING_COLUMN_PREFIX}${params.rowNode.groupingField}__`
      ) {
        return <div>{params.rowNode.groupingKey}</div>;
      }

      if (val_type === 'mo_link') {
        return (
          <>
            {(Array.isArray(params.value) ? params.value : [params.value]).map(
              (moLink, moLinkIndex, arr) => (
                <InternalProjectLink
                  key={moLink + moLinkIndex}
                  onClick={() =>
                    handleObjectLinkClick(
                      params.row.id,
                      Number.parseInt(params.field, 10),
                      moLinkIndex,
                    )
                  }
                >
                  {moLink}
                  {moLinkIndex !== arr.length - 1 && ','}
                </InternalProjectLink>
              ),
            )}
          </>
        );
      }

      return undefined;
    },
    [handleObjectLinkClick],
  );

  const getRenderCellForAttributes = useCallback(
    (params: GridRenderCellParams, field: string) => {
      if (params.value !== '-') {
        return (
          <InternalProjectLink onClick={() => handleAttributesClick(params.row.id, field)}>
            {params.value}
          </InternalProjectLink>
        );
      }
      return undefined;
    },
    [handleAttributesClick],
  );

  const getRenderCellForHasFileColumn = (params: GridRenderCellParams) => (
    <HasFileCell hasFiles={params.row[HAS_FILE]} />
  );

  return { getRenderCell, getRenderCellForAttributes, getRenderCellForHasFileColumn };
};
