'use client';

import Label from '@/components/Label/Label';
import React, { useState, FormEvent } from 'react';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Input from '@/shared/Input/Input';
import Textarea from '@/shared/Textarea/Textarea';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { updateShopStart, updateShopFailure, updateShopSuccess } from '@/redux/shop/shopSlice';
import { showAlert } from '@/utils/alert';
import { useRouter } from 'next/navigation';

const ShopPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [shopData, setShopData] = useState({});

  const { loading, currentShop } = useSelector((state: any) => state.shop);

  let shop: any;

  if (currentShop) {
    shop = currentShop.data?.shop;
  }

  const handleChange = (e: any) => {
    setShopData({
      ...shopData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateShop = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(updateShopStart());
      const { token } = currentShop;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/shops/${shop?._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shopData),
      });
      const data = await res.json();
      if (data.status !== 'success') {
        dispatch(updateShopFailure(data.message));
        showAlert('error', 'Something went wrong, Could not update shop data!');
        return;
      }
      dispatch(updateShopSuccess(data));
      showAlert('success', 'Shop data updated successfully!');
      router.push('/shop');
    } catch (error: any) {
      dispatch(updateShopFailure(error.message));
      showAlert('error', error.message);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32 nc-AccountPage `}>
      <form onSubmit={handleUpdateShop} className='mx-6 space-y-10 sm:space-y-12'>
        {/* HEADING */}
        <h2 className='text-2xl sm:text-3xl font-semibold'>Shop infomation</h2>
        <div className='flex flex-col md:flex-row'>
          <div className='flex-shrink-0 flex items-start'>
            {/* AVATAR */}
            <div className='relative rounded-full overflow-hidden flex'>
              <Image
                src={`/${shop?.photo}`}
                alt='avatar'
                width={128}
                height={128}
                className='w-32 h-32 rounded-full object-cover z-0'
              />
              <div className='absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer'>
                <svg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125'
                    stroke='currentColor'
                    strokeWidth={1.5}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>

                <span className='mt-1 text-xs'>Change Image</span>
              </div>
              <input
                // onChange={handleFileChange}
                name='photo'
                type='file'
                accept='image/*'
                id='photo'
                className='absolute inset-0 opacity-0 cursor-pointer'
              />
            </div>
          </div>
          <div className='flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6'>
            {/* Shop name */}
            <div>
              <Label>Shop name</Label>
              <Input
                onChange={handleChange}
                placeholder='Name your shop!'
                name='name'
                className='mt-1.5'
                defaultValue={shop?.name}
              />
            </div>

            {/* Shop email */}
            <div>
              <Label>Shop email</Label>
              <div className='mt-1.5 flex'>
                <span className='inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm'>
                  <i className='text-2xl las la-envelope'></i>
                </span>
                <Input
                  onChange={handleChange}
                  name='email'
                  defaultValue={shop?.email}
                  className='!rounded-l-none'
                  placeholder='example@email.com'
                />
              </div>
            </div>

            {/* Password */}
            {!currentShop && (
              <div>
                <Label>Password</Label>
                <Input
                  type='password'
                  placeholder='Enter password for your shop!'
                  onChange={handleChange}
                  name='password'
                  className='mt-1.5'
                />
              </div>
            )}

            {/* Addess */}
            <div>
              <Label>Shop addess</Label>
              <div className='mt-1.5 flex'>
                <span className='inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm'>
                  <i className='text-2xl las la-map-signs'></i>
                </span>
                <Input
                  onChange={handleChange}
                  name='address'
                  className='!rounded-l-none'
                  placeholder='Enter shop address!'
                  defaultValue={shop?.address}
                />
              </div>
            </div>

            {/* Phone number */}
            <div>
              <Label>Shop phone number</Label>
              <div className='mt-1.5 flex'>
                <span className='inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm'>
                  <i className='text-2xl las la-phone-volume'></i>
                </span>
                <Input
                  onChange={handleChange}
                  name='phoneNumber'
                  className='!rounded-l-none'
                  placeholder='Enter shop phone number!'
                  defaultValue={shop?.phoneNumber}
                />
              </div>
            </div>

            {/* Shop zip code */}
            <div>
              <Label>Zip code</Label>
              <Input
                onChange={handleChange}
                name='zipCode'
                className='mt-1.5'
                placeholder='Enter zip code!'
                defaultValue={shop?.zipCode}
              />
            </div>

            {/* description */}
            <div>
              <Label>About shop</Label>
              <Textarea
                onChange={handleChange}
                name='description'
                placeholder='Tell us about your shop...'
                className='mt-1.5'
                defaultValue={shop?.description}
              />
            </div>

            <div className='pt-2'>
              <ButtonPrimary type='submit'>{loading === true ? 'Loading...' : 'Update shop'}</ButtonPrimary>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShopPage;
