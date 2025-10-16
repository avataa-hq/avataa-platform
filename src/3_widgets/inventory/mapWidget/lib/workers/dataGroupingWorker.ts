import type { GeneralMapDataModel } from '6_shared';

interface IProps {
  mapData: GeneralMapDataModel[];
}

export const dataGroupingWorker = () => {
  const isObjectEmpty = (obj: any) => Object.keys(obj).length === 0;

  // const getSimilarObjectsByParentId = (data: GeneralMapDataModel[]) => {
  //   const groupedData: Record<string, any> = {};
  //   const rootObjects: GeneralMapDataModel[] = [];
  //
  //   // Первый проход: группировка объектов по их id
  //   data.forEach((item) => {
  //     const key = item.id.toString();
  //     if (key != null) groupedData[key] = { ...item, similarObjects: [] };
  //   });
  //
  //   // Второй проход: связывание объектов в дерево
  //   data.forEach((item) => {
  //     const key = item.id.toString();
  //     const parentId = item.p_id?.toString();
  //
  //     if (key != null && parentId != null && groupedData[parentId]) {
  //       const parentItem = groupedData[parentId];
  //       const childItem = groupedData[key];
  //       if (!parentItem.geometry || !Object.keys(parentItem.geometry).length) {
  //         if (!parentItem.latitude && !parentItem.longitude) {
  //           parentItem.longitude = childItem.longitude;
  //           parentItem.latitude = childItem.latitude;
  //         }
  //       }
  //       parentItem.similarObjects.push(childItem);
  //     } else {
  //       rootObjects.push(groupedData[key]);
  //     }
  //   });
  //   return rootObjects;
  // };
  const processObjectsWithCoordinates = (data: GeneralMapDataModel[]): any[] => {
    const lineHash: Record<string, any> = {};

    // const groupedData = getSimilarObjectsByParentId(data);

    const sortData = data.sort((a, b) => a.id - b.id);

    sortData.forEach((obj) => {
      let key = '';

      if (obj.geometry && !isObjectEmpty(obj.geometry) && obj.geometry.path) {
        const { coordinates } = obj.geometry.path;

        if (coordinates.length > 0) {
          const sortedCoordinates = coordinates.map((coord) => coord.slice().sort());
          const normalizedKey = sortedCoordinates
            .map((coord) => coord.join(','))
            .sort((a, b) => a.localeCompare(b))
            .join('|');
          key = normalizedKey;
        }
      }

      if (
        (!obj.geometry || isObjectEmpty(obj.geometry)) &&
        obj.latitude !== null &&
        obj.longitude !== null
      ) {
        key = `${obj.latitude}_${obj.longitude}`;
      }

      if (key) {
        if (lineHash[key]) {
          if (!lineHash[key].similarObjects) {
            lineHash[key].similarObjects = [obj];
          } else {
            lineHash[key].similarObjects.push(obj);
          }
        } else {
          lineHash[key] = { ...obj };
        }
      }

      if (lineHash[key] && lineHash[key].similarObjects && lineHash[key].similarObjects.length) {
        if (lineHash[key].minimize) {
          const notMinimizeChild = lineHash[key].similarObjects.find((o: any) => !o.minimize);
          if (notMinimizeChild) {
            const prev = lineHash[key];
            lineHash[key] = {
              ...notMinimizeChild,
              similarObjects: prev.similarObjects.map((so: any) =>
                so.id === notMinimizeChild.id ? prev : so,
              ),
            };
          }
        }
      }
    });

    const result = Object.values(lineHash);

    return result;
  };

  const removeDuplicates = (data: GeneralMapDataModel[]) => {
    const unique: Record<string, GeneralMapDataModel> = {};
    data.forEach((item) => {
      if (!unique[item.id]) unique[item.id] = item;
    });
    return Object.values(unique);
  };

  addEventListener('message', (event: MessageEvent<IProps>) => {
    const { mapData } = event.data;

    const dataWithoutDuplicate = removeDuplicates(mapData);

    const groupedData = processObjectsWithCoordinates(dataWithoutDuplicate);

    postMessage({ newData: groupedData });
  });
};
