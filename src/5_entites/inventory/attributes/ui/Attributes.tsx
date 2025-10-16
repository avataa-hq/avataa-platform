import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FormatIndentDecrease as FormatIndentDecreaseIcon,
  FormatIndentIncrease as FormatIndentIncreaseIcon,
  ExpandMore,
} from '@mui/icons-material';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { AccordionDetails, IconButton, Typography, Box, Tooltip } from '@mui/material';
import {
  type INewObjectParams,
  type IParams,
  type ICustomInputs,
  useGetObjectGroupedParams,
  useGetObjectTypeById,
  useUpdateMultipleObjects,
  transformGroupName,
  createMultipleEditBody,
  useDeleteObjectParameter,
  useCreateMultipleParameters,
  useUpdateMultipleParameters,
  deleteObjectParameter,
  isResponseVersionConflict,
  ParameterComponents,
  transformValue,
  useGetInventoryObjectData,
  useGetObjectByFiltersById,
  useGetDataForTooltipName,
  getFilteredData,
  type ISystemDataAttributesUpdateBody,
  ParentIDOption,
} from '5_entites';
import {
  ActionTypes,
  ConfirmActionModal,
  ErrorPage,
  ITableColumnSettingsModel,
  LoadingAvataa,
  MultipleParameterUpdateBody,
  UpdateMultipleObjectsBody,
  useDebounceValue,
  useTranslate,
} from '6_shared';
import ErrorBoundary from '5_entites/errorBoundary/ErrorBoundary';
import { Attribute } from './Attribute';
import { SystemDataAttributes } from './systemDataAttributes/SystemDataAttributes';
import * as SC from './Attributes.styled';

type ParamsSettings = {
  [key: string]: {
    editing: boolean;
    step: number;
  };
};

interface IProps {
  objectId: number | null;
  newDrawerWidth?: number;
  defaultColumnsSettings?: ITableColumnSettingsModel;
  setParamsResolverOpen?: (isOpen: boolean) => void;
  setParamsResolverUpdateBody?: (body: MultipleParameterUpdateBody[] | null) => void;
  setParamsResolverUpdateObjectBody?: (body: UpdateMultipleObjectsBody | null) => void;
  setParamsResolverParentIdOptions?: (options: Record<string, ParentIDOption> | null) => void;
  permissions?: Record<ActionTypes, boolean>;
}

