const fs = require("fs");

const deleteFile = (filePath) => {
  // Delete file at this path:
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
};

exports.deleteFile = deleteFile;
