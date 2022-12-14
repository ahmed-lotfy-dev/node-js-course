import fs from 'fs';

const deleteFile = filePath => {
  try {
    fs.unlink(filePath, null);
  } catch {
    const error = new Error("Deleting the file failed.");
    error.httpStatusCode = 500;
    throw Error(error);
  }
};

export default deleteFile

