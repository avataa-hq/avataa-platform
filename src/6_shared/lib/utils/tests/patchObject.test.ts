import { it, describe, expect } from 'vitest';

import { patchObject } from '../patchObject';

describe('patchObject', () => {
  it('should merge two objects with nested properties', () => {
    const obj1 = {
      name: 'John',
      age: 30,
      address: {
        city: 'New York',
        zip: '10001',
      },
    };

    const obj2 = {
      age: 31,
      address: {
        zip: '10002',
        street: '123 Main St',
      },
    };

    const patchedObj = patchObject(obj1, obj2);

    expect(patchedObj).toEqual({
      name: 'John',
      age: 31,
      address: {
        city: 'New York',
        zip: '10002',
        street: '123 Main St',
      },
    });
  });

  it('should handle empty objects', () => {
    const obj1 = {
      name: 'John',
    };

    const obj2 = {};

    const patchedObj = patchObject(obj1, obj2);

    expect(patchedObj).toEqual({
      name: 'John',
    });
  });

  it('should handle arrays', () => {
    const obj1 = {
      colors: ['red', 'blue'],
    };

    const obj2 = {
      colors: ['green'],
    };

    const patchedObj = patchObject(obj1, obj2);

    expect(patchedObj).toEqual({
      colors: ['green'],
    });
  });

  it('should handle null values', () => {
    const obj1 = {
      name: 'John',
    };

    const obj2 = {
      name: null,
    };

    const patchedObj = patchObject(obj1, obj2);

    expect(patchedObj).toEqual({
      name: null,
    });
  });
});
