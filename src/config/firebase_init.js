import { initializeApp } from "firebase/app";
import { initializeAnalytics } from "firebase/analytics";

var firebaseConfig = {
  apiKey: "AIzaSyCk8EfNyqarIzBAQSCFgU8634o-e0iA_Os",
  appId: "1:440569980458:web:870c6bde68871e5fd78553",
  authDomain: "vent-with-strangers-2acc6.firebaseapp.com",
  databaseURL: "https://vent-with-strangers-2acc6.firebaseio.com",
  measurementId: "G-N5NTVEZHSN",
  messagingSenderId: "440569980458",
  projectId: "vent-with-strangers-2acc6",
  storageBucket: "vent-with-strangers-2acc6.appspot.com",
};

//window.location.hostname === "localhost"
if (window.location.hostname === "localhost")
  firebaseConfig = {
    apiKey: "AIzaSyCk8EfNyqarIzBAQSCFgU8634o-e0iA_Os",
    appId: "1:440569980458:web:870c6bde68871e5fd78553",
    authDomain: "vent-with-strangers-2acc6.firebaseapp.com",
    databaseURL: "http://localhost:9000?ns=vent-with-strangers-2acc6",
    measurementId: "G-N5NTVEZHSN",
    messagingSenderId: "440569980458",
    projectId: "vent-with-strangers-2acc6",
    storageBucket: "vent-with-strangers-2acc6.appspot.com",
  };

const app = initializeApp(firebaseConfig);
if (window.location.hostname !== "localhost") initializeAnalytics(app);

export default app;
