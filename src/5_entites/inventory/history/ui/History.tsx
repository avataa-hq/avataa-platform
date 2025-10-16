import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccordionSummary,
  AccordionDetails,
  Typography,
  Avatar,
  LinearProgress,
  IconButton,
  Menu,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Dayjs } from 'dayjs';
import {
  IObjectHistoryData,
  RightPanelHeader,
  formatQueryDate,
  formatTitleDate,
  transformValue,
  useGetObjectParametersEventsByObjectId,
  useGetObjectTypeParamTypes,
} from '5_entites';
import { CirclePercentageCell } from '6_shared/ui/renderCellComponents/circlePercentage/CirclePercentageCell';
import {
  useTranslate,
  useDebounceValue,
  LoadingAvataa,
  ErrorPage,
  ColoredNumericCell,
  IColorRangeModel,
  useUser,
} from '6_shared';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useCellsVisualisationData } from '5_entites/processManager/lib/table/hooks/useCellsVisualisationData';
import { useTransformObjectHistoryData, useTransformParamNames } from '../hooks';
import { filterHistoryData, findPreviousParam } from '../lib';
import * as SC from './History.styled';
import { DateRangeCustomizer } from '../../comments/ui/dateRangeCustomizer/DateRangeCustomizer';

interface IProps {
  objectId?: number | null;
  historyCount?: number;
  setHistoryCount?: React.Dispatch<React.SetStateAction<number>>;
  newDrawerWidth?: number;
  title?: boolean;
  objectTypeId?: number;
  sortDirection?: 'asc' | 'desc';
  searchValue?: string;
  disableTimezoneAdjustment?: string;

  disabledHeader?: boolean;
  disabledOverflow?: boolean;
  enableHiddenResponseSettings?: boolean;
}

