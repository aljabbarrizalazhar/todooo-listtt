import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from './firebase.js';
import { useNavigate } from 'react-router-dom';
import background from './assets/bg.png';

export default function Welcome() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerInformation, setRegisterInformation] = useState({
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/home');
      }
    });
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/home');
      })
      .catch((err) => alert(err.message));
  };

  const handleRegister = () => {
    if (registerInformation.email !== registerInformation.confirmEmail) {
      alert('email are not the same ');
      return;
    } else if (
      registerInformation.password !== registerInformation.confirmPassword
    ) {
      alert('password are not the same ');
      return;
    }

    createUserWithEmailAndPassword(
      auth,
      registerInformation.email,
      registerInformation.password
    )
      .then(() => {
        navigate('home');
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="flex flex-col p-4 md:py-6 lg:py-8 xl:py-10 items-center ">
      <div class="flex items-center justify-center mb-4">
        <h1 class="font-overpass text-4xl font-extrabold bg-gradient-to-tl from-cyan-300 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
          Todo List App
        </h1>
      </div>
      {isRegistering ? (
        <>
          <div className="flex flex-col w-full rounded-lg border-solid border-2 border-slate-500 mt-2 p-2 gap-2 max-w-xl">
            <h2 class="font-overpass text-2xl font-semibold ">Register</h2>
            <input
              className="border-b-2 border-slate-300 bg-transparent placeholder-text-black h-8 focus:outline-none"
              type="email"
              value={registerInformation.email}
              placeholder="Email"
              onChange={(e) =>
                setRegisterInformation({
                  ...registerInformation,
                  email: e.target.value,
                })
              }
            />
            <input
              className="border-b-2 border-slate-300 bg-transparent placeholder-text-black h-8 focus:outline-none"
              type="email"
              value={registerInformation.confirmEmail}
              placeholder="Confirm Email"
              onChange={(e) =>
                setRegisterInformation({
                  ...registerInformation,
                  confirmEmail: e.target.value,
                })
              }
            />
            <input
              className="border-b-2 border-slate-300 bg-transparent placeholder-text-black h-8 focus:outline-none"
              type="password"
              value={registerInformation.password}
              placeholder="Password"
              onChange={(e) =>
                setRegisterInformation({
                  ...registerInformation,
                  password: e.target.value,
                })
              }
            />
            <input
              className="border-b-2 border-slate-300 bg-transparent placeholder-text-black h-8 focus:outline-none"
              type="password"
              value={registerInformation.confirmPassword}
              placeholder="Confirm password"
              onChange={(e) =>
                setRegisterInformation({
                  ...registerInformation,
                  confirmPassword: e.target.value,
                })
              }
            />
            <button className="hover:underline" onClick={handleRegister}>
              Register
            </button>
            <button
              className="hover:underline"
              onClick={() => setIsRegistering(false)}
            >
              Have an Account? Login
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col w-full rounded-lg border-solid border-2 border-slate-500 mt-2 p-2 gap-2 max-w-xl">
            <h2 class="font-overpass text-2xl font-semibold ">Login</h2>
            <input
              className="border-b-2 border-slate-300 bg-transparent placeholder-text-black h-8 focus:outline-none"
              type="email"
              onChange={handleEmailChange}
              value={email}
              placeholder="Username"
            />
            <input
              className="border-b-2 border-slate-300 bg-transparent placeholder-text-black h-8 focus:outline-none"
              type="password"
              onChange={handlePasswordChange}
              value={password}
              placeholder="Password"
            />
            <button className="hover:underline" onClick={handleSignIn}>
              Sign In
            </button>
            <button
              className="hover:underline"
              onClick={() => setIsRegistering(true)}
            >
              Create an Account
            </button>
          </div>
        </>
      )}
    </div>
  );
}
