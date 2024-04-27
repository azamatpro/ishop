'use client';
import React, { FormEvent, useState } from 'react';
import Input from '@/shared/Input/Input';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { showAlert } from '@/utils/alert';
import { createShopFailure, createShopStart, createShopSuccess } from '@/redux/shop/shopSlice';

const PageLogin = () => {
  const { loading } = useSelector((state: any) => state.user);

  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      dispatch(createShopStart());
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/shops/loginShop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.status !== 'success') {
        dispatch(createShopFailure(data.message));
        showAlert('error', data.message);
        return;
      }
      dispatch(createShopSuccess(data));
      showAlert('success', 'You logged in your shop successfully!');
      router.push('/shop');
    } catch (error: any) {
      dispatch(createShopFailure(error.message));
      showAlert('error', error.message);
    }
  };

  return (
    <div className={`nc-PageLogin`} data-nc-id='PageLogin'>
      <div className='container mb-24 lg:mb-32'>
        <h2 className='my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center'>
          Log in your shop
        </h2>
        <div className='max-w-md mx-auto space-y-6'>
          {/* FORM */}
          <form onSubmit={handleLogin} className='grid grid-cols-1 gap-6' action='#' method='post'>
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
              <span className='flex justify-between items-center text-neutral-800 dark:text-neutral-200'>
                Password
                <Link href='/forgetPassword' className='text-sm text-green-600'>
                  Forgot password?
                </Link>
              </span>
              <Input onChange={handleChange} name='password' type='password' className='mt-1' />
            </label>
            <ButtonPrimary type='submit'>{loading === true ? 'Loading...' : 'Continue'}</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className='block text-center text-neutral-700 dark:text-neutral-300'>
            No shop yet? {` `}
            <Link className='text-green-600' href='/become-seller'>
              Become a seller
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
