'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid credentials');
    } else {
      router.push('/');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-background-s p-8 rounded shadow-md w-96'>
        <h1 className='text-2xl font-bold mb-4'>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block mb-2'>Username</label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full border p-2 rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-2'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full border p-2 rounded'
            />
          </div>
          {error && <p className='text-red-500 mb-4'>{error}</p>}
          <button
            type='submit'
            className='w-full bg-blue-500 text-white p-2 rounded'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
