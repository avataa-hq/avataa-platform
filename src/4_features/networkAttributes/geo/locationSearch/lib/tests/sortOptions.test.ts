import { describe, it, expect } from 'vitest';
import { sortOptions } from '../sortOptions';
import { IOption } from '../../types';

describe('sortOptions', () => {
  // const groupOrder = ['Objects', 'Parameters', 'Geographic'];

  it('should sort according to groupOrder', () => {
    const optionA: IOption = {
      id: '1',
      name: 'Option A',
      group: 'Objects',
      geometry: {
        coordinates: null,
        type: null,
      },
    };
    const optionB: IOption = {
      id: '2',
      name: 'Option B',
      group: 'Parameters',
      geometry: {
        coordinates: null,
        type: null,
      },
    };

    const result = sortOptions(optionA, optionB);

    expect(result).toBeLessThan(0); // Objects should come before Parameters
  });

  it('should return 0 when both options are in the same group', () => {
    const optionA: IOption = {
      id: '1',
      name: 'Option A',
      group: 'Geographic',
      geometry: {
        coordinates: null,
        type: null,
      },
    };
    const optionB: IOption = {
      id: '2',
      name: 'Option B',
      group: 'Geographic',
      geometry: {
        coordinates: null,
        type: null,
      },
    };

    const result = sortOptions(optionA, optionB);

    expect(result).toBe(0); // Same group should result in 0
  });

  it('should place groups in groupOrder first if one option has a group not in groupOrder', () => {
    const optionA: IOption = {
      id: '1',
      name: 'Option A',
      group: 'Objects',
      geometry: {
        coordinates: null,
        type: null,
      },
    };
    const optionB: IOption = {
      id: '2',
      name: 'Option B',
      group: 'Unknown Group',
      geometry: {
        coordinates: null,
        type: null,
      },
    };

    const result = sortOptions(optionA, optionB);

    expect(result).toBeLessThan(0); // Objects should come before any unknown group
  });

  it('should place unknown group after any group from groupOrder', () => {
    const optionA: IOption = {
      id: '1',
      name: 'Option A',
      group: 'Unknown Group',
      geometry: {
        coordinates: null,
        type: null,
      },
    };
    const optionB: IOption = {
      id: '2',
      name: 'Option B',
      group: 'Parameters',
      geometry: {
        coordinates: null,
        type: null,
      },
    };

    const result = sortOptions(optionA, optionB);

    expect(result).toBeGreaterThan(0); // Unknown group should come after Parameters
  });

  it('should compare alphabetically if both groups are not in groupOrder', () => {
    const optionA: IOption = {
      id: '1',
      name: 'Option A',
      group: 'Zoo',
      geometry: {
        coordinates: null,
        type: null,
      },
    };
    const optionB: IOption = {
      id: '2',
      name: 'Option B',
      group: 'Apple',
      geometry: {
        coordinates: null,
        type: null,
      },
    };

    const result = sortOptions(optionA, optionB);

    expect(result).toBeGreaterThan(0); // 'Zoo' comes after 'Apple' alphabetically
  });

  it('should return 0 when both groups are the same and not in groupOrder', () => {
    const optionA: IOption = {
      id: '1',
      name: 'Option A',
      group: 'Unknown Group',
      geometry: {
        coordinates: null,
        type: null,
      },
    };
    const optionB: IOption = {
      id: '2',
      name: 'Option B',
      group: 'Unknown Group',
      geometry: {
        coordinates: null,
        type: null,
      },
    };

    const result = sortOptions(optionA, optionB);

    expect(result).toBe(0); // Same unknown group should result in 0
  });
});
