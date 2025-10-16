import { Edge } from '@antv/x6';
import { Attr } from '@antv/x6/lib/registry';
import { ColorRange, DEFAULT_LINE_WIDTH, GraphTmosWithColorRanges } from '6_shared';
import { IEdgeData } from '../../modal/types';
import { getObjectColorParameters } from '../../../builder';

type ColorType = ColorRange['colors'][number];
const defaultColor = '#4978f3';

const getColorData = (
  general: ColorType | null,
  source: ColorType | null,
  target: ColorType | null,
  edgeData?: IEdgeData,
) => {
  let newStroke: Attr.ComplexAttrValue;
  let newLineWidth: number | undefined = DEFAULT_LINE_WIDTH;
  let newVisible: boolean = true;

  if (general) {
    newStroke = general.hex ?? edgeData?.color ?? defaultColor;
    newLineWidth = general.lineWidth ?? DEFAULT_LINE_WIDTH;
    if (general.visible != null) newVisible = general.visible;
  }

  if (source || target) {
    const firstColor = source?.hex ?? edgeData?.color ?? defaultColor;
    const secondColor = target?.hex ?? edgeData?.color ?? defaultColor;
    newStroke = {
      type: 'linearGradient',
      stops: [
        { offset: '0%', color: firstColor },
        { offset: '50%', color: firstColor },
        { offset: '51%', color: secondColor },
        { offset: '100%', color: secondColor },
      ],
    };
    const getLineWidth = () => {
      if (source?.lineWidth && source?.lineWidth !== DEFAULT_LINE_WIDTH) {
        return source?.lineWidth;
      }
      if (target?.lineWidth && target?.lineWidth !== DEFAULT_LINE_WIDTH) {
        return target?.lineWidth;
      }
      return DEFAULT_LINE_WIDTH;
    };
    newLineWidth = getLineWidth();

    newVisible = !(source?.visible === false || target?.visible === false);
  }

  return {
    newStroke,
    newLineWidth,
    newVisible,
  };
};

export const getEdgesPaletteData = (edge: Edge, colorConfig: GraphTmosWithColorRanges) => {
  const edgeData = edge.data as IEdgeData | undefined;
  const sourceTmoId = edgeData?.sourceObjectData?.tmo_id as number | undefined;
  const targetTmoId = edgeData?.targetObjectData?.tmo_id as number | undefined;
  const generalTmoId = edgeData?.objectData?.tmo_id as number | undefined;

  const generalObjectPalette = generalTmoId ? colorConfig[String(generalTmoId)] : null;
  const sourceObjectPalette = sourceTmoId ? colorConfig[String(sourceTmoId)] : null;
  const targetObjectPalette = targetTmoId ? colorConfig[String(targetTmoId)] : null;

  let sourceColorPaletteData: ColorRange['colors'][number] | null = null;
  let targetColorPaletteData: ColorRange['colors'][number] | null = null;
  let generalColorPaletteData: ColorRange['colors'][number] | null = null;

  if (sourceObjectPalette && targetObjectPalette) {
    const sourceColorData = getObjectColorParameters(
      edgeData?.sourceObjectData?.params ?? [],
      sourceObjectPalette,
    );
    if (sourceColorData) sourceColorPaletteData = sourceColorData;

    const targetColorData = getObjectColorParameters(
      edgeData?.targetObjectData?.params ?? [],
      targetObjectPalette,
    );
    if (targetColorData) targetColorPaletteData = targetColorData;
  }

  if (!sourceColorPaletteData && !targetColorPaletteData && generalObjectPalette) {
    const generalColorParams = getObjectColorParameters(
      edgeData?.objectData?.params ?? [],
      generalObjectPalette,
    );
    if (generalColorParams) generalColorPaletteData = generalColorParams;
  }

  const { newVisible, newLineWidth, newStroke } = getColorData(
    generalColorPaletteData,
    sourceColorPaletteData,
    targetColorPaletteData,
    edgeData,
  );

  const correctVisible = generalObjectPalette?.visible ? newVisible : false;

  return {
    newStroke,
    newVisible: correctVisible,
    newLineWidth,
  };
};
