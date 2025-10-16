import { useTranslate } from '6_shared';

interface IProps {
  isPrivateColor?: boolean;
  isDefaultColor?: boolean;
  wasPublicColor?: boolean;
  wasDefaultColor?: boolean;
}

export const useGetModalMessage = ({
  isPrivateColor = false,
  isDefaultColor = false,
  wasPublicColor = false,
  wasDefaultColor = false,
}: IProps) => {
  const translate = useTranslate();

  const messageMap: Record<string, string> = {
    '0001': translate('to set this palette to be public'),
    '0010': translate('to set this palette as your new default'),
    '0011': translate('to set this palette as a public default'),
    '0100': translate('to set this palette to be private'),
    '0110': translate('to set this palette to be private and your new default'),
    '1000': translate('to have no private default'),
    '1001': translate('to set this palette to be public and to have no private default'),
    '0111': translate('to set this palette as a public default'),
  };

  const key = `${Number(wasDefaultColor)}${Number(wasPublicColor)}${Number(isDefaultColor)}${Number(
    !isPrivateColor,
  )}`;

  return messageMap[key] || translate('to update this palette');
};
