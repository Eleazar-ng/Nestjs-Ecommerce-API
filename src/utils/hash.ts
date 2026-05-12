/** @format */
import { genSalt, hash, compare } from "bcrypt";

export const encrypt = async (string: string): Promise<string> => {
  return genSalt(10)
    .then((salt) => hash(string, salt))
    .then((hash) => {
      return hash;
    });
};

export const verify = async (
  encrypted: string,
  entered: string,
): Promise<boolean> => {
  return compare(entered, encrypted)
    .then((result) => {
      return true;
    })
    .catch((error) => {
      return false;
    });
};