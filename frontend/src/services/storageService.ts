import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

const auth = getAuth();

export const storeImage = async (img: File) => {
    return new Promise((resolve, reject) => {
        try {
            const storage = getStorage();
            const filename = `${auth.currentUser?.uid}-${img.name}-${uuidv4()}`;
            const storageRef = ref(storage, filename);

            // Check the image size before uploading
            if (img.size > 5242880) {
                reject(new Error('Image/s must be less than 5 MB'));
                return;
            };

            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    // Handle unsuccessful uploads
                    reject(error);
                },
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};