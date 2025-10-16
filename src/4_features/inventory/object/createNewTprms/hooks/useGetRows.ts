import { useMemo } from 'react';

import { BlankColumn } from '../model';

export const useGetRows = (newParams: BlankColumn[]) => {
  const rows = useMemo(
    () =>
      newParams.map((item) => ({
        id: item.id,
        name: item.name,
        description: '',
        val_type: 'str',
        multiple: false,
        required: false,
        searchable: false,
        returnable: true,
        automation: false,
        group: '',
        constraint: '',
        prm_link_filter: '',
        field_value: '',
      })),
    [newParams],
  );

  return rows;
};
