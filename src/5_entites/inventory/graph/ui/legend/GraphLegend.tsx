import { useMemo } from 'react';
import { rgbToHex } from '@mui/system';
import { CustomPalette } from 'theme/types';
import {
  defaultGraphLinksData,
  useColorIntervals,
  useHandleLegendCheckboxClick,
} from '5_entites/inventory';
import { GraphTmosWithColorRanges, Legend, useTranslate } from '6_shared';
import { MuiIcons } from '6_shared/ui/icons/MuiIcons';
import { LegendNode } from './LegendNode';
import { LegendLink } from './LegendLink';

interface GraphLegendProps {
  graphTmosWithColors: GraphTmosWithColorRanges;
  disableLinks?: boolean;
  onCheckBoxChange?: (tmoId: number | string) => void;
  isRightPanelOpen?: boolean;
  rightPanelWidth?: number;
}

interface ColoredTprm {
  name: string;
  hex: string;
}

export const GraphLegend = ({
  graphTmosWithColors,
  onCheckBoxChange,
  disableLinks = false,
  isRightPanelOpen,
  rightPanelWidth = 0,
}: GraphLegendProps) => {
  const translate = useTranslate();

  const { getColorInterval } = useColorIntervals();

  const { handleCheckboxClick, defaultGraphLinks } = useHandleLegendCheckboxClick({
    graphTmosWithColors,
  });

  const data = useMemo(() => {
    return [
      {
        id: 'nodes-group',
        name: translate('Nodes'),
        props: {
          defaultExpanded: true,
        },
        children: Object.values(graphTmosWithColors)
          .filter((item) => item.geometry_type !== 'line')
          .map((item) => {
            const IconComponent = MuiIcons[item.icon as keyof typeof MuiIcons] ?? undefined;
            return {
              id: item.id,
              name: item.name,
              visible: item.visible,
              geometry_type: item.geometry_type,
              props: {
                sx: {
                  marginLeft: '10px',
                },
              },
              icon: (
                <LegendNode
                  name={item.name}
                  icon={
                    IconComponent ? (
                      <IconComponent
                        sx={{
                          fontSize: 12,
                          color: ({ palette }: { palette: CustomPalette }) =>
                            palette.primary.contrastText,
                        }}
                      />
                    ) : undefined
                  }
                />
              ),
              children:
                item.colorRanges?.ranges &&
                [
                  ...item.colorRanges.ranges.colors,
                  // { name: 'Default Color', id: '999', hex: item.colorRanges?.ranges?.defaultColor },
                ]?.map((coloredTprm, idx: number) => ({
                  id: `${item.id}_${idx}`,
                  // @ts-ignore
                  visible: coloredTprm?.visible,
                  name:
                    item.colorRanges?.valType === 'number'
                      ? getColorInterval({
                          index: idx,
                          values: item.colorRanges?.ranges?.values ?? [],
                        }) ?? ''
                      : (coloredTprm as { name: string }).name,
                  props: {
                    sx: {
                      marginLeft: '10px',
                    },
                  },
                  icon: (
                    <LegendNode
                      name={item.name}
                      color={
                        Array.isArray(coloredTprm)
                          ? rgbToHex(`rgb(${coloredTprm[0]}, ${coloredTprm[1]}, ${coloredTprm[2]})`)
                          : coloredTprm.hex
                      }
                      icon={
                        IconComponent ? (
                          <IconComponent
                            sx={{
                              fontSize: 12,
                              color: ({ palette }: { palette: CustomPalette }) =>
                                palette.primary.contrastText,
                            }}
                          />
                        ) : undefined
                      }
                    />
                  ),
                })),
            };
          }),
      },
      {
        id: 'links-group',
        name: translate('Links'),
        props: {
          defaultExpanded: true,
        },
        children: [
          ...Object.values(graphTmosWithColors)
            .filter((item) => item.geometry_type === 'line')
            .map((item) => ({
              id: item.id,
              name: item.name,
              visible: item.visible,
              geometry_type: item.geometry_type,
              props: {
                sx: {
                  marginLeft: '10px',
                },
              },
              icon: (
                <LegendLink
                  key={item.id}
                  geometryType={item.geometry_type}
                  icon={item.line_type}
                  graphLinkType={item.id.toString()}
                />
              ),
              children:
                item.colorRanges?.ranges &&
                [
                  ...item.colorRanges.ranges.colors,
                  {
                    name: 'Default Color',
                    id: '999',
                    hex: item.colorRanges?.ranges?.defaultColor,
                    visible: true,
                  },
                ]?.map((coloredTprm, idx: number) => ({
                  id: `${item.id}_${idx}`,
                  name: coloredTprm.name,
                  visible: coloredTprm.visible,
                  props: {
                    sx: {
                      marginLeft: '10px',
                    },
                  },
                  icon: (
                    <LegendLink
                      key={item.id}
                      geometryType={item.geometry_type}
                      icon={item.line_type}
                      graphLinkType={item.id.toString()}
                      color={
                        Array.isArray(coloredTprm)
                          ? rgbToHex(`rgb(${coloredTprm[0]}, ${coloredTprm[1]}, ${coloredTprm[2]})`)
                          : coloredTprm.hex
                      }
                    />
                  ),
                })),
            })),

          ...(disableLinks ? [] : defaultGraphLinksData).map((item) => ({
            id: item.id,
            name: item.name,
            visible: defaultGraphLinks[item.id].visible,
            props: {
              sx: {
                marginLeft: '10px',
              },
            },
            icon: (
              <LegendLink
                key={item.id}
                geometryType={item.geometry_type}
                icon={item.icon}
                graphLinkType={item.id.toString()}
              />
            ),
            children: item.coloredTprms?.ranges?.colors?.map((coloredTprm: ColoredTprm, idx) => ({
              id: `${item.id}_${idx}`,
              name: item.name,
              visible: true,
              props: {
                sx: {
                  marginLeft: '10px',
                },
              },
              icon: (
                <LegendLink
                  key={item.id}
                  geometryType={item.geometry_type}
                  icon={item.icon}
                  graphLinkType={item.id}
                  color={coloredTprm.hex}
                />
              ),
            })),
          })),
        ],
      },
    ];
  }, [defaultGraphLinks, getColorInterval, graphTmosWithColors, translate, disableLinks]);

  return (
    <Legend
      data={data}
      handleCheckboxClick={(newTmoId) =>
        onCheckBoxChange != null ? onCheckBoxChange(newTmoId) : handleCheckboxClick(newTmoId)
      }
      styles={{
        right: isRightPanelOpen ? `${rightPanelWidth + 20}px` : '20px',
        transition: '0.2s',
      }}
    />
  );
};
