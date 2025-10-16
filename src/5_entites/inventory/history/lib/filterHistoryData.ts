import { IObjectHistoryData } from '5_entites';
import { InventoryParameterTypesModel } from '6_shared';

export const filterHistoryData = (
  historyData: IObjectHistoryData[],
  searchQuery: string,
  objectTypeParamTypes: InventoryParameterTypesModel[] | undefined,
) => {
  const filteredSearchData = historyData
    .map((item) => {
      const filteredParams = item.params.filter(
        (param) =>
          param.new_value?.toString().toLowerCase().includes(searchQuery) ||
          param.user_id.toString().toLowerCase().includes(searchQuery) ||
          item.event.toString().toLowerCase().includes(searchQuery) ||
          item.date.toString().includes(searchQuery) ||
          objectTypeParamTypes?.some(
            (parameter) =>
              parameter.id === param.parameter_type_id &&
              parameter.name.toLowerCase().includes(searchQuery),
          ),
      );

      return { ...item, params: filteredParams };
    })
    .filter((item) => item.params.length > 0);

  return filteredSearchData;
};
