import { describe, it, expect, vi } from 'vitest';
import { useSetColorRanges } from '../useSetColorRanges';

const mockColorRangeModel = {
  ranges: {
    colors: [{ hex: '#ffffff' }],
    values: [0],
  },
};

vi.mock('react', () => ({
  useMemo: (factory) => factory(),
}));

vi.mock('6_shared', () => ({
  IColorRangeModel: mockColorRangeModel,
}));

describe('useSetColorRanges', () => {
  it('should return empty arrays when tmo_id or tprm_id are not found in colorRanges', () => {
    const props = {
      tprm_id: 'nonexistent_tprm_id',
      tmo_id: 'nonexistent_tmo_id',
      colorRanges: {},
    };
    const { colors, values } = useSetColorRanges(props);
    expect(colors).toEqual([]);
    expect(values).toEqual([]);
  });

  it('should return empty arrays when colorRanges is an empty object', () => {
    const props = {
      tprm_id: 'existing_tprm_id',
      tmo_id: 'existing_tmo_id',
      colorRanges: {},
    };
    const { colors, values } = useSetColorRanges(props);
    expect(colors).toEqual([]);
    expect(values).toEqual([]);
  });

  it('should return empty arrays when colorRanges is an empty array', () => {
    const props = {
      tprm_id: 'existing_tprm_id',
      tmo_id: 'existing_tmo_id',
      colorRanges: [],
    };
    const { colors, values } = useSetColorRanges(props);
    expect(colors).toEqual([]);
    expect(values).toEqual([]);
  });

  it('should correctly handle nested properties in colorRanges', () => {
    const props = {
      tprm_id: 'existing_tprm_id',
      tmo_id: 'existing_tmo_id',
      colorRanges: {
        existing_tmo_id: {
          existing_tprm_id: mockColorRangeModel,
        },
      },
    };
    const { colors, values } = useSetColorRanges(props);
    expect(colors).toEqual(['#ffffff']);
    expect(values).toEqual([0]);
  });

  it('should return empty arrays when ranges or its properties are missing in colorRanges', () => {
    const props = {
      tprm_id: 'existing_tprm_id',
      tmo_id: 'existing_tmo_id',
      colorRanges: {
        existing_tmo_id: {
          existing_tprm_id: {},
        },
      },
    };
    const { colors, values } = useSetColorRanges(props);
    expect(colors).toEqual([]);
    expect(values).toEqual([]);
  });

  it('should handle large colorRanges efficiently', () => {
    const largeColorRanges = {};
    const numEntries = 1000;
    for (let i = 0; i < numEntries; i++) {
      largeColorRanges[`tmo_id_${i}`] = {
        [`tprm_id_${i}`]: mockColorRangeModel,
      };
    }
    const props = {
      tprm_id: 'tprm_id_500',
      tmo_id: 'tmo_id_500',
      colorRanges: largeColorRanges,
    };
    const { colors, values } = useSetColorRanges(props);
    expect(colors).toEqual(['#ffffff']);
    expect(values).toEqual([0]);
  });

  it('should gracefully handle invalid colorRanges types', () => {
    const props = {
      tprm_id: 'existing_tprm_id',
      tmo_id: 'existing_tmo_id',
      colorRanges: null,
    };
    const { colors, values } = useSetColorRanges(props);
    expect(colors).toEqual([]);
    expect(values).toEqual([]);
  });

  it('should handle multiple instances independently', () => {
    const props1 = {
      tprm_id: 'tprm_id_instance1',
      tmo_id: 'tmo_id_instance1',
      colorRanges: {
        tmo_id_instance1: {
          tprm_id_instance1: mockColorRangeModel,
        },
      },
    };
    const { colors: colors1, values: values1 } = useSetColorRanges(props1);

    const props2 = {
      tprm_id: 'tprm_id_instance2',
      tmo_id: 'tmo_id_instance2',
      colorRanges: {
        tmo_id_instance2: {
          tprm_id_instance2: mockColorRangeModel,
        },
      },
    };
    const { colors: colors2, values: values2 } = useSetColorRanges(props2);

    expect(colors1).toEqual(['#ffffff']);
    expect(values1).toEqual([0]);

    expect(colors2).toEqual(['#ffffff']);
    expect(values2).toEqual([0]);
  });
});
