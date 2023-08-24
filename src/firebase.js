import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAMlCIQ4hChC9QKdmnnN34li4rti3Fg6X0',
  authDomain: 'todo-list-app-8f1f2.firebaseapp.com',
  databaseURL: 'https://todo-list-app-8f1f2-default-rtdb.firebaseio.com',
  projectId: 'todo-list-app-8f1f2',
  storageBucket: 'todo-list-app-8f1f2.appspot.com',
  messagingSenderId: '905122981470',
  appId: '1:905122981470:web:8e0f7cc58272369bdc36cf',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
