'use client';
import React, { FormEvent, useState } from 'react';
import Input from '@/shared/Input/Input';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { showAlert } from '@/utils/alert';

const PageForgetPassword = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgetPassword = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/forgetPassword/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.status !== 'success') {
        showAlert('error', 'Something went wrong, Could not get token with this email!');
        return;
      }
      showAlert('success', 'Token sent to your email!');
      router.push('/');
    } catch (error: any) {
      showAlert('error', error.message);
    }
  };
  return (
    <div className={`nc-PageLogin`} data-nc-id='PageLogin'>
      <div className='container mb-24 lg:mb-32'>
        <h2 className='my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center'>
          Forgot Password
        </h2>
        <div className='max-w-md mx-auto space-y-6'>
          {/* FORM */}
          <form onSubmit={handleForgetPassword} className='grid grid-cols-1 gap-6' action='#' method='post'>
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
            <ButtonPrimary type='submit'>Continue</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className='block text-center text-neutral-700 dark:text-neutral-300'>
            New user? {` `}
            <Link className='text-green-600' href='/signup'>
              Create an account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageForgetPassword;
