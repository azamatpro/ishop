'use client';
import React from 'react';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { showAlert } from '@/utils/alert';
import { deleteShopFailure, deleteShopStart, deleteShopSuccess } from '@/redux/shop/shopSlice';
import { useRouter } from 'next/navigation';

const GetOutOfShop = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentShop } = useSelector((state: any) => state.shop);

  const handleLogout = async (): Promise<void> => {
    try {
      dispatch(deleteShopStart());
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/shops/logoutShop`);
      const data = await res.json();
      if (data.status !== 'success') {
        dispatch(deleteShopFailure(data.message));
        showAlert('error', 'Something went wrong, Could not log out!');
        return;
      }
      dispatch(deleteShopSuccess(data));
      showAlert('success', 'You logged out from shop successfully!');
      router.push('/');
    } catch (error: any) {
      dispatch(deleteShopFailure(error.message));
      showAlert('error', error.message);
    }
  };

  const handleDeleteShop = async (): Promise<void> => {
    try {
      dispatch(deleteShopStart());
      const shopId = currentShop.data?.shop._id;
      const { token } = currentShop;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/shops/${shopId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        dispatch(deleteShopFailure('Could not delete shop document'));
        showAlert('error', 'Something went wrong, Could not delete your shop!');
        return;
      }
      dispatch(deleteShopSuccess(null));
      showAlert('success', 'Shop deleted successfully!');
      router.push('/');
    } catch (error: any) {
      dispatch(deleteShopFailure(error.message));
      showAlert('error', error.message);
    }
  };

  return (
    <div className='container mb-24 lg:mb-32'>
      <h2 className='mt-5 mb-10 text-2xl sm:text-3xl font-semibold'>Logout from shop</h2>
      <div className='max-w-2xl prose prose-slate dark:prose-invert'>
        <span className=''>
          {`Logging out ensures that information related to your shop remains safe and secure, especially if you're using a shared or public device. It's a small but crucial step in maintaining the confidentiality of your shop.`}
          <br />
          <br />
          After logging out, you will not receive message notifications. Would you still like to log out? If so, click
          the button below.
        </span>
        <div className='pt-10'>
          <Link href={'/'}>
            <ButtonPrimary onClick={handleLogout}>Log out</ButtonPrimary>
          </Link>
        </div>
      </div>

      <h2 className='mt-10 mb-10 text-2xl sm:text-3xl font-semibold'>Delete shop</h2>
      <div className='max-w-2xl prose prose-slate dark:prose-invert'>
        <span className=''>
          {`Contact the iShop Team regarding problems with your account. Our team is here to assist you with anything you need, whether it's resolving a problem, updating your preferences, or answering questions about our products and services.`}
          <br />
          <br />
          After deleting shop, you will not recover shop data. Would you still like to delete your shop? If so, click
          the button below.
        </span>
        <div className='pt-10'>
          <Link href={'/'}>
            <ButtonPrimary onClick={handleDeleteShop}>Delete shop</ButtonPrimary>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GetOutOfShop;
