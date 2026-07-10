import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import supabase from '../../config/supabase';

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg("Your password has been reset successfully. You can now use your new password to log in.");
      }
    } catch (err) {
      console.error("Password reset update error:", err);
      setErrorMsg("Cannot update password. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-[#FAF8F3] text-[#2F2F2F] font-sans overflow-hidden select-none animate-fadeIn">
      {/* Left Panel: Slogan Typography + Leafy Vase Graphics (45% width) */}
      <div className="w-[45%] bg-[#F5F1E8] border-r border-[#2F2F2F]/10 flex flex-col justify-between py-16 px-12 items-center text-center">
        {/* Brand Logo & Slogan Header */}
        <div className="flex flex-col items-center mt-6 gap-3">
          <div className="flex items-center justify-center border-2 border-[#2F2F2F] w-24 h-24 shrink-0 bg-transparent font-serif text-6xl font-black select-none text-[#2F2F2F] tracking-normal mb-2">
            S
          </div>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-widest text-[#2F2F2F] mt-1">FOR SHOPPING</h1>
          <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#7A756B] mt-0.5">Simple. Smart. Shopping.</p>
        </div>

        {/* Leafy vase branch photo decor */}
        <div className="w-full flex justify-center max-w-[280px]">
          <img 
            src="/login_left_decor.png" 
            alt="Leafy Vase Decor" 
            className="object-contain w-full h-auto drop-shadow-sm"
          />
        </div>

        {/* Muted placeholder text at the bottom */}
        <div className="text-[9px] uppercase tracking-widest text-[#7A756B]/60">
          Camelot E-commerce Archives © 2024
        </div>
      </div>

      {/* Right Panel: Clean form block centered (55% width) */}
      <div className="w-[55%] flex-1 flex items-center justify-center p-8 bg-[#FAF8F3] overflow-y-auto">
        <div className="max-w-md w-full px-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-serif text-4xl font-bold tracking-wide">Set New Password</h2>
            <p className="text-[11px] font-sans text-[#7A756B] mt-1.5">Create a strong, secure password for your account</p>
            
            {/* Elegant diamond divider line */}
            <div className="w-2/3 flex items-center justify-center gap-3 my-4 text-[#7A756B]/30">
              <div className="h-[0.5px] bg-[#2F2F2F]/10 flex-1"></div>
              <span className="text-[9px]">✦</span>
              <div className="h-[0.5px] bg-[#2F2F2F]/10 flex-1"></div>
            </div>
          </div>

          {successMsg ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold">Password Reset Complete</h3>
                <p className="text-xs text-[#7A756B] leading-relaxed">
                  {successMsg}
                </p>
              </div>
              <div className="pt-4 border-t border-[#2F2F2F]/10">
                <Link 
                  to="/login"
                  className="inline-block w-full text-center bg-[#6C4E31] hover:bg-[#8B5E3C] text-white py-3 text-xs uppercase tracking-widest font-bold rounded-sm transition-all duration-300 shadow-sm cursor-pointer"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-100 border-[0.5px] border-red-300 text-red-800 text-xs tracking-wide rounded-sm text-center">
                  {errorMsg}
                </div>
              )}

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest font-bold text-[#7A756B] text-left">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[#7A756B]/60">
                    <Lock size={14} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-[#2F2F2F]/20 pl-9 pr-10 py-2.5 text-xs placeholder-[#7A756B]/40 focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors text-[#2F2F2F]"
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-[#7A756B]/60 hover:text-[#8B5E3C] transition-colors cursor-pointer bg-transparent border-none"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest font-bold text-[#7A756B] text-left">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[#7A756B]/60">
                    <Lock size={14} />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-[#2F2F2F]/20 pl-9 pr-10 py-2.5 text-xs placeholder-[#7A756B]/40 focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors text-[#2F2F2F]"
                    placeholder="Re-enter your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-[#7A756B]/60 hover:text-[#8B5E3C] transition-colors cursor-pointer bg-transparent border-none"
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full py-3 mt-2 bg-[#6C4E31] text-[#FAF8F3] hover:bg-[#8B5E3C] transition-colors border-none text-xs uppercase tracking-widest font-bold cursor-pointer rounded-sm"
                disabled={loading}
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
              </Button>

              <div className="text-center pt-4 border-t border-[#2F2F2F]/10 mt-4">
                <Link 
                  to="/login"
                  className="text-xs font-bold text-[#8B5E3C] hover:text-[#2F2F2F] transition-colors"
                >
                  Cancel and Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