export const Attributes = ({
  objectId,
  newDrawerWidth = 320,
  defaultColumnsSettings,
  setParamsResolverOpen,
  setParamsResolverUpdateBody,
  setParamsResolverUpdateObjectBody,
  setParamsResolverParentIdOptions,
  permissions,
}: IProps) => {
  const translate = useTranslate();

  const [newObjectParams, setNewObjectParams] = useState<INewObjectParams[]>([]);
  const [isAllExpanded, setIsAllExpanded] = useState(true);
  const [paramTypeId, setParamTypeId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isSystemDataExpanded, setIsSystemDataExpanded] = useState<boolean>(true);
  const [excludedParams, setExcludedParams] = useState<string[]>([]);
  const [paramsSettings, setParamsSettings] = useState<ParamsSettings>({});
  const [showMoreStep, setShowMoreStep] = useState(10);
  const [isEditedSystemAttributes, setIsEditedSystemAttributes] = useState(false);
  const [rightPanelAttributesState, setRightPanelAttributesState] = useState<
    INewObjectParams[] | null
  >(null);
  const [systemDataAttributesUpdateBody, setSystemDataAttributesUpdateBody] =
    useState<ISystemDataAttributesUpdateBody | null>(null);

  const debouncedScrollPosition = useDebounceValue(scrollPosition);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const prevTmoIdRef = useRef<number | null>(null);
  const paramRefs = useRef<Array<HTMLDivElement | null>>([]);
  const centralParamRef = useRef<HTMLDivElement | null>(null);

  const { inventoryObjectData } = useGetInventoryObjectData({ objectId });

  const { objectByFilters } = useGetObjectByFiltersById({
    objectId,
    tmoId: inventoryObjectData?.tmo_id ?? 0,
  });

  const { inventoryObjectTypeData } = useGetObjectTypeById({
    tmoId: inventoryObjectData?.tmo_id,
  });

  const { objectParams, isObjectParamsFetching, isObjectParamsError, objectParamsRefetchFn } =
    useGetObjectGroupedParams({ objectId });

  const { createTooltipText } = useGetDataForTooltipName({
    objectParams,
  });

  const isLoading = isObjectParamsFetching;

  const { deleteObjectParameterFn } = useDeleteObjectParameter();
  const { updateMultipleObjectFn } = useUpdateMultipleObjects();
  const { createMultipleParameters } = useCreateMultipleParameters();
  const { updateMultipleParameters } = useUpdateMultipleParameters();

  const form = useForm({
    mode: 'onChange',
  });
  const { handleSubmit, reset, formState } = form;

  const paramTypeIds = useMemo(
    () => objectParams?.flatMap((p) => p.params?.map((param) => param.tprm_id) ?? []) ?? [],
    [objectParams],
  );

  const onSubmit: SubmitHandler<ICustomInputs> = async (data) => {
    const { createParamsBody, updateParamsBody } = createMultipleEditBody({
      newData: getFilteredData({ data, paramTypeIds }),
      inventoryObjectData,
      checkValueEquality: true,
    });

    if (createParamsBody.length) {
      await createMultipleParameters(createParamsBody);
    }

    if (updateParamsBody.length) {
      const res = await updateMultipleParameters(updateParamsBody);

      if (isResponseVersionConflict(res)) {
        setParamsResolverUpdateBody?.(updateParamsBody);
        setParamsResolverOpen?.(true);
      }
    }

    if (systemDataAttributesUpdateBody && inventoryObjectData) {
      const body: UpdateMultipleObjectsBody = {
        object_id: systemDataAttributesUpdateBody.id,
        data_for_update: {
          version: systemDataAttributesUpdateBody.version,
        },
      };

      if (inventoryObjectData.p_id !== systemDataAttributesUpdateBody.p_id) {
        body.data_for_update.p_id = systemDataAttributesUpdateBody.p_id;
      }

      if (inventoryObjectData.point_a_id !== systemDataAttributesUpdateBody.point_a_id) {
        body.data_for_update.point_a_id = systemDataAttributesUpdateBody.point_a_id;
      }

      if (inventoryObjectData.point_b_id !== systemDataAttributesUpdateBody.point_b_id) {
        body.data_for_update.point_b_id = systemDataAttributesUpdateBody.point_b_id;
      }

      if (Object.keys(body.data_for_update).length > 1) {
        const res = await updateMultipleObjectFn([body]);

        if (isResponseVersionConflict(res)) {
          setParamsResolverUpdateObjectBody?.(body);
          setParamsResolverOpen?.(true);
        } else {
          setSystemDataAttributesUpdateBody(null);
          setParamsResolverParentIdOptions?.(null);
        }
      }
    }

    setIsEditedSystemAttributes(false);
    reset();
  };

  useEffect(() => {
    if (isEditedSystemAttributes && inventoryObjectData) {
      setSystemDataAttributesUpdateBody({
        id: inventoryObjectData.id,
        version: inventoryObjectData.version,
        p_id: objectByFilters?.p_id === 0 ? null : objectByFilters?.p_id,
        point_a_id: objectByFilters?.point_a_id === 0 ? null : objectByFilters?.point_a_id,
        point_b_id: objectByFilters?.point_b_id === 0 ? null : objectByFilters?.point_b_id,
      });
    }
  }, [
    objectByFilters,
    setSystemDataAttributesUpdateBody,
    isEditedSystemAttributes,
    inventoryObjectData,
  ]);

  useEffect(() => {
    if (defaultColumnsSettings) {
      const paramsToExclude = Object.entries(
        defaultColumnsSettings.value?.tableInitialState?.columns?.columnVisibilityModel ?? {},
      ).reduce((acc, [key, value]) => {
        if (value === false) {
          acc.push(key);
        }
        return acc;
      }, [] as string[]);
      setExcludedParams(paramsToExclude);
    }
  }, [defaultColumnsSettings]);

  useEffect(() => {
    if (!objectParams) return;

    const newParams = objectParams.map((item) => ({
      ...item,
      expanded: true,
      params: item.params
        .reduce((acc, param) => {
          if (!excludedParams.includes(param.tprm_id.toString())) {
            const newParam = {
              ...param,
              expanded: false,
              constraint: param.constraint,
              showExpandButton:
                param.value !== null &&
                ['str', 'int', 'float'].includes(param.val_type) &&
                transformValue({
                  value: param.value,
                  valType: param.val_type,
                }).length > 120,
            };
            acc.push(newParam);
          }
          return acc;
        }, [] as IParams[])
        .filter((i) => i.val_type !== 'formula'),
    }));

    const indexMap =
      defaultColumnsSettings?.value?.tableInitialState?.columns?.orderedFields?.reduce(
        (acc, field, index: number) => {
          acc[field] = index;
          return acc;
        },
        {} as Record<string, number>,
      );

    if (indexMap) {
      const sortedParams = newParams.map((obj) => {
        const sortedPar = obj.params.sort((a, b) => {
          return indexMap[a.tprm_id.toString()] - indexMap[b.tprm_id.toString()];
        });
        return { ...obj, params: sortedPar };
      });

      setNewObjectParams(sortedParams.reverse());
    }

    if (!indexMap) {
      setNewObjectParams(newParams.reverse());
    }

    const initialParamsSettings = newParams.reduce((acc, item, index) => {
      acc[`${index}`] = { step: showMoreStep, editing: false };
      return acc;
    }, {} as ParamsSettings);
    setParamsSettings(initialParamsSettings);
  }, [
    objectParams,
    excludedParams,
    showMoreStep,
    defaultColumnsSettings?.value?.tableInitialState?.columns?.orderedFields,
  ]);

  const handleExpand = (idx: number) => {
    const newExpandedAccordions = [...newObjectParams];
    newExpandedAccordions[idx].expanded = !newExpandedAccordions[idx].expanded;
    setNewObjectParams(newExpandedAccordions);
    setRightPanelAttributesState(newExpandedAccordions);
  };

  const toggleExpand = (groupIdx: number, paramIdx: number) => {
    const newExpandedAccordions = [...newObjectParams];
    const newParams = [...newExpandedAccordions[groupIdx].params];
    newParams[paramIdx] = { ...newParams[paramIdx], expanded: !newParams[paramIdx].expanded };
    newExpandedAccordions[groupIdx] = { ...newExpandedAccordions[groupIdx], params: newParams };
    setNewObjectParams(newExpandedAccordions);
    setRightPanelAttributesState(newExpandedAccordions);
  };

  const handleExpandParam = (groupIdx: number, paramIdx: number) => {
    toggleExpand(groupIdx, paramIdx);
  };

  const handleExpandAll = () => {
    const newExpandedAccordions = newObjectParams.map((item) => ({
      ...item,
      expanded: !isAllExpanded,
    }));
    setNewObjectParams(newExpandedAccordions);
    setRightPanelAttributesState(newExpandedAccordions);

    setIsAllExpanded(!isAllExpanded);
  };

  useEffect(() => {
    setIsSystemDataExpanded(isAllExpanded);
  }, [isAllExpanded]);

  useEffect(() => {
    if (isObjectParamsFetching) {
      setIsEditedSystemAttributes(false);
      reset();
    }
  }, [isObjectParamsFetching, setIsEditedSystemAttributes]);

  const handleDeleteParamClick = async () => {
    setIsModalOpen(false);
    await deleteObjectParameter({
      objectId,
      paramTypeId,
      inventoryObjectData,
      deleteObjectParameterFn,
    });
    reset();
    setNewObjectParams([]);
    objectParamsRefetchFn();
  };

  const onDeleteClick = (newParamTypeId: number) => {
    setIsModalOpen(true);
    setParamTypeId(newParamTypeId);
  };

  useEffect(() => {
    if (!inventoryObjectData) return;

    if (!prevTmoIdRef.current || inventoryObjectData.tmo_id !== prevTmoIdRef.current) {
      setScrollPosition(0);
      setRightPanelAttributesState(null);

      prevTmoIdRef.current = inventoryObjectData.tmo_id;
    }
  }, [inventoryObjectData, setRightPanelAttributesState]);

  useEffect(() => {
    if (!inventoryObjectData) return;
    const tmoId = inventoryObjectData.tmo_id;

    if (
      !isObjectParamsFetching &&
      rightPanelAttributesState &&
      tmoId === newObjectParams?.[0]?.params?.[0]?.tmo_id
    ) {
      const restoreExpandedAccordions = newObjectParams.map((item, idx) => ({
        ...item,
        expanded: rightPanelAttributesState[idx].expanded,
      }));
      setNewObjectParams(restoreExpandedAccordions);
    }
  }, [inventoryObjectData, isObjectParamsFetching, rightPanelAttributesState]);

  useEffect(() => {
    if (!isObjectParamsFetching && inventoryObjectData && scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition;
    }
  }, [isObjectParamsFetching, inventoryObjectData]);

  useEffect(() => {
    setTimeout(() => {
      setScrollPosition(debouncedScrollPosition);
    }, 300);
  }, [debouncedScrollPosition, setScrollPosition]);

  useEffect(() => {
    if (centralParamRef.current) {
      centralParamRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [paramsSettings]);

  // ============================ no needed ===================================
  // useEffect(() => {
  //   if (!triggerResetOnClose) {
  //     setIsEditedSystemAttributes(false);
  //     setParamsSettings((prevSettings) => {
  //       const updatedSettings: ParamsSettings = {};

  //       Object.keys(prevSettings).forEach((key) => {
  //         updatedSettings[key] = {
  //           ...prevSettings[key],
  //           editing: false,
  //         };
  //       });

  //       return updatedSettings;
  //     });
  //   }
  // }, [triggerResetOnClose]);

  // useEffect(() => {
  //   Object.entries(paramsSettings).forEach(([key, value]) => {
  //     if (value.editing && containerRefs.current[Number(key)]) {
  //       containerRefs.current[Number(key)]?.scrollIntoView({
  //         behavior: 'smooth',
  //         block: 'center',
  //       });
  //     }
  //   });
  // }, [paramsSettings]);
  // ============================ no needed ===================================

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop } = target;
    if (scrollTop) {
      setScrollPosition(scrollTop);
    }
  };

  const onGroupEditClick = (groupIdx: number) => {
    reset();
    setParamsSettings((prevSettings) => {
      const updatedSettings: ParamsSettings = {};

      Object.keys(prevSettings).forEach((key) => {
        updatedSettings[key] = {
          ...prevSettings[key],
          editing: key === `${groupIdx}`,
        };
      });

      return updatedSettings;
    });

    const visibleParams = paramRefs.current.filter((param) => {
      if (!param || !scrollRef.current) return false;
      const rect = param.getBoundingClientRect();
      const containerRect = scrollRef.current.getBoundingClientRect();
      return rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;
    });

    const centralParam = visibleParams[Math.floor(visibleParams.length / 2)];
    centralParamRef.current = centralParam;
    // const centralParamIndex = centralParam?.id;
    // if (centralParamIndex && centralParam) {
    //   centralParamIndexRef.current = +centralParamIndex;
    // }

    setIsEditedSystemAttributes(false);
  };

  const onApplyChanges = async () => {
    await handleSubmit(onSubmit)();
    setParamsSettings((prevSettings) => {
      const updatedSettings: ParamsSettings = {};

      Object.keys(prevSettings).forEach((key) => {
        updatedSettings[key] = {
          ...prevSettings[key],
          editing: false,
        };
      });

      return updatedSettings;
    });
    reset();
  };

  const onCloseGroupEditClick = (groupIdx: number) => {
    setParamsSettings((prevSettings) => ({
      ...prevSettings,
      [`${groupIdx}`]: {
        ...prevSettings[`${groupIdx}`],
        editing: !prevSettings[`${groupIdx}`].editing,
      },
    }));
    reset();
  };

  const onEditSystemAttributesClick = () => {
    setParamsSettings((prevSettings) => {
      const updatedSettings: ParamsSettings = {};

      Object.keys(prevSettings).forEach((key) => {
        updatedSettings[key] = {
          ...prevSettings[key],
          editing: false,
        };
      });

      return updatedSettings;
    });

    reset();
    setIsEditedSystemAttributes(true);
  };

  const onCloseSystemAttributesChanges = () => {
    setIsEditedSystemAttributes(false);
    reset();
  };

  return (
    <FormProvider {...form}>
      <SC.AttributesStyled ref={scrollRef} onScroll={handleScroll}>
        {isLoading && (
          <SC.LoadingContainer>
            <LoadingAvataa />
          </SC.LoadingContainer>
        )}
        {!isLoading && isObjectParamsError && (
          <ErrorPage
            error={{ message: translate('An error has occurred, please try again'), code: '404' }}
            refreshFn={objectParamsRefetchFn}
          />
        )}
        {!isLoading && !isObjectParamsError && newObjectParams.length === 0 && !objectByFilters && (
          <SC.LoadingContainer>
            <Typography>{translate('There are no attributes')}</Typography>
          </SC.LoadingContainer>
        )}
        {!isLoading &&
          !isObjectParamsError &&
          newObjectParams &&
          newObjectParams.map((group, idx) => (
            <SC.AccordionStyled expanded={group.expanded} key={group.name}>
              <SC.AccordionSummaryStyled
                expandIcon={<ExpandMore onClick={() => handleExpand(idx)} />}
              >
                <SC.AccordionSummaryContent>
                  <Tooltip
                    title={
                      group.name && group.name.length > 11
                        ? translate(transformGroupName(group.name) as any)
                        : ''
                    }
                    placement="top"
                  >
                    <Typography
                      sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '90px' }}
                    >
                      {translate(transformGroupName(group.name) as any)}
                    </Typography>
                  </Tooltip>

                  <SC.ButtonsWrapper>
                    {!paramsSettings?.[`${idx}`]?.editing && (
                      <SC.IconButtonStyled
                        disabled={!permissions?.update}
                        data-testid="right-panel-attributes__edit-group-button"
                        onClick={() => {
                          onGroupEditClick(idx);
                          if (!group.expanded) {
                            handleExpand(idx);
                          }
                        }}
                      >
                        <SC.EditIconStyled />
                      </SC.IconButtonStyled>
                    )}
                    {paramsSettings?.[`${idx}`]?.editing && (
                      <Box component="div" display="flex" position="relative" zIndex={100}>
                        <SC.ApplyButtonStyled
                          onClick={() => {
                            onApplyChanges();
                            onGroupEditClick(idx);
                          }}
                          data-testid="right-panel-attributes__apply-group-changes-button"
                          disabled={Object.keys(formState.errors).length > 0}
                        >
                          <SC.ApplyIconStyled />
                        </SC.ApplyButtonStyled>
                        <IconButton
                          onClick={() => {
                            onCloseGroupEditClick(idx);
                            onCloseSystemAttributesChanges();
                          }}
                          data-testid="right-panel-attributes__discard-group-changes-button"
                        >
                          <SC.CancelChangesIconStyled />
                        </IconButton>
                      </Box>
                    )}

                    {!paramsSettings?.[`${idx}`]?.editing && (
                      <IconButton onClick={() => handleExpandAll()}>
                        {isAllExpanded ? (
                          <FormatIndentDecreaseIcon />
                        ) : (
                          <FormatIndentIncreaseIcon />
                        )}
                      </IconButton>
                    )}
                  </SC.ButtonsWrapper>
                </SC.AccordionSummaryContent>
              </SC.AccordionSummaryStyled>
              <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Box
                  component="div"
                  sx={{
                    display: newDrawerWidth > 700 ? 'grid' : 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    gridTemplateColumns: '1fr 1fr',
                  }}
                >
                  {group.params.map((param, paramIdx) => {
                    const textElement = document.getElementById(paramIdx.toString());
                    let showExpandButton = false;
                    if (textElement) {
                      const lineHeight = parseFloat(getComputedStyle(textElement).lineHeight);
                      const maxLines = 5;
                      const textHeight = lineHeight * maxLines;
                      showExpandButton = textElement.scrollHeight > textHeight + 10;
                      param.showExpandButton = showExpandButton;
                    }

                    if (param.value !== null && !paramsSettings?.[`${idx}`]?.editing) {
                      return (
                        <Box
                          component="div"
                          key={param.tprm_id}
                          ref={(el: HTMLDivElement | null) => {
                            paramRefs.current[idx * group.params.length + paramIdx] = el;
                          }}
                          id={param.tprm_id.toString()}
                        >
                          <Attribute param={param} />
                          {param.showExpandButton && (
                            <SC.ExpandButton onClick={() => handleExpandParam(idx, paramIdx)}>
                              {param.expanded ? translate('Collapse') : translate('Expand')}
                            </SC.ExpandButton>
                          )}
                        </Box>
                      );
                    }

                    if (paramsSettings?.[`${idx}`]?.editing) {
                      const testid = `right-panel-attributes__${param?.group ?? 'no-group'}-${
                        param?.name ?? 'no-name'
                      }__input`;

                      return (
                        <Box component="div" key={param.tprm_id} id={param.tprm_id.toString()}>
                          <Typography sx={{ marginBottom: '5px' }}>{param.name}</Typography>

                          <ParameterComponents
                            param={param}
                            isEdited={paramsSettings?.[`${idx}`]?.editing}
                            onDeleteClick={onDeleteClick}
                            createTooltipText={createTooltipText}
                            showDeleteButton={!(param.required || param.value === null)}
                            customNotMultipleWrapperSx={{
                              fontWeight: 400,
                              maxHeight: param.expanded ? 'none' : '8.5em',
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              textOverflow: 'ellipsis',
                              WebkitLineClamp: param.expanded ? 'unset' : 5,
                            }}
                            testid={testid}
                          />

                          {!param.multiple && param.showExpandButton && (
                            <SC.ExpandButton onClick={() => handleExpandParam(idx, paramIdx)}>
                              {param.expanded ? translate('Collapse') : translate('Expand')}
                            </SC.ExpandButton>
                          )}
                        </Box>
                      );
                    }

                    return null;
                  })}
                </Box>
              </AccordionDetails>
            </SC.AccordionStyled>
          ))}
        {!isLoading && !isObjectParamsError && objectByFilters && (
          <ErrorBoundary fallback="Right side panel error Attributes SystemDataAttributes">
            <SystemDataAttributes
              objectAttributes={objectByFilters}
              isSystemDataExpanded={isSystemDataExpanded}
              setIsSystemDataExpanded={() => setIsSystemDataExpanded(!isSystemDataExpanded)}
              handleExpandAll={handleExpandAll}
              isAllExpanded={isAllExpanded}
              isEdited={isEditedSystemAttributes}
              inventoryObjectTypeData={inventoryObjectTypeData}
              inventoryObjectData={inventoryObjectData}
              onApplyChanges={onApplyChanges}
              onCloseChanges={onCloseSystemAttributesChanges}
              onEditClick={onEditSystemAttributesClick}
              setSystemDataAttributesUpdateBody={setSystemDataAttributesUpdateBody}
              setParamsResolverParentIdOptions={setParamsResolverParentIdOptions}
              newDrawerWidth={newDrawerWidth}
              permissions={permissions}
            />
          </ErrorBoundary>
        )}
        <ConfirmActionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirmActionClick={handleDeleteParamClick}
          title={translate('Are you sure you want to delete attributes?')}
          confirmationButtonText={translate('Delete')}
          withWarningIcon
        />
      </SC.AttributesStyled>
    </FormProvider>
  );
};
