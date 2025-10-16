export const validateName = (value: string, translate: any): string | boolean => {
  const trimmedValue = value.trim();
  const hasConsecutiveSpaces = /\s{2,}/.test(value);

  if (trimmedValue.length === 0) {
    return translate('Name cannot be only spaces');
  }
  if (hasConsecutiveSpaces) {
    return translate('Name cannot contain consecutive spaces');
  }

  return true;
};
