// Function for date and datetime column types
export const dateParser = (value: string, type: string, disableTimezoneAdjustment: boolean) => {
  if (value && type === 'date') {
    return new Date(value);
  }
  if (value && type === 'dateTime') {
    const newValue = disableTimezoneAdjustment ? String(value).replace('Z', '') : String(value);
    return new Date(newValue);
  }
  return value;
};
