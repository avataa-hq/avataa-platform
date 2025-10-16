import { useCallback, useRef } from 'react';
import Draggable from 'react-draggable';
import { Typography, useTheme } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import { Remove } from '@mui/icons-material';
import { dotWave } from 'ldrs';
import { useRightPanelResizeObserver } from '5_entites';
import { Button, useTranslate } from '6_shared';
import { ILegendData } from '6_shared/models/inventoryMapWidget/types';
import { LegendContent } from './LegendComponents';
import * as SC from './Legend.styled';

interface IProps {
  legendData: ILegendData[];
  onObjectTypeCheckBoxClick: (newTmoId: string) => void;
  onParamTypeCheckBoxClick: (newTmoId: string, newTprmId: string) => void;
  isLoading: boolean;
  isLegendOpen: boolean;
  setLegendOpen: () => void;
  isRightPanelOpen?: boolean;
}

dotWave.register();

export const Legend = ({
  legendData,
  onObjectTypeCheckBoxClick,
  onParamTypeCheckBoxClick,
  isLoading,
  isLegendOpen,
  setLegendOpen,
  isRightPanelOpen,
}: IProps) => {
  const translate = useTranslate();
  const theme = useTheme();

  const legendRef = useRef<HTMLDivElement>(null);

  const { rightPanelWidth } = useRightPanelResizeObserver();

  const handleObjectTypeCheckBoxClick = useCallback(
    (newTmoId: string) => {
      onObjectTypeCheckBoxClick(newTmoId);
    },
    [onObjectTypeCheckBoxClick],
  );

  const handleParameterCheckBoxClick = useCallback(
    (newTmoId: string, newTprmId: string) => {
      onParamTypeCheckBoxClick(newTmoId, newTprmId);
    },
    [onParamTypeCheckBoxClick],
  );

  // useEffect(() => {
  //   const element = document.getElementById('right-side-panel');

  //   if (!element) return () => {};

  //   const resizeObserver = new ResizeObserver((entries) => {
  //     Object.values(entries).forEach((entry) => {
  //       const { width } = entry.contentRect;
  //       setRightPanelWidth(width);
  //     });
  //   });

  //   resizeObserver.observe(element);

  //   return () => {
  //     resizeObserver.disconnect();
  //   };
  // }, []);

  return (
    <SC.Backdrop>
      <Draggable
        bounds="parent"
        axis={isLegendOpen ? 'both' : 'none'}
        handle=".handle"
        position={isLegendOpen ? undefined : { x: 0, y: 0 }}
        nodeRef={legendRef}
      >
        <SC.LegendStyled
          islegendopen={isLegendOpen ? 'true' : 'false'}
          className="handle"
          ref={legendRef}
          sx={{
            right: isRightPanelOpen ? `${rightPanelWidth + 20}px` : '40px',
          }}
        >
          {isLoading && isLegendOpen && (
            <SC.LoadingContainer>
              <l-dot-wave size="47" speed="1" color={theme.palette.primary.main} />
            </SC.LoadingContainer>
          )}
          <SC.LegendHeader>
            {isLegendOpen && <Typography>{translate('Legend')}</Typography>}
            <Button onClick={setLegendOpen}>
              {isLegendOpen ? (
                <Remove />
              ) : (
                <ListIcon color={isLegendOpen ? 'primary' : 'secondary'} />
              )}
            </Button>
          </SC.LegendHeader>
          {isLegendOpen && legendData.length === 0 && (
            <Typography>{translate('There are no selected object types')}</Typography>
          )}
          {isLegendOpen && legendData.length !== 0 && (
            <SC.LegendBody
              islegendopen={isLegendOpen ? 'true' : 'false'}
              isloading={isLoading ? 'true' : 'false'}
            >
              <LegendContent
                title={translate('Nodes')}
                legendData={legendData.filter((item) => item.geometry_type !== 'line')}
                handleObjectTypeCheckBoxClick={handleObjectTypeCheckBoxClick}
                handleParameterCheckBoxClick={handleParameterCheckBoxClick}
              />

              <LegendContent
                title={translate('Lines')}
                legendData={legendData.filter((item) => item.geometry_type === 'line')}
                handleObjectTypeCheckBoxClick={handleObjectTypeCheckBoxClick}
                handleParameterCheckBoxClick={handleParameterCheckBoxClick}
              />
            </SC.LegendBody>
          )}
        </SC.LegendStyled>
      </Draggable>
    </SC.Backdrop>
  );
};
