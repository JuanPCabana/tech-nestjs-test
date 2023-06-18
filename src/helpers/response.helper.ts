const handleResponse = (message = 'Ok', body) => {
  return {
    message,
    body,
  };
};

const handleErrorResponse = (status = 500, message = 'Error') => {
  return {
    message,
    status,
  };
};

const responseHandler = Object.freeze({
  handleResponse,
  handleErrorResponse,
});

export default responseHandler;
