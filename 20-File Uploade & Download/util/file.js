import { unlink } from 'fs';

const deleteFile = (filePath) => {
  unlink(filePath, (err) => {
    if (err) {
      throw (err);
    }
  });
}

export default deleteFile 