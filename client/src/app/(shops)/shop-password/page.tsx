'use client';
import Label from '@/components/Label/Label';
import React, { useRef, useState } from 'react';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Input from '@/shared/Input/Input';
import { useSelector, useDispatch } from 'react-redux';
import { updateShopStart, updateShopSuccess, updateShopFailure } from '@/redux/shop/shopSlice';
import { showAlert } from '@/utils/alert';
import { useRouter } from 'next/navigation';

const ShopPass = () => {
  const inputRefs = useRef<{
    input1: HTMLInputElement | null;
    input2: HTMLInputElement | null;
    input3: HTMLInputElement | null;
  }>({
    input1: null,
    input2: null,
    input3: null,
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, currentShop } = useSelector((state: any) => state.shop);
  const [formData, setFormData] = useState({});

  const handleChange = (e: any): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordUpdate = async () => {
    try {
      dispatch(updateShopStart());
      const { token } = currentShop;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/shops/updateShopPassword`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);

      if (data.status !== 'success') {
        dispatch(updateShopFailure(data.message));
        showAlert('error', 'Something went wrong, Could not change your password!');
        return;
      }
      dispatch(updateShopSuccess(data));
      // Clear the input values after successful data update
      Object.values(inputRefs.current).forEach((inputRef) => {
        if (inputRef) {
          inputRef.value = '';
        }
      });
      showAlert('success', 'Password changed successfully!');
      router.push('/shop');
    } catch (error: any) {
      dispatch(updateShopFailure(error.message));
      showAlert('error', error.message);
    }
  };

  return (
    <div className='space-y-10 sm:space-y-12'>
      {/* HEADING */}
      <h2 className='text-2xl sm:text-3xl font-semibold'>Update shop password</h2>
      <div className=' max-w-xl space-y-6'>
        <div>
          <Label>Current password</Label>
          <Input
            ref={(input) => (inputRefs.current.input1 = input)}
            onChange={handleChange}
            name='passwordCurrent'
            type='password'
            className='mt-1.5'
          />
        </div>
        <div>
          <Label>New password</Label>
          <Input
            ref={(input) => (inputRefs.current.input2 = input)}
            onChange={handleChange}
            name='password'
            type='password'
            className='mt-1.5'
          />
        </div>
        <div>
          <Label>Confirm password</Label>
          <Input
            ref={(input) => (inputRefs.current.input3 = input)}
            onChange={handleChange}
            name='passwordConfirm'
            type='password'
            className='mt-1.5'
          />
        </div>
        <div className='pt-2'>
          <ButtonPrimary onClick={handlePasswordUpdate}>{loading ? 'Loading...' : 'Update password'}</ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default ShopPass;
