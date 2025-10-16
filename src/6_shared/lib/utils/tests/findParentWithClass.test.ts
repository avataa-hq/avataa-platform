import { it, afterAll, expect, describe } from 'vitest';

import { findParentWithClass } from '../findParentWithClass';

const container = document.createElement('div');
container.innerHTML = `
    <div class="grandparent">
      <div class="parent">
        <div class="some other parent">
          <div class="child"></div>
        </div>
      </div>
    </div>
  `;

describe('findParentWithClass', () => {
  it('should return the parent element with the specified class', () => {
    const childElement = container.querySelector('.child');

    expect(childElement).not.toBe(null);

    // Call the function to find the parent with class "parent"
    // @ts-ignore
    const result = findParentWithClass(childElement, 'parent');

    // Assert that the result is the "parent" element
    expect(result?.classList?.contains('parent')).toBe(true);
  });

  it('should return null if no parent with the specified class is found', () => {
    const childElement = container.querySelector('.child');

    expect(childElement).not.toBe(null);

    // Call the function to find the parent with class "non-existent"
    // @ts-ignore
    const result = findParentWithClass(childElement, 'non-existent');

    // Assert that the result is null
    expect(result).toBe(null);
  });
});

// Clean up the test DOM after tests
afterAll(() => {
  if (container) container.remove();
});
