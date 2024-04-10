'use client';

import React, { useState } from 'react';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Input from '@/shared/Input/Input';
import Textarea from '@/shared/Textarea/Textarea';
import { useDispatch, useSelector } from 'react-redux';
import { createShopStart, createShopSuccess, createShopFailure } from '@/redux/shop/shopSlice';
import { showAlert } from '@/utils/alert';
import { useRouter } from 'next/navigation';

const ShopPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});

  const { loading } = useSelector((state: any) => state.shop);

  const handleChange = (e: any) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateShop = async (e: any) => {
    e.preventDefault();
    try {
      dispatch(createShopStart());
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/shops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.status !== 'success') {
        dispatch(createShopFailure(data.message));
        showAlert('error', 'Something went wrong, Could not create shop!');
        return;
      }
      dispatch(createShopSuccess(data));
      showAlert('success', 'Shop created successfully!');
      router.push('/shop');
    } catch (error: any) {
      dispatch(createShopFailure(error.message));
      showAlert('error', error.message);
    }
  };
  return (
    <div className={`nc-PageSignUp `} data-nc-id='PageSignUp'>
      <div className='container mb-24 lg:mb-32'>
        <h2 className='my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center'>
          Register shop
        </h2>
        <div className='max-w-md mx-auto space-y-6 '>
          {/* FORM */}
          <form onSubmit={handleCreateShop} className='grid grid-cols-1 gap-6' action='#' method='post'>
            {/* SHop Name */}
            <label className='block'>
              <span className='text-neutral-800 dark:text-neutral-200'>Shop name</span>
              <Input onChange={handleChange} placeholder='Name your shop!' name='name' className='mt-1' />
            </label>

            {/* Shop Email */}
            <label className='block'>
              <span className='text-neutral-800 dark:text-neutral-200'>Email address</span>
              <Input
                onChange={handleChange}
                name='email'
                type='email'
                className='mt-1'
                placeholder='example@email.com'
              />
            </label>

            {/* Password */}
            <label className='block'>
              <span className='flex justify-between items-center text-neutral-800 dark:text-neutral-200'>Password</span>
              <Input onChange={handleChange} name='password' type='password' className='mt-1' />
            </label>

            {/* Confirm Password */}
            <label className='block'>
              <span className='flex justify-between items-center text-neutral-800 dark:text-neutral-200'>
                Confirm Password
              </span>
              <Input onChange={handleChange} name='passwordConfirm' type='password' className='mt-1' />
            </label>

            {/* Shop Addess */}
            <label className='block'>
              <span className='text-neutral-800 dark:text-neutral-200'>Shop address</span>
              <Input
                onChange={handleChange}
                name='address'
                type='text'
                className='mt-1'
                placeholder='Enter shop address!'
              />
            </label>

            {/* Phone number */}
            <label className='block'>
              <span className='text-neutral-800 dark:text-neutral-200'>Shop phone number</span>
              <Input
                onChange={handleChange}
                name='phoneNumber'
                type='text'
                className='mt-1'
                placeholder='Enter shop phone number!'
              />
            </label>

            {/* Shop zip code */}
            <label className='block'>
              <span className='text-neutral-800 dark:text-neutral-200'>Zip code</span>
              <Input
                onChange={handleChange}
                name='zipCode'
                type='number'
                className='mt-1'
                placeholder='Enter zip code!'
              />
            </label>

            {/* description */}
            <label className='block'>
              <span className='text-neutral-800 dark:text-neutral-200'>About shop</span>
              <Textarea
                onChange={handleChange}
                name='description'
                typeof='text'
                placeholder='Tell us about your shop...'
                className='mt-1'
              />
            </label>

            <ButtonPrimary type='submit'> {loading === true ? 'Loading...' : 'Continue'}</ButtonPrimary>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
