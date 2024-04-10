'use client';
import React, { FormEvent, useState } from 'react';

import googleSvg from '@/images/Google.svg';
import Input from '@/shared/Input/Input';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '@/redux/user/userSlice';
import { showAlert } from '@/utils/alert';
import { signInWithGooglePopup } from '@/utils/firebase.utils';

const PageSignUp = () => {
  const { loading, error } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.status !== 'success') {
        dispatch(signInFailure(data.message));
        showAlert('error', 'Something went wrong, Could not sign up!');
        return;
      }
      dispatch(signInSuccess(data));
      showAlert('success', 'User signed up successfully!');
      router.push('/');
    } catch (error: any) {
      dispatch(signInFailure(error.message));
      showAlert('error', error.message);
    }
  };

  const handleGoogleClick = async () => {
    try {
      dispatch(signInStart());
      const result = await signInWithGooglePopup();
      const { displayName, email, photoURL } = result.user;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/signWithGoogle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: displayName, email, photo: photoURL }),
      });

      const data = await res.json();
      if (data.status !== 'success') {
        dispatch(signInFailure(data.message));
        showAlert('error', "Couldn't sign up with google!");
        return;
      }
      dispatch(signInSuccess(data));
      showAlert('success', 'User signed up successfully!');
      router.push('/');
    } catch (error: any) {
      dispatch(signInFailure(error.message));
      showAlert('error', error.message);
      console.log("Couldn't sign up with google", error);
    }
  };

  return (
    <div className={`nc-PageSignUp `} data-nc-id='PageSignUp'>
      <div className='container mb-24 lg:mb-32'>
        <h2 className='my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center'>
          Signup
        </h2>
        <div className='max-w-md mx-auto space-y-6 '>
          <div className='grid gap-3'>
            <a
              onClick={handleGoogleClick}
              href={'#'}
              className=' flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]'
            >
              <Image sizes='40px' className='flex-shrink-0' src={googleSvg} alt={'Continue with Google'} />
              <h3 className='flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm'>
                Continue with Google
              </h3>
            </a>
          </div>
          {/* OR */}
          <div className='relative text-center'>
            <span className='relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900'>
              OR
            </span>
            <div className='absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800'></div>
          </div>
          {/* FORM */}
          <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-6' action='#' method='post'>
            <label className='block'>
              <span className='text-neutral-800 dark:text-neutral-200'>User name</span>
              <Input onChange={handleChange} name='name' type='text' placeholder='Enter your name' className='mt-1' />
            </label>
            <label className='block'>
              <span className='text-neutral-800 dark:text-neutral-200'>Email address</span>
              <Input
                onChange={handleChange}
                name='email'
                type='email'
                placeholder='example@example.com'
                className='mt-1'
              />
            </label>
            <label className='block'>
              <span className='flex justify-between items-center text-neutral-800 dark:text-neutral-200'>Password</span>
              <Input onChange={handleChange} name='password' type='password' className='mt-1' />
            </label>
            <label className='block'>
              <span className='flex justify-between items-center text-neutral-800 dark:text-neutral-200'>
                Confirm Password
              </span>
              <Input onChange={handleChange} name='passwordConfirm' type='password' className='mt-1' />
            </label>
            <ButtonPrimary type='submit'>{loading === true ? 'Loading...' : 'Continue'}</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className='block text-center text-neutral-700 dark:text-neutral-300'>
            Already have an account? {` `}
            <Link className='text-green-600' href='/login'>
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
