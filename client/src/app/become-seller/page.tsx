import React from 'react';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Link from 'next/link';

const AccountBilling = () => {
  return (
    <div className='container mb-24 lg:mb-32'>
      <h2 className='mt-20 mb-10 text-2xl sm:text-3xl font-semibold'>Become a Seller</h2>
      <div className='max-w-2xl prose prose-slate dark:prose-invert'>
        <span className=''>
          {`Start your own business by following the registration process, listing products, managing orders, providing excellent customer service, and taking advantage of marketing and promotional tools, you can maximize your success here.`}
          <br />
          <br />
          The first step to becoming a seller on iShop is to register for a seller account. This often involves
          providing basic information about your business, such as your company name, contact details, and tax
          information. Once your seller account is set up, you can start listing your products. iShop provides you with
          business support services to assist with any questions or issues you may encounter.
        </span>
        <div className='pt-10'>
          <Link href={'/create-shop'}>
            <ButtonPrimary>Register your shop</ButtonPrimary>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountBilling;
