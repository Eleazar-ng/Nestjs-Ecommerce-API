/** @format */

export const success = (message: any, data: any, status_code: number = 200) => {
  return {
    statusCode: status_code,
    message,
    data,
  };
};