export const validIntValue = (value: string) => {
  const re: RegExp = /^(0|-?[1-9][0-9]*)$/;
  return re.test(String(value));
};

export const validFloatValue = (value: string) => {
  const re: RegExp = /^(0$|-?[1-9]\d*(\.\d*[1-9]$)?|-?0\.\d*[1-9])$/;
  return re.test(String(value));
};

export const isValidRegex = (regexString: string) => {
  try {
    // eslint-disable-next-line no-new
    new RegExp(regexString);
    return true;
  } catch (error) {
    return false;
  }
};
