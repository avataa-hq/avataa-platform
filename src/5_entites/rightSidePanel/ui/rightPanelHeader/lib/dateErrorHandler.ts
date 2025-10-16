import { DateValidationError, TimeValidationError } from '@mui/x-date-pickers';
import { DateErrorMessages } from '../model';

/**
 * Returns an error message based on the provided error type.
 * @param {DateValidationError | TimeValidationError | null} errorType - The type of date validation error.
 * @param {string | undefined} datePickerType - Additional flag to customize error message.
 * @returns {DateErrorMessages} The corresponding error message.
An empty dependency array indicates that the function does not depend on external variables and
will be the same every time the component is rendered.
 */
export const dateErrorHandler = (
  errorType: DateValidationError | TimeValidationError | null,
  datePickerType?: string,
): DateErrorMessages => {
  switch (errorType) {
    case 'maxDate':
      return 'Please select a year not higher than the current one';

    case 'minDate':
      return datePickerType === 'To'
        ? 'Please select a date greater than the date from'
        : 'Please select a date no older than 100 years ago';

    case 'minTime':
      return 'Please select time greater than time from';

    case 'invalidDate':
      return 'Please select the correct date';

    default:
      return 'Please select the correct date';
  }
};
