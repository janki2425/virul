'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useMutation } from '@tanstack/react-query';

async function registerUser(formData: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) {
  const res = await fetch('/api/auth/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Signup failed');
  }

  return data;
}

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({first_name: '',last_name: '',email: '',password: '',});
  const [error, setError] = useState('');
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success('Signup successful!');
      router.push('/auth/login');
    },
    onError: (error: any) => {
      setError(error.message);
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate(form);
  };

  return (
    <div className='relative'>
    <div className='absolute h_custom top-0 w-full h-[130px] bg-gradient-to-r from-[#855FA7] via-[#EC248F] to-[#FCC280]'></div>
    <div className="min-h-screen flex justify-center">

      <div className="absolute top-[70px] mx-auto flex flex-col gap-1 bg-[#F8F8F8] z-20 shadow-md pt-8 pb-11 px-6 md:px-14 w-full max-w-[280px] sm:max-w-[340px] md:max-w-[466px]">
        <Link href="/">
            <Image src="/virul-logo.svg" width={70} height={70} alt="virul"  className='mx-auto mt-[11px]'/>
        </Link>
        <div className='leading-5'>
            <h2 className="text-[24px] font-[700] text-[#0f0f0f] text-center mt-6 md:mt-5 tracking-[-0.2px] leading-8">Great events start with Virul</h2>
            <p className="text-center text-[14px] text-[#6F7881] mb-2">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-pink-500 font-medium hover:underline">
                Log in
            </Link>
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 mt-[3px]">
          <div className='grid grid-cols-2 gap-[10px]'>
            <div>
                <label className="block text-[12px] font-[400] text-[#6F7881]">First Name</label>
                <input
                type="text"
                value={form.first_name}
                onChange={(e)=>setForm({...form , first_name:e.target.value})}
                className="mt-1 block text-[14px] w-full bg-white rounded-[4px] border border-gray-300 px-2 py-[7px] focus:ring-pink-500 focus:border-pink-500"
                required
                />
            </div>
            <div>
                <label className="block text-[12px] font-[400] text-[#6F7881]">Last Name</label>
                <input
                type="text"
                value={form.last_name} 
                onChange={(e)=>setForm({...form , last_name:e.target.value})}
                className="mt-1 block text-[14px] w-full bg-white rounded-[4px] border border-gray-300 px-2 py-[7px] focus:ring-pink-500 focus:border-pink-500"
                required
                />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-[400] text-[#6F7881]">Email</label>
            <input
              type="email"
              value={form.email} 
              onChange={(e)=>setForm({...form , email:e.target.value})}
              className="mt-1 block text-[14px] w-full bg-white rounded-[4px] border border-gray-300 px-2 py-[7px] focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>

          <div>
            <label className="flex justify-between text-[12px] font-[400] text-[#6F7881]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                minLength={6}
                value={form.password} 
                onChange={(e)=>setForm({...form , password:e.target.value})}
                className="mt-1 block w-full indent-1 text-[13px] bg-white text-[#6F7881] rounded-[4px] border border-gray-300 px-2 py-[7px] pr-10 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Minimum 6 characters"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Image src={'/eye.svg'} width={15} height={15} alt='show' /> : <Image src={'/eye-close.svg'} width={15} height={15} alt='hide' />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#EC248F] mt-2 text-white text-[14px] rounded-[4px] px-1.5 py-2 font-semibold hover:bg-pink-700 transition"
          >
            Sign up
          </button>

          <div className='text-[14px] font-[400] flex flex-col md:flex-row items-center justify-center mt-[6px]'>
            <p className='text-[#6F7881]'>By continuing you agree to</p>
            <p className='hover:underline text-[#EC248F]'>Virul's Terms of Service</p>
          </div>
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

export default Signup;