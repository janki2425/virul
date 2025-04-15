'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

function forgot() {

  return (
    <div className='relative'>
    <div className='absolute h_custom top-0 w-full h-[130px] bg-gradient-to-r from-[#855FA7] via-[#EC248F] to-[#FCC280]'></div>
    <div className="min-h-screen flex justify-center">

      <div className="absolute top-[70px] mx-auto flex flex-col gap-1 bg-[#F8F8F8] z-20 shadow-md pt-8 pb-11 px-6 w-full max-w-[280px] sm:max-w-[340px] md:max-w-[466px]">
        <Link href="/">
            <Image src="/virul-logo.svg" width={70} height={70} alt="virul"  className='mx-auto mt-[11px]'/>
        </Link>
        <div className='mb-1 md:mb-0'>
            <h2 className="text-[24px] font-[700] text-[#0f0f0f] text-center mt-5 tracking-tight leading-8">Forgot your password?</h2>
            <div className='text-center md:flex justify-center'>
                <p className="text-[14px] text-[#6F7881] mb-2">
                Or did you want to {' '}
                <Link href={'/auth/signup'} className="text-pink-500 font-medium hover:underline">
                    Sign up
                </Link>
                <span className='px-2'>or</span>
                </p>
                <Link href={'/auth/login'} className="text-pink-500 font-medium text-center text-[14px] hover:underline">
                    Log in
                </Link>
            </div>
        </div>

        <form className="space-y-3 mt-[3px]">
          <div>
            <label className="block text-[12px] font-[400] text-[#6F7881]">Email</label>
            <input
              type="email"
              className="mt-1 block text-[14px] w-full bg-white rounded-[4px] border border-gray-300 py-[7px] px-2 focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>


          <button
            type="submit"
            className="w-full bg-[#EC248F] mt-2 text-white text-[14px] rounded-[4px] px-1.5 py-2 font-[600] transition"
          >
            Send password reset link
          </button>
        </form>

        <hr className='mt-5'/>

        <div className="flex justify-center space-x-[10px] mt-6 text-white">
          <div className="flex items-center justify-center rounded-full w-[26px] h-[26px] bg-gradient-to-r from-[#855FA7] via-[#EC248F] to-[#FCC280]">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f text-[13px]"></i>
            </a>
          </div>
          <div className="flex items-center justify-center rounded-full w-[26px] h-[26px] bg-gradient-to-r from-[#855FA7] via-[#EC248F] to-[#FCC280]">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter text-[13px]"></i>
            </a>
          </div>
          <div className="flex items-center justify-center rounded-full w-[26px] h-[26px] bg-gradient-to-r from-[#855FA7] via-[#EC248F] to-[#FCC280]">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Image src={'/instagram.svg'} width={16} height={16} alt='instagram'/>
            </a>
          </div>
          <div className="flex items-center justify-center rounded-full w-[26px] h-[26px] bg-gradient-to-r from-[#855FA7] via-[#EC248F] to-[#FCC280]">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Image src={'/linkedin.svg'} width={16} height={16} alt='linkedin'/>
            </a>
          </div>
        </div>



        <p className="text-center text-black mt-4 text-[12px]">&copy;2025 Virul</p>
        <div className="flex justify-center gap-4 mt-2 text-[12px] text-pink-500">
          <Link href="/home" className="hover:underline">
            Home
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
    </div>
    
  );
}

export default forgot;