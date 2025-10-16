import { useCallback, useEffect, useState } from 'react';
import { IInventorySearchObjectModel, useConfig } from '6_shared';
import { useGetObjectsBySearchValue } from './useGetObjectsBySearchValue';
import { IOption, ISearchResponseModel } from '../types';
import { createOption, parseCoordinates, processSearchQuery } from '../lib';

interface IProps {
  searchQuery: string;
}

export const useSearchData = ({ searchQuery }: IProps) => {
  const { config } = useConfig();
  const apiKey = config._mapboxApiAccessToken;
  const allowedCounties = config._map_allowed_search_counties;

  const [options, setOptions] = useState<IOption[]>([]);
  const [objectOptions, setObjectOptions] = useState<IOption[]>([]);
  const [allOptions, setAllOptions] = useState<IOption[]>([]);
  const [isLocationSearchLoading, setIsLocationSearchLoading] = useState(false);
  const [totalObjects, setTotalObjects] = useState<number | null>(null);
  const [newOffset, setNewOffset] = useState(0);
  const [inventoryObjectsData, setInventoryObjectsData] = useState<IInventorySearchObjectModel[]>(
    [],
  );

  const { inventoryObjectsSearchData, isInventoryObjectsDataFetching } = useGetObjectsBySearchValue(
    {
      searchValue: searchQuery,
      newOffset,
      skip:
        (totalObjects !== null && totalObjects !== undefined && newOffset >= totalObjects) ||
        searchQuery === '',
    },
  );

  // const sortOptions = (a: IOption, b: IOption) => {
  //   const isMatchA = a.name.toLowerCase().startsWith(searchQuery.toLowerCase());
  //   const isMatchB = b.name.toLowerCase().startsWith(searchQuery.toLowerCase());

  //   if (isMatchA && isMatchB) {
  //     return a.name.localeCompare(b.name);
  //   }
  //   if (isMatchA && !isMatchB) {
  //     return -1;
  //   }
  //   if (!isMatchA && isMatchB) {
  //     return 1;
  //   }
  //   return a.name.localeCompare(b.name);
  // };

  const generateLocationSearchUrl = useCallback(() => {
    let url = '';

    // if (searchQuery.trim().includes(',')) {
    //   const [latitude, longitude] = searchQuery.trim().split(',');
    //   url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?country=${allowedCounties}&access_token=${apiKey}`;
    // } else {
    //   url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    //     searchQuery,
    //   )}.json?country=${allowedCounties}&access_token=${apiKey}`;
    // }

    const coords = parseCoordinates(searchQuery.trim());
    const processedSearchQuery = processSearchQuery(searchQuery);

    if (searchQuery.trim().includes(',') && coords) {
      const [longitude, latitude] = coords;
      url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&country=${allowedCounties}&access_token=${apiKey}`;
    } else {
      url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
        processedSearchQuery,
      )}&country=${allowedCounties}&access_token=${apiKey}`;
    }

    return url;
  }, [allowedCounties, apiKey, searchQuery]);

  const locationSearch = useCallback(async () => {
    setIsLocationSearchLoading(true);
    try {
      const response = await fetch(generateLocationSearchUrl());
      if (response.status === 200) {
        const data: ISearchResponseModel = await response.json();
        return data;
      }
    } catch (error) {
      throw new Error(error);
    }
    return null;
  }, [generateLocationSearchUrl]);

  useEffect(() => {
    if (!inventoryObjectsSearchData) return;
    setTotalObjects(inventoryObjectsSearchData.total_hits);
    setInventoryObjectsData((prev) => {
      const updatedData = [...prev];
      inventoryObjectsSearchData.objects.forEach((newOption) => {
        if (!prev.some((option) => option.id === newOption.id)) {
          updatedData.push(newOption);
        }
      });
      return updatedData;
    });
    const newObjectOptions: IOption[] = inventoryObjectsSearchData.objects.map((item) => {
      if (item.name.startsWith(searchQuery)) {
        return createOption({
          item,
          groupName: 'Objects',
        });
      }
      return createOption({
        item,
        groupName: 'Parameters',
      });
    });

    setObjectOptions((prev) => {
      const updatedOptions = [...prev];
      newObjectOptions.forEach((newOption: IOption) => {
        if (!prev.some((option) => option.id === newOption.id)) {
          updatedOptions.push(newOption);
        }
      });
      return updatedOptions;
    });
  }, [inventoryObjectsSearchData, searchQuery]);

  useEffect(() => {
    locationSearch().then((searchResponse) => {
      if (searchResponse?.features) {
        const { features } = searchResponse;
        const newOptions = features.map((item) => ({
          id: item.id,
          // name: item.place_name,
          name: item.properties.full_address,
          geometry: item.geometry,
          group: 'Geographic',
        }));
        setOptions(newOptions);
      }
      setIsLocationSearchLoading(false);
    });
  }, [locationSearch]);

  useEffect(() => {
    if (!isLocationSearchLoading) {
      // const newAllOptions = [...options, ...objectOptions].sort(sortOptions);
      const newAllOptions = [...objectOptions, ...options];
      setAllOptions(newAllOptions);
    }
  }, [isLocationSearchLoading, objectOptions, options]);

  useEffect(() => {
    if (searchQuery || searchQuery === '') {
      setObjectOptions([]);
      setAllOptions([]);
      setInventoryObjectsData([]);
      setNewOffset(0);
      setTotalObjects(null);
    }
  }, [searchQuery]);

  return {
    allOptions,
    setNewOffset,
    totalObjects,
    isInventoryObjectsDataFetching,
    isLocationSearchLoading,
    objectOptionsLength: objectOptions.length,
    inventoryObjectsData,
  };
};
