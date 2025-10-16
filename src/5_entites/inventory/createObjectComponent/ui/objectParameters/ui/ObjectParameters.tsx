import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme, Accordion, AccordionSummary, Typography, AccordionDetails } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Search, Close } from '@mui/icons-material';
import {
  IInventoryObjectModel,
  useTranslate,
  LoadingAvataa,
  ErrorPage,
  InputWithIcon,
  IObjectComponentParams,
  useObjectCRUD,
} from '6_shared';
import {
  type ICreateTooltipTextProps,
  type ICustomInputs,
  filterObjectParameters,
} from '5_entites';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import * as SC from './ObjectParameters.styled';
import { ObjectInputRenderParams } from './objectInputRenderParams/ObjectInputRenderParams';

interface IProps {
  inventoryObjectData: IInventoryObjectModel | undefined;
  optionalParams: IObjectComponentParams[];
  objectId: number | null;
  requiredParams: IObjectComponentParams[];
  onSubmit: SubmitHandler<ICustomInputs>;
  isLoading: boolean;
  isError: boolean;
  createTooltipText: ({ paramValType, paramConstraint }: ICreateTooltipTextProps) => string;
}

export const ObjectParameters = ({
  inventoryObjectData,
  optionalParams,
  objectId,
  requiredParams,
  onSubmit,
  isLoading,
  isError,
  createTooltipText,
}: IProps) => {
  const translate = useTranslate();
  const theme = useTheme();

  const [isParamsLoading, setIsParamsLoading] = useState(false);
  const [parametersSearchQuery, setParametersSearchQuery] = useState('');
  const [isParametersInputFilled, setParametersInputFilled] = useState(false);
  const [requiredParamsSearchQuery, setRequiredParamsSearchQuery] = useState('');
  const [optionalParamsSearchQuery, setOptionalParamsSearchQuery] = useState('');

  const { handleSubmit, formState } = useFormContext();

  const { objectCRUDComponentUi, setIsObjectDeleteModalOpen } = useObjectCRUD();
  const { objectCRUDComponentMode } = objectCRUDComponentUi;

  const isInventoryEditOpen = objectCRUDComponentMode === 'editing';

  const handleParamsLoading = useCallback((loading: boolean) => {
    setIsParamsLoading(loading);
  }, []);

  useEffect(() => {
    setParametersInputFilled(parametersSearchQuery !== '');
  }, [parametersSearchQuery]);

  const filteredRequiredParams = useMemo(() => {
    return filterObjectParameters(requiredParams, requiredParamsSearchQuery);
  }, [requiredParamsSearchQuery, requiredParams]);

  const filteredOptionalParams = useMemo(() => {
    return filterObjectParameters(optionalParams, optionalParamsSearchQuery);
  }, [optionalParamsSearchQuery, optionalParams]);

  const handleRequiredParamsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequiredParamsSearchQuery(e.target.value);
  };

  const handleOptionalParamsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptionalParamsSearchQuery(e.target.value);
  };

  const onIconClick = () => {
    setParametersSearchQuery('');
    setParametersInputFilled(false);
  };

  return (
    <SC.ObjectParametersStyled>
      {!isLoading && isError && (
        <ErrorPage
          error={{ message: translate('An error has occurred, please try again'), code: '404' }}
        />
      )}
      {isLoading && !isError && (
        <SC.LoadingContainer>
          <LoadingAvataa />
        </SC.LoadingContainer>
      )}
      {!isError && (
        <SC.Form
          onSubmit={handleSubmit(onSubmit)}
          style={isLoading ? { opacity: 0.5, pointerEvents: 'none' } : {}}
        >
          <SC.ObjectParametersBody>
            {requiredParams.length !== 0 && (
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={
                    <ArrowDropDownIcon data-testid="create-object-popup__key-params-expand-icon" />
                  }
                >
                  <SC.ObjectParametersContentHeader>
                    <SC.ObjectParametersTitleWrapper>
                      <Typography>{translate('Key Parameters')}</Typography>
                      <SC.ObjectParametersCountBox>
                        {requiredParams.length}
                      </SC.ObjectParametersCountBox>
                    </SC.ObjectParametersTitleWrapper>
                    <SC.ObjectParametersInputWrapper>
                      <InputWithIcon
                        width={27}
                        height={27}
                        expandWidth={200}
                        iconPosition="middle"
                        onChange={handleRequiredParamsInputChange}
                        name="keyParameters"
                        value={requiredParamsSearchQuery}
                        placeHolderText=""
                        icon={
                          !isParametersInputFilled ? (
                            <Search fontSize="small" />
                          ) : (
                            <Close fontSize="small" />
                          )
                        }
                        onIconClick={() => onIconClick()}
                      />
                    </SC.ObjectParametersInputWrapper>
                  </SC.ObjectParametersContentHeader>
                </AccordionSummary>
                <AccordionDetails>
                  <ObjectInputRenderParams
                    inventoryObjectData={inventoryObjectData}
                    params={filteredRequiredParams}
                    createTooltipText={createTooltipText}
                    objectId={objectId}
                    handleParamsLoading={handleParamsLoading}
                  />
                </AccordionDetails>
              </Accordion>
            )}

            {optionalParams.length !== 0 && (
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={
                    <ArrowDropDownIcon data-testid="create-object-popup__other-params-expand-icon" />
                  }
                >
                  <SC.ObjectParametersContentHeader>
                    <SC.ObjectParametersTitleWrapper>
                      <Typography>{translate('Other Parameters')}</Typography>
                      <SC.ObjectParametersCountBox>
                        {optionalParams.length}
                      </SC.ObjectParametersCountBox>
                    </SC.ObjectParametersTitleWrapper>
                    <SC.ObjectParametersInputWrapper>
                      <InputWithIcon
                        width={27}
                        height={27}
                        expandWidth={200}
                        iconPosition="middle"
                        onChange={handleOptionalParamsInputChange}
                        name="keyParameters"
                        value={optionalParamsSearchQuery}
                        placeHolderText=""
                        icon={
                          !isParametersInputFilled ? (
                            <Search fontSize="small" />
                          ) : (
                            <Close fontSize="small" />
                          )
                        }
                        onIconClick={() => onIconClick()}
                      />
                    </SC.ObjectParametersInputWrapper>
                  </SC.ObjectParametersContentHeader>
                </AccordionSummary>
                <AccordionDetails>
                  <ObjectInputRenderParams
                    inventoryObjectData={inventoryObjectData}
                    params={filteredOptionalParams}
                    createTooltipText={createTooltipText}
                    objectId={objectId}
                    handleParamsLoading={handleParamsLoading}
                  />
                </AccordionDetails>
              </Accordion>
            )}

            {optionalParams.length === 0 && requiredParams.length === 0 && (
              <SC.LoadingContainer>
                <Typography>There are no parameters</Typography>
              </SC.LoadingContainer>
            )}
          </SC.ObjectParametersBody>

          <SC.ObjectParametersFooter>
            {!isInventoryEditOpen && (
              <SC.CreateObjectParameterButton
                variant="contained"
                disabled={Object.keys(formState.errors).length > 0 || isParamsLoading || isLoading}
                type="submit"
              >
                {translate('Add')}
              </SC.CreateObjectParameterButton>
            )}

            {isInventoryEditOpen && (
              <SC.ObjectActionsButtons>
                <SC.ObjectComponentButton
                  type="button"
                  variant="outlined"
                  onClick={() => setIsObjectDeleteModalOpen(true)}
                  sx={{ color: theme.palette.primary.main }}
                >
                  {translate(inventoryObjectData?.active ? 'Delete' : 'Delete Permanently')}
                </SC.ObjectComponentButton>
                <SC.ObjectComponentButton
                  variant="contained"
                  disabled={Object.keys(formState.errors).length > 0}
                  onClick={() => handleSubmit(onSubmit)}
                  type="submit"
                >
                  {translate('Save')}
                </SC.ObjectComponentButton>
              </SC.ObjectActionsButtons>
            )}
          </SC.ObjectParametersFooter>
        </SC.Form>
      )}
    </SC.ObjectParametersStyled>
  );
};
