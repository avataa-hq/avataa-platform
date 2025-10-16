import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  IconButton,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getIcon } from '5_entites/inventory/legend/lib';
import { useColorIntervals } from '5_entites/inventory/legend/hooks';
import {
  LineSvg,
  NamedObjectPoint,
  lineTypes,
  useColorsConfigure,
  useTabs,
  useTranslate,
} from '6_shared';
import { SettingsRounded } from '@mui/icons-material';
import { IColors, ILegendData } from '6_shared/models/inventoryMapWidget/types';
import * as SC from './LegendContent.styled';

interface IProps {
  title: string;
  legendData: ILegendData[];
  handleObjectTypeCheckBoxClick: (newTmoId: string) => void;
  handleParameterCheckBoxClick: (newTmoId: string, newTprmId: string) => void;
}

export const LegendContent = ({
  title,
  legendData,
  handleObjectTypeCheckBoxClick,
  handleParameterCheckBoxClick,
}: IProps) => {
  const translate = useTranslate();

  const { getColorInterval } = useColorIntervals();

  const { toggleIsOpenColorSelecting, setCurrentTmoId, setCurrentTmoType } = useColorsConfigure();
  const { selectedTab } = useTabs();

  const [expandedAccordionId, setExpandedAccordionId] = useState<string | null>(null);

  const onTmoCheckBoxClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newTmoId: string,
  ) => {
    e.stopPropagation();
    handleObjectTypeCheckBoxClick(newTmoId);
  };

  const onTprmCheckBoxClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newTmoId: string,
    newTprmId: string,
  ) => {
    e.stopPropagation();
    handleParameterCheckBoxClick(newTmoId, newTprmId);
  };

  const openColorSelecting = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: ILegendData,
  ) => {
    e?.stopPropagation();
    setCurrentTmoId({ module: selectedTab, tmoId: +item.id });
    setCurrentTmoType({ module: selectedTab, tmoType: item.geometry_type ?? '' });
    toggleIsOpenColorSelecting({ module: selectedTab });
  };

  return (
    <SC.LegendContentStyled>
      {legendData.length !== 0 && <Typography>{title}</Typography>}
      {legendData &&
        legendData.map((item) => (
          <SC.LegendBodyContent key={item.id}>
            <Accordion
              expanded={
                item.coloredTprms?.ranges?.colors?.length !== 0 && expandedAccordionId === item.id
              }
              onChange={(event: React.SyntheticEvent, expanded: boolean) => {
                if (item.coloredTprms?.ranges?.colors?.length !== 0) {
                  setExpandedAccordionId(expanded ? item.id : null);
                }
              }}
            >
              <AccordionSummary
                expandIcon={item.coloredTprms?.ranges?.colors?.length !== 0 && <ExpandMoreIcon />}
              >
                <SC.AccordionSummaryContent
                  sx={
                    title === translate('Nodes') ? { justifyContent: 'space-between' } : undefined
                  }
                >
                  <Box component="div">
                    <Checkbox
                      checked={item.visible}
                      onClick={(e) => onTmoCheckBoxClick(e, item.id)}
                    />
                  </Box>
                  {title === translate('Nodes') && (
                    <SC.IconWrapper>
                      <NamedObjectPoint
                        icon={getIcon(item.icon)}
                        // title={item.id}
                        // description={item.name}
                      />
                    </SC.IconWrapper>
                  )}
                  <Typography sx={{ overflowWrap: 'anywhere', width: '40%' }}>
                    {item.name}
                  </Typography>
                  {!Number.isNaN(+item.id) && (
                    <IconButton
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                        openColorSelecting(e, item)
                      }
                      sx={title === translate('Lines') ? { ml: 'auto' } : undefined}
                    >
                      <SettingsRounded />
                    </IconButton>
                  )}
                </SC.AccordionSummaryContent>
              </AccordionSummary>
              <AccordionDetails>
                <SC.AccordionDetailsContent>
                  {item.coloredTprms &&
                    item.coloredTprms.ranges?.colors?.map((coloredTprm: IColors, idx: number) => (
                      <SC.AccordionDetailsContentWrapper key={coloredTprm.id}>
                        <Box component="div">
                          <Checkbox
                            checked={coloredTprm.visible}
                            onClick={(e) => onTprmCheckBoxClick(e, item.id, coloredTprm.id)}
                          />
                        </Box>
                        {title === translate('Nodes') && (
                          <SC.IconWrapper>
                            <NamedObjectPoint
                              icon={getIcon(item.icon)}
                              circleColor={coloredTprm.hex}
                              // description={coloredTprm.name}
                            />
                          </SC.IconWrapper>
                        )}
                        {title === translate('Lines') && (
                          <SC.LineWrapper>
                            <LineSvg
                              lineType={
                                item.geometry_type
                                  ? lineTypes[item.line_type ?? 'solid']
                                  : lineTypes.blank
                              }
                              color={coloredTprm.hex}
                            />
                          </SC.LineWrapper>
                        )}
                        <Typography
                          sx={{ overflowWrap: 'anywhere', fontWeight: 400, width: '50%' }}
                        >
                          {item.coloredTprms?.valType &&
                            ['number', 'float'].includes(item.coloredTprms?.valType ?? '') &&
                            getColorInterval({
                              index: idx,
                              values: item.coloredTprms.ranges.values,
                            })}
                          {item.coloredTprms?.valType &&
                            !['number', 'float'].includes(item.coloredTprms?.valType ?? '') &&
                            coloredTprm.name}
                        </Typography>
                      </SC.AccordionDetailsContentWrapper>
                    ))}
                  {item.coloredTprms?.ranges?.colors?.length === 0 && (
                    <SC.AccordionDetailsContentWrapper>
                      {title === translate('Lines') && (
                        <SC.LineWrapper>
                          <LineSvg
                            lineType={
                              item.geometry_type
                                ? lineTypes[item.line_type ?? 'solid']
                                : lineTypes.blank
                            }
                            color={undefined}
                          />
                        </SC.LineWrapper>
                      )}
                    </SC.AccordionDetailsContentWrapper>
                  )}
                </SC.AccordionDetailsContent>
              </AccordionDetails>
            </Accordion>
          </SC.LegendBodyContent>
        ))}
    </SC.LegendContentStyled>
  );
};
