export const getErrorMessage = (error: any) => {
  let message = 'An error occurred';

  if (error.hasOwnProperty('data') && error.data.hasOwnProperty('detail')) {
    if (Array.isArray(error.data.detail)) {
      error.data.detail.forEach((errorDetail: any) => {
        const messageRow = `${errorDetail.type?.toUpperCase().concat(': ') ?? ''}${
          errorDetail.msg ?? ''
        }`;

        if (typeof errorDetail === 'string') message = message.concat(`\n${errorDetail}`);

        if (messageRow.length) message = message.concat(`\n${messageRow}`);
      });
    } else {
      message = error.data.detail;
    }
  }
  if (error.hasOwnProperty('error')) {
    message = error.error;
  }
  if (error.hasOwnProperty('message')) {
    message = error.message;
  }

  return typeof message === 'object' ? JSON.stringify(message) : message;
};
