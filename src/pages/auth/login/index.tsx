'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faInstagram,faLinkedin } from "@fortawesome/free-brands-svg-icons";

function login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='relative'>
    <div className='absolute top-0 w-full h-[130px] bg-gradient-to-r from-purple-400 via-pink-500 to-orange-300'></div>
    <div className="min-h-screen flex justify-center">

      <div className="absolute top-[70px] mx-auto flex flex-col gap-1 bg-white z-20 shadow-md py-8 px-6 max-w-[280px] w-full">
        <Link href="/">
            <Image src="/virul-logo.svg" width={70} height={70} alt="virul"  className='mx-auto mt-[11px]'/>
        </Link>
        <div className='leading-6'>
            <h2 className="text-[24px] font-bold text-center mt-6 tracking-tight">Log in</h2>
            <p className="text-center text-[14px] text-[#6F7881] mb-2">
            Don't have an account?{' '}
            <Link href="/signup" className="text-pink-500 font-medium hover:underline">
                Sign up
            </Link>
            </p>
        </div>

        <form className="space-y-3 mt-[3px]">
          <div>
            <label className="block text-[12px] font-[400] text-[#6F7881]">Email</label>
            <input
              type="email"
              className="mt-1 block text-[14px] w-full rounded-[4px] border border-gray-300 p-2 focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>

          <div>
            <label className="flex justify-between text-[12px] font-[400] text-[#6F7881]">
              Password
              <Link href="/forgot-password" className="text-pink-500 hover:underline text-[12px]">
                Forgot password?
              </Link>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                minLength={6}
                className="mt-1 block w-full indent-1 text-[12px] text-[#6F7881] rounded-[4px] border border-gray-300 p-2 pr-10 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Minimum 6 characters"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#EC248F] mt-2 text-white text-[14px] rounded-[4px] px-1.5 py-2 font-semibold hover:bg-pink-700 transition"
          >
            Log in
          </button>
        </form>

        <hr className='mt-5'/>

        <div className="flex justify-center space-x-4 mt-6 text-white">
            <div className='p-2 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-orange-300'>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faFacebookF}/>
                </a>
            </div>
            <div>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter}/>
            </a>
            </div>
            <div>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram}/>
            </a>
            </div>
            <div>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin}/>
            </a>
            </div>
          
        </div>

        <p className="text-center text-gray-500 mt-6 text-sm">&copy;2025 Virul</p>
        <div className="flex justify-center gap-4 mt-2 text-sm text-pink-500">
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

export default login;