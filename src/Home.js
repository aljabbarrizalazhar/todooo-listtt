import React, { useEffect, useState } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';
import { uid } from 'uid';
import {
  set,
  ref,
  onValue,
  remove,
  update,
  query,
  orderByChild,
  serverTimestamp,
} from 'firebase/database';
import apus from './assets/apus.svg';
import edit from './assets/edit.svg';
import logout from './assets/logout.svg';

export default function Home() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUidd, setTempUidd] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const queryRef = query(
          ref(db, `/${auth.currentUser.uid}`),
          orderByChild('createdAt')
        );
        onValue(queryRef, (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            const sortedTodos = Object.values(data).sort((a, b) => {
              return a.createdAt - b.createdAt; // Urut berdasarkan createdAt = timestamp
            });
            setTodos(sortedTodos);
          }
        });
      } else if (!user) {
        navigate('/');
      }
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const writeToDatabase = () => {
    if (todo.trim() !== '') {
      const uidd = uid();
      set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
        todo: todo,
        uidd: uidd,
        createdAt: serverTimestamp(), //  properti createdAt dengan timestamp
      });
      setTodo('');
    } else {
      alert('Todo gabole kosong');
    }
  };
  ////
  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTodo(todo.todo);
    setTempUidd(todo.uidd);
  };

  const handleEdit = () => {
    update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
      todo: todo,
      tempUidd: tempUidd,
    });
    setIsEdit(false);
    setTodo('');
  };
  /////
  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`));
  };

  return (
    <div class="flex flex-col p-4 md:p-6 lg:p-8 xl:p-10 ">
      {/* judul */}
      <div class="flex items-center justify-between mb-4">
        <h1 class="font-overpass text-4xl font-extrabold bg-gradient-to-tl from-cyan-300 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
          Todo List
        </h1>
        <div
          class="flex flex-col items-center hover:opacity-70 cursor-pointer"
          onClick={handleSignOut}
        >
          <img src={logout} alt="logout" />
          <span class="mt-2">Log Out</span>
        </div>
      </div>
      {/* bungkus input, dan tombol add */}
      <div class="flex w-full  ">
        <input
          class="rounded-l-lg bg-white flex-grow px-5 py-4 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 font-overpass text-base font-normal"
          type="text"
          placeholder="add todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        {isEdit ? (
          <>
            <button
              class="flex items-center self-stretch px-4 py-2 bg-gradient-to-br from-cyan-500 via-indigo-600 to-cyan-300 rounded-r-lg  hover:from-cyan-600 hover:to-cyan-400 hover:bg-opacity-90 text-white font-overpass text-base font-normal"
              onClick={handleEdit}
            >
              Confirm
            </button>
          </>
        ) : (
          <>
            <button
              class="flex items-center self-stretch px-4 py-2 gap-2 bg-gradient-to-br from-cyan-500 via-indigo-600 to-cyan-300 rounded-r-lg hover:from-cyan-600 hover:to-cyan-400 hover:bg-opacity-90 text-white font-overpass text-base font-normal"
              onClick={writeToDatabase}
            >
              Add
            </button>
          </>
        )}
      </div>
      {/* todo box */}
      {todos.length === 0 ? (
        <p class="text-gray-500 font-overpass text-base font-normal">
          No todos yet.
        </p>
      ) : (
        <div class="flex flex-col w-full rounded-lg border-dotted border-2 border-sky-500 mt-2 p-2 gap-2">
          {/* todoitem */}
          {todos.map((todo) => (
            <div
              key={todo.uidd}
              class="flex justify-between rounded-lg bg-white flex-grow px-5 py-4 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 font-overpass text-base font-normal items-center p-1 "
            >
              <span class="text-lg">{todo.todo}</span>
              <div class="flex gap-1 items-center">
                {' '}
                {/* Menambahkan kelas "items-center" di sini */}
                <img
                  class="hover:opacity-70 cursor-pointer"
                  src={edit}
                  alt="edit"
                  onClick={() => handleUpdate(todo)}
                />
                <img
                  class="hover:opacity-70 cursor-pointer"
                  src={apus}
                  alt="delete"
                  onClick={() => handleDelete(todo.uidd)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
