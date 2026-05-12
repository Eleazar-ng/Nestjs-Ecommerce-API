/** @format */

import { BadRequestException } from "@nestjs/common";

export const encryptObjectToken = (payload: object) => {
  const string = JSON.stringify(payload);
  const base64String = Buffer.from(string).toString('base64');
  const encodedToken = encodeURIComponent(base64String);

  return encodedToken;
};

export const decryptObjectToken = (token_string) => {
  try {
    const decodedString = decodeURIComponent(token_string);
    const convertTokenToJSON = JSON.parse(
      Buffer.from(decodedString, 'base64').toString(),
    );

    return convertTokenToJSON;
  } catch (err) {
    throw new BadRequestException('Invalid Reset Token');
  }
};