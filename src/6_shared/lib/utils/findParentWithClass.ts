export const findParentWithClass = (
  element: HTMLElement,
  className: string,
): HTMLElement | null => {
  let parent: HTMLElement | null = element.parentNode as HTMLElement;
  while (parent && parent.classList && !parent.classList.contains(className)) {
    parent = parent.parentNode as HTMLElement;
  }

  return parent;
};