export const History = ({
  objectId,
  historyCount,
  setHistoryCount,
  newDrawerWidth,
  title,
  objectTypeId,
  sortDirection,
  searchValue: externalSearchValue,
  disableTimezoneAdjustment = 'true',

  disabledHeader,
  disabledOverflow,
  enableHiddenResponseSettings,
}: IProps) => {
  const translate = useTranslate();

  const { user } = useUser();

  const [searchValue, setSearchValue] = useState('');
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [newHistoryData, setNewHistoryData] = useState<IObjectHistoryData[]>([]);
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [timeFrom, setTimeFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);
  const [timeTo, setTimeTo] = useState<Dayjs | null>(null);
  const [newOffset, setNewOffset] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isContentOverflowing, setIsContentOverflowing] = useState(false);
  const [isOpenSettingsResponseModal, setIsOpenSettingsResponseModal] = useState(false);

  const settingsButtonRef = useRef<HTMLButtonElement | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { objectTypeParamTypes } = useGetObjectTypeParamTypes({
    objectTmoId: objectTypeId,
  });

  const returnableTprmsIds = useMemo(
    () =>
      objectTypeParamTypes?.reduce<string[]>((acc, param) => {
        if (param.returnable) {
          acc.push(param.id.toString());
        }

        return acc;
      }, []),
    [objectTypeParamTypes],
  );

  const { colorRangesData } = useCellsVisualisationData({
    tprm_ids: returnableTprmsIds,
    is_default: true,
    only_description: false,
  });

  useEffect(() => {
    setSearchValue(externalSearchValue ?? '');
  }, [externalSearchValue]);

  const debounceValue = useDebounceValue(searchValue);

  const paramsStatus: Record<string, any> = {
    CREATED: 'Created',
    UPDATED: 'Updated',
    DELETED: 'Deleted',
  };

  const resetStateWhenDateOrTimeChanged = () => {
    setScrollPosition(0);
    setNewOffset(0);
    setNewHistoryData([]);
  };

  const { paramNames } = useTransformParamNames({ objectTypeParamTypes });

  const {
    objectParameterEventsData,
    isObjectParameterEventsDataFetching,
    isObjectParameterEventsDataError,
    objectParameterEventsDataRefetchFn,
  } = useGetObjectParametersEventsByObjectId({
    objectIds: [objectId!],
    startDate: formatQueryDate(dateFrom, timeFrom),
    endDate: formatQueryDate(dateTo, timeTo),
    offset: newOffset,
    skip: historyCount !== null && historyCount !== undefined && newOffset > historyCount,
  });

  const total = useMemo(
    () => objectParameterEventsData?.[objectId!]?.total || 0,
    [objectId, objectParameterEventsData],
  );

  const { historyData } = useTransformObjectHistoryData({
    objectParameterEventsData: objectParameterEventsData?.[objectId!]?.data,
    objectId,
    dateFrom,
    timeFrom,
    dateTo,
    timeTo,
    resetStateWhenDateOrTimeChanged,
  });

  useEffect(() => {
    setHistoryCount?.(total);
  }, [setHistoryCount, total]);

  useEffect(() => {
    const resetState = () => {
      setDateFrom(null);
      setTimeFrom(null);
      setDateTo(null);
      setTimeTo(null);
      resetStateWhenDateOrTimeChanged();
    };
    resetState();
  }, [objectId]);

  useEffect(() => {
    setIsAllExpanded(false);
    setNewHistoryData(filterHistoryData(historyData, debounceValue, objectTypeParamTypes));
  }, [debounceValue, historyData, objectTypeParamTypes]);

  const handleExpandAll = () => {
    const newExpandedHistoryData = newHistoryData.map((item) => ({
      ...item,
      expanded: !isAllExpanded,
    }));
    setNewHistoryData(newExpandedHistoryData);

    setIsAllExpanded(!isAllExpanded);
  };

  const handleExpand = (idx: number) => {
    const newExpandedHistoryData = [...newHistoryData];
    newExpandedHistoryData[idx].expanded = !newExpandedHistoryData[idx].expanded;
    setNewHistoryData(newExpandedHistoryData);
  };

  useEffect(() => {
    const sortedHistoryData = [...newHistoryData].sort((a, b) => {
      const dateA = new Date(a.params[0].valid_from).getTime();
      const dateB = new Date(b.params[0].valid_from).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setNewHistoryData(sortedHistoryData);
  }, [sortDirection]);

  /**
   * Handles the scrolling event of a container.
   * @param {React.UIEvent<HTMLDivElement>} event - The scroll event.
   */
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    if (scrollTop + clientHeight === scrollHeight) {
      if (!isObjectParameterEventsDataFetching) {
        setScrollPosition(target.scrollTop);
        setNewOffset((prev) => prev + 50);
      }
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current && !isObjectParameterEventsDataFetching) {
      scrollContainerRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition, isObjectParameterEventsDataFetching]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const contentHeight = scrollContainer.scrollHeight;
      const containerHeight = scrollContainer.clientHeight;

      if (
        !isObjectParameterEventsDataFetching &&
        !isContentOverflowing &&
        !isAllExpanded &&
        newOffset < total
      ) {
        setNewOffset((prev) => prev + 50);
      }
      setIsContentOverflowing(contentHeight > containerHeight);
    }
  }, [
    isAllExpanded,
    isContentOverflowing,
    newHistoryData,
    newOffset,
    total,
    isObjectParameterEventsDataFetching,
  ]);

  return (
    <SC.HistoryStyled style={{ overflow: disabledOverflow ? 'none' : 'hidden' }}>
      {!disabledHeader && (
        <RightPanelHeader
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          timeFrom={timeFrom}
          setTimeFrom={setTimeFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          timeTo={timeTo}
          setTimeTo={setTimeTo}
          newDrawerWidth={newDrawerWidth}
        />
      )}

      <SC.TitleWrapper>
        {title && (
          <SC.TitleContent>
            <Typography>{translate('History')}</Typography>
            <SC.TitleInfo>{total}</SC.TitleInfo>
          </SC.TitleContent>
        )}

        {!isObjectParameterEventsDataFetching && newHistoryData.length !== 0 && (
          <SC.ExpandButton onClick={() => handleExpandAll()}>
            {isAllExpanded ? translate('Collapse all') : translate('Expand all')}
          </SC.ExpandButton>
        )}
        {enableHiddenResponseSettings && (
          <IconButton
            sx={{ marginLeft: 'auto' }}
            ref={settingsButtonRef}
            onClick={() => setIsOpenSettingsResponseModal(2 + 2 === 4)}
          >
            <FilterAltIcon />
          </IconButton>
        )}
      </SC.TitleWrapper>

      <SC.HistoryBody
        style={{ overflow: disabledOverflow ? 'none' : 'auto' }}
        onScroll={total >= 50 ? handleScroll : undefined}
        ref={scrollContainerRef}
      >
        {isObjectParameterEventsDataFetching && (
          <SC.LoadingContainer>
            <LoadingAvataa />
          </SC.LoadingContainer>
        )}

        {!isObjectParameterEventsDataFetching && isObjectParameterEventsDataError && (
          <ErrorPage
            error={{ message: translate('An error has occurred, please try again'), code: '404' }}
            refreshFn={objectParameterEventsDataRefetchFn}
          />
        )}

        {!isObjectParameterEventsDataFetching &&
          !isObjectParameterEventsDataError &&
          historyData.length === 0 && (
            <SC.LoadingContainer>
              <Typography>{translate('There are no history')}</Typography>
            </SC.LoadingContainer>
          )}

        {!isObjectParameterEventsDataFetching &&
          !isObjectParameterEventsDataError &&
          newHistoryData.map((item, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <SC.AccordionWrapper key={idx}>
              <SC.DecorContent>
                <Avatar
                  src={user?.picture || 'https://placehold.co/600x400?text=Photo'}
                  alt={user?.name}
                />
                <SC.Line />
              </SC.DecorContent>

              <SC.AccordionStyled disableGutters expanded={item.expanded}>
                <AccordionSummary onClick={() => handleExpand(idx)} expandIcon={<ExpandMore />}>
                  <SC.AccordionContent>
                    <SC.AccordionDate>{formatTitleDate(item.date)}</SC.AccordionDate>
                    <SC.AccordionTitleContent>
                      <Typography>{user?.name}</Typography>
                      <Typography sx={{ fontWeight: 400 }}>
                        {translate(paramsStatus[item.event])}
                      </Typography>
                    </SC.AccordionTitleContent>
                    {/* {findNames(historyData).map(
                      (name, index) =>
                        index === idx && (
                          <Typography key={index}>
                            {name.map((n) => (
                              <ParamName key={index}>{`"${paramNames[n]}" `}</ParamName>
                            ))}
                          </Typography>
                        ),
                    )} */}
                  </SC.AccordionContent>
                </AccordionSummary>

                <AccordionDetails>
                  {item.params.map((param, indexKey) => {
                    const prevParam = findPreviousParam(historyData, param);

                    const p = prevParam?.params.find(
                      (i) => i.parameter_type_id === param.parameter_type_id,
                    );

                    const coloredComponent = colorRangesData?.find(
                      (color: IColorRangeModel) => color.tprmId === String(param.parameter_type_id),
                    );

                    return (
                      <SC.DetailsContent key={indexKey}>
                        {param.user_id !== '' && (
                          <SC.ParamStatus>{`${translate(paramsStatus[param.event_type])}: ${
                            param.user_id
                          }`}</SC.ParamStatus>
                        )}
                        <SC.ParamName
                          onClick={() =>
                            setSearchValue(
                              paramNames !== undefined
                                ? paramNames[param.parameter_type_id].toLowerCase()
                                : '',
                            )
                          }
                        >
                          {paramNames?.[param.parameter_type_id]}
                        </SC.ParamName>

                        {item.event === 'UPDATED' ? (
                          <>
                            {coloredComponent?.tprmId !== String(param.parameter_type_id) && (
                              <SC.ParamContent>
                                <SC.InfoWrapper>
                                  <Typography>{translate('From')}</Typography>
                                  <SC.Description>
                                    {transformValue({
                                      value: p?.old_value,
                                      disableTimezoneAdjustment: !!disableTimezoneAdjustment,
                                    })}
                                  </SC.Description>
                                </SC.InfoWrapper>

                                <SC.InfoWrapper>
                                  <Typography>{translate('To')}</Typography>
                                  <SC.Description>
                                    {transformValue({
                                      value: param.new_value,
                                      disableTimezoneAdjustment: !!disableTimezoneAdjustment,
                                    })}
                                  </SC.Description>
                                </SC.InfoWrapper>
                              </SC.ParamContent>
                            )}

                            {coloredComponent &&
                              coloredComponent.tprmId === String(param.parameter_type_id) && (
                                <SC.ParamContent>
                                  <SC.InfoWrapper>
                                    <Typography>{translate('From')}</Typography>
                                    <SC.Description>
                                      {coloredComponent.value_type === 'Percent' && (
                                        <CirclePercentageCell
                                          value={Number(p?.old_value)}
                                          breakPoints={coloredComponent.ranges.values}
                                          colors={coloredComponent.ranges.colors?.map(
                                            (range: { hex: string }) => range.hex,
                                          )}
                                        />
                                      )}
                                      {coloredComponent.value_type === 'General' && (
                                        <ColoredNumericCell
                                          width="60px"
                                          value={Number(p?.old_value)}
                                          breakPoints={coloredComponent.ranges.values}
                                          colors={coloredComponent.ranges.colors.map(
                                            (range: { hex: string }) => range.hex,
                                          )}
                                        />
                                      )}
                                    </SC.Description>
                                  </SC.InfoWrapper>

                                  <SC.InfoWrapper>
                                    <Typography>{translate('To')}</Typography>
                                    <SC.Description>
                                      {coloredComponent.value_type === 'Percent' && (
                                        <CirclePercentageCell
                                          value={Number(param.new_value)}
                                          breakPoints={coloredComponent.ranges.values}
                                          colors={coloredComponent.ranges.colors.map(
                                            (range: { hex: string }) => range.hex,
                                          )}
                                        />
                                      )}
                                      {coloredComponent.value_type === 'General' && (
                                        <ColoredNumericCell
                                          width="60px"
                                          value={Number(param.new_value)}
                                          breakPoints={coloredComponent.ranges.values}
                                          colors={coloredComponent.ranges.colors.map(
                                            (range: { hex: string }) => range.hex,
                                          )}
                                        />
                                      )}
                                    </SC.Description>
                                  </SC.InfoWrapper>
                                </SC.ParamContent>
                              )}
                          </>
                        ) : (
                          <>
                            {!coloredComponent && (
                              <SC.ParamContent>
                                <Typography>{translate('Value')}:</Typography>
                                <SC.Description>
                                  {transformValue({
                                    value: param.new_value,
                                    disableTimezoneAdjustment: !!disableTimezoneAdjustment,
                                  })}
                                </SC.Description>
                              </SC.ParamContent>
                            )}

                            {coloredComponent &&
                              coloredComponent.tprmId === String(param.parameter_type_id) && (
                                <SC.ParamContent>
                                  <SC.InfoWrapper>
                                    <Typography>{translate('Value')}</Typography>
                                    <SC.Description>
                                      {coloredComponent.value_type === 'Percent' && (
                                        <CirclePercentageCell
                                          value={Number(param.new_value)}
                                          breakPoints={coloredComponent.ranges.values}
                                          colors={coloredComponent.ranges.colors.map(
                                            (range: { hex: string }) => range.hex,
                                          )}
                                        />
                                      )}
                                      {coloredComponent.value_type === 'General' && (
                                        <ColoredNumericCell
                                          width="60px"
                                          value={Number(param.new_value)}
                                          breakPoints={coloredComponent.ranges.values}
                                          colors={coloredComponent.ranges.colors.map(
                                            (range: { hex: string }) => range.hex,
                                          )}
                                        />
                                      )}
                                    </SC.Description>
                                  </SC.InfoWrapper>
                                </SC.ParamContent>
                              )}
                          </>
                        )}
                      </SC.DetailsContent>
                    );
                  })}
                </AccordionDetails>
              </SC.AccordionStyled>
            </SC.AccordionWrapper>
          ))}
      </SC.HistoryBody>
      <SC.HistoryFooter>
        {isObjectParameterEventsDataFetching && <LinearProgress />}
      </SC.HistoryFooter>

      <Menu
        open={isOpenSettingsResponseModal}
        onClose={() => setIsOpenSettingsResponseModal(false)}
        anchorEl={settingsButtonRef.current}
      >
        <div style={{ width: 400 }}>
          <DateRangeCustomizer
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            timeFrom={timeFrom}
            setTimeFrom={setTimeFrom}
            timeTo={timeTo}
            setTimeTo={setTimeTo}
          />
        </div>
      </Menu>
    </SC.HistoryStyled>
  );
};
