const {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} = require('firebase/storage');
const { storage } = require('./firebase');

async function uploadMessageAttachment(file, fileType, fileName) {
  const date = new Date();

  let storageRef;
  if (fileType === 'image/jpeg' || fileType === 'image/png') {
    storageRef = ref(storage, `attachment/images/${date + fileName}`);
  } else if (fileType === 'video/mp4') {
    storageRef = ref(storage, `attachment/videos/${date + fileName}`);
  } else if (fileType === 'application/pdf') {
    storageRef = ref(storage, `attachment/pdfs/${date + fileName}`);
  } else {
    storageRef = ref(storage, `attachment/files/${date + fileName}`);
  }

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        reject('Something went wrong!' + error.code);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
}

module.exports = { uploadMessageAttachment };