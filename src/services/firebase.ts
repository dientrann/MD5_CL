// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "md5-project-866d4.firebaseapp.com",
  projectId: "md5-project-866d4",
  storageBucket: "md5-project-866d4.appspot.com",
  messagingSenderId: "696533959909",
  appId: "1:696533959909:web:fd2c3f9d952c17f8ad800c",
  measurementId: "G-DB31C2ZFXR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default {
    loginWithGoogle: async() => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        return await signInWithPopup(auth, provider)
    },
    loginWithFB: async()=>{
        const provider = new FacebookAuthProvider();
        const auth = getAuth(app);
        return await signInWithPopup(auth, provider)
    }
}

// export const loginWithGoogle = async () => {
//     const provider = new GoogleAuthProvider();
//     const auth = getAuth(app);
//     return await signInWithPopup(auth, provider)    
// }

// export async function uploadToFirebase(file, fallBackUrl = "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg") {
//     try {
//         const storage = getStorage(app);
//         const fileNameRef = ref(storage, `image_${Date.now() * Math.random()}.${file.name.split('.')[file.name.split('.').length - 1]}`);

//         let result = await uploadBytes(fileNameRef, file);
//         let url  = await getDownloadURL(result.ref)
//         return url
//     }catch(err) {
//         return fallBackUrl
//     }
// }