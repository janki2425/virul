import React , {useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { forgetPassword , resetPassword } from '../api/auth/auth'

const Reset = () => {

  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState<"email" | "reset">("email");
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await forgetPassword({ email: form.email });
      if (res.message === "OTP sent to your email") {
        toast.success("OTP sent to your email");
        setStep("reset");
      } else {
        toast.error(res.error || "Email not found");
      }
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.trim() !== form.confirmPassword.trim()) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(form);
      if (res.message === "Password reset successful") {
        toast.success("Password reset successful");
        router.push("/auth/Login");
      } else {
        toast.error(res.error || "Password reset failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='relative'>
    <div className='absolute h_custom top-0 w-full h-[130px] bg-gradient-to-r from-[#855FA7] via-[#EC248F] to-[#FCC280]'></div>
    <div className="min-h-screen flex justify-center">

      <div className="absolute top-[70px] mx-auto flex flex-col gap-1 bg-[#F8F8F8] z-20 shadow-md pt-8 pb-11 px-6 w-full w_custom">
        <Link href="/">
            <Image src="/virul-logo.svg" width={70} height={70} alt="virul"  className='mx-auto mt-[11px]'/>
        </Link>
        <div className='mb-1 md:mb-0'>
            <h2 className="text-[24px] font-[700] text-[#0f0f0f] text-center mt-5 tracking-tight leading-8">Reset your password</h2>
        </div>

        <form onSubmit={step === "email" ? handleEmailSubmit : handleResetSubmit}
         className="space-y-3 mt-[3px]">
          {step === "email" && (
          <div>
            <div>
              <label className="block text-[12px] font-[400] text-[#6F7881]">Email</label>
              <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block text-[14px] w-full bg-white rounded-[4px] border border-gray-300 py-[7px] px-2 focus:ring-pink-500 focus:border-pink-500"
              required
              />
            </div>
            <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#EC248F] mt-2 text-white text-[14px] cursor-pointer rounded-[4px] px-1.5 py-2 font-[600] transition"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
          </div>
          )}
          {step === "reset" && (
          <div>
            <div>
              <label className="block text-[12px] font-[400] text-[#6F7881]">OTP</label>
              <input
              name="otp"
                type="text"
                maxLength={6}
                value={form.otp}
                onChange={handleChange}
                className="mt-1 block text-[14px] w-full bg-white rounded-[4px] border border-gray-300 py-[7px] px-2 focus:ring-pink-500 focus:border-pink-500"
                required
                />
            </div>
            <div>
              <label className="block text-[12px] font-[400] text-[#6F7881]">New Password</label>
              <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 block text-[14px] w-full bg-white rounded-[4px] border border-gray-300 py-[7px] px-2 focus:ring-pink-500 focus:border-pink-500"
              required
              />
            </div>
            <div>
              <label className="block text-[12px] font-[400] text-[#6F7881]">Confirm Password</label>
              <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="mt-1 block text-[14px] w-full bg-white rounded-[4px] border border-gray-300 py-[7px] px-2 focus:ring-pink-500 focus:border-pink-500"
              required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#EC248F] mt-2 text-white text-[14px] cursor-pointer rounded-[4px] px-1.5 py-2 font-[600] transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
          )}
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
  )
}

export default Reset
