const handleResponse = (body: Object, message = 'Ok') => {
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
