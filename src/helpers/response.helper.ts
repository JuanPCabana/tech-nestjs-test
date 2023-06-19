import { Response } from "express";

const handleResponse = (res: Response, body: Object, message = 'Ok', status = 200) => {

  const responseObj = {
    message,
    body,
  };

  return res.status(status).send(responseObj);
};

const handleErrorResponse = (res: Response, status = 500, message = 'Error') => {
  const responseObj = {
    message,
  };
  return res.status(status).send(responseObj);
};

const responseHandler = Object.freeze({
  handleResponse,
  handleErrorResponse,
});

export default responseHandler;
