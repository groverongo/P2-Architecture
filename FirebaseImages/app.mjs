// Import the functions you need from the SDKs you need
import { promises as fs } from "fs";
import { initializeApp } from "firebase/app";
import { Blob } from "buffer";
import {
  uploadBytesResumable,
  ref,
  getStorage,
  getDownloadURL,
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    //app config 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage();

const base = "./archive/images/";

const files = await fs.readdir(base);

files.forEach(async (pokemon) => {
  const images = await fs.readdir(base + pokemon);

  console.log(pokemon);

  images.forEach(async (image_name) => {
    const newRef = ref(storage, `pokemons/${pokemon}/${image_name}`);
    const buffer = await fs.readFile(base + pokemon + "/" + image_name);
    const blob = new Blob([buffer]);
    // console.log(newRef.name);
    // console.log(blob);
    // console.log(new TextDecoder().decode(await blob.arrayBuffer()))
    const task = uploadBytesResumable(newRef,  await blob.arrayBuffer(),{contentType: 'image/jpg'});
    const taskProgress = (snapshot) => {
      console.log(
        `total bytes: ${snapshot.bytesTransferred}/${snapshot.totalBytes}`
      );
    };
    const taskError = (error) => {
      console.log(error);
    };
    const success = async () => {
      const downloadURL = await getDownloadURL(newRef);
      console.log(downloadURL);
    };
    task.on("state_changed", taskProgress, taskError, success);
  });
});
