import { useEffect, useState } from 'react';
import { ISpeedometerData } from '6_shared';
import { Regions } from './regions/Regions';
import { Table } from './table/Table';
import { BodyStyled } from './Body.styled';

interface IProps {
  speedometersData: ISpeedometerData[];
  tableDataWeek: ISpeedometerData[];
  tableDataMonth: ISpeedometerData[];
  tableDataYear: ISpeedometerData[];
}

interface IMergedTableData {
  [key: string]: {
    week: ISpeedometerData;
    month: ISpeedometerData;
    year: ISpeedometerData;
    direction: string;
  };
}

export const Body = ({
  speedometersData,
  tableDataWeek,
  tableDataMonth,
  tableDataYear,
}: IProps) => {
  const [tableData, setTableData] = useState<IMergedTableData>({});

  useEffect(() => {
    const mergedTableData: IMergedTableData = tableDataWeek.reduce((acc, item, index) => {
      if (item?.name) {
        acc[item.name] = {
          week: item,
          month: tableDataMonth[index] || {},
          year: tableDataYear[index] || {},
          direction: 'up',
        };
      }

      return acc;
    }, {} as IMergedTableData);

    setTableData(mergedTableData);
  }, [tableDataMonth, tableDataWeek, tableDataYear]);
  return (
    <BodyStyled>
      <Regions speedometersData={speedometersData} />
      <Table tableData={tableData} />
    </BodyStyled>
  );
};
