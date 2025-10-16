import { describe, it, expect, vi } from 'vitest';
import { useGetModalMessage } from '../useGetModalMessage';

vi.mock('6_shared', () => ({
  useTranslate: () => (key) => `translated: ${key}`,
}));

describe('useGetModalMessage', () => {
  const translate = (key) => `translated: ${key}`;

  it('should return the correct message for public palette from a private default palette', () => {
    const props = {
      isPrivateColor: false,
      isDefaultColor: false,
      wasPublicColor: false,
      wasDefaultColor: true,
    };
    const message = useGetModalMessage(props);
    expect(message).toBe(
      translate('to set this palette to be public and to have no private default'),
    );
  });

  it('should return the correct message for new public default palette from a private palette', () => {
    const props = {
      isPrivateColor: false,
      isDefaultColor: true,
      wasPublicColor: false,
      wasDefaultColor: false,
    };
    const message = useGetModalMessage(props);
    expect(message).toBe(translate('to set this palette as a public default'));
  });

  it('should return the correct message for public default palette', () => {
    const props = {
      isPrivateColor: false,
      isDefaultColor: true,
      wasPublicColor: false,
      wasDefaultColor: true,
    };
    const message = useGetModalMessage(props);
    expect(message).toBe(translate('to update this palette'));
  });

  it('should return the correct message for a new private default palette', () => {
    const props = {
      isPrivateColor: true,
      isDefaultColor: true,
      wasPublicColor: false,
      wasDefaultColor: false,
    };
    const message = useGetModalMessage(props);
    expect(message).toBe(translate('to set this palette as your new default'));
  });

  it('should return the correct message for public default palette', () => {
    const props = {
      isPrivateColor: false,
      isDefaultColor: true,
      wasPublicColor: true,
      wasDefaultColor: true,
    };
    const message = useGetModalMessage(props);
    expect(message).toBe(translate('to update this palette'));
  });

  it('should return default message for undefined key', () => {
    const props = {
      isPrivateColor: true,
      isDefaultColor: false,
      wasPublicColor: false,
      wasDefaultColor: true,
    };
    const message = useGetModalMessage(props);
    expect(message).toBe(translate('to have no private default'));
  });
});
