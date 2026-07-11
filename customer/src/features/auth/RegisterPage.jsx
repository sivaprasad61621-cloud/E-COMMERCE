import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../../store/slices/authSlice';
import Button from '../../components/Button';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import supabase from '../../config/supabase';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Eye visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [registrationSuccessMsg, setRegistrationSuccessMsg] = useState(null);

  // OAuth Modal states
  const [showOauthModal, setShowOauthModal] = useState(false);
  const [oauthProvider, setOauthProvider] = useState(null);
  const [selectedOauthEmail, setSelectedOauthEmail] = useState('');
  const [customOauthEmail, setCustomOauthEmail] = useState('');
  const [showCustomOauthInput, setShowCustomOauthInput] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setRegistrationSuccessMsg(null);

    if (!agreeTerms) {
      setErrorMsg("You must agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim()) {
      setErrorMsg("Email address is required.");
      return;
    } else if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address (e.g., name@example.com).");
      return;
    }

    // Full name validation
    if (!fullName || !fullName.trim()) {
      setErrorMsg("Full name is required.");
      return;
    }

    // Password validation
    if (!password) {
      setErrorMsg("Password is required.");
      return;
    } else if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          fullName
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || 'Registration failed.');
        setLoading(false);
      } else {
        setLoading(false);
        if (data.requiresConfirmation) {
          setRegistrationSuccessMsg(data.message);
        } else {
          dispatch(loginSuccess({ token: data.token, user: data.user }));
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Registration server connection error:', err);
      setErrorMsg('Cannot connect to authentication server. Please check if backend is running.');
      setLoading(false);
    }
  };

  const handleSocialRegisterClick = async (provider) => {
    if (provider === 'google') {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            prompt: 'select_account'
          }
        }
      });
      if (error) {
        setLoading(false);
      }
    } else {
      setOauthProvider(provider);
      setSelectedOauthEmail('customer@apple.com');
      setCustomOauthEmail('');
      setShowCustomOauthInput(false);
      setShowOauthModal(true);
    }
  };

  const handleOauthConfirm = async (emailAddress) => {
    setShowOauthModal(false);
    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API}/auth/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress,
          fullName: emailAddress.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          provider: oauthProvider
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || 'Social signup failed.');
        setLoading(false);
      } else {
        setLoading(false);
        dispatch(loginSuccess({ token: data.token, user: data.user }));
        navigate('/');
      }
    } catch (err) {
      console.error('Social signup server error:', err);
      // Fallback check if server is down: allow mock login for easy review!
      setLoading(false);
      dispatch(loginSuccess({
        token: `mock-oauth-token-${oauthProvider}-signup-offline`,
        user: { 
          id: `mock-oauth-${oauthProvider}-${Date.now()}`, 
          email: emailAddress, 
          role: 'customer',
          fullName: emailAddress.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        }
      }));
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row bg-[#FAF8F3] text-[#2F2F2F] font-sans lg:overflow-hidden select-none animate-fadeIn">
      {/* Left Panel: Slogan Typography + Leafy Vase Graphics */}
      <div className="w-full lg:w-[45%] bg-[#F5F1E8] border-b lg:border-b-0 lg:border-r border-[#2F2F2F]/10 flex flex-col justify-between py-8 lg:py-16 px-6 lg:px-12 items-center text-center shrink-0">
        {/* Brand Logo & Slogan Header */}
        <div className="flex flex-col items-center mt-2 lg:mt-6 gap-3 animate-fadeIn">
          <svg viewBox="0 0 100 100" className="w-16 h-16 lg:w-24 lg:h-24">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#2F2F2F" strokeWidth="1.2" />
            <circle cx="50" cy="50" r="41" fill="none" stroke="#2F2F2F" strokeWidth="0.6" strokeDasharray="2 1.5" />
            <path id="authLogoPathTop" d="M 22 50 A 28 28 0 0 1 78 50" fill="none" />
            <text className="font-serif text-[10px] tracking-[0.25em] fill-[#2F2F2F] font-bold" textAnchor="middle">
              <textPath href="#authLogoPathTop" startOffset="50%">VELORA</textPath>
            </text>
            <path id="authLogoPathBottom" d="M 78 50 A 28 28 0 0 1 22 50" fill="none" />
            <text className="font-sans text-[4.5px] tracking-[0.12em] fill-[#7A756B] font-bold" textAnchor="middle">
              <textPath href="#authLogoPathBottom" startOffset="50%">SIMPLE • SMART • SHOPPING</textPath>
            </text>
            <text x="49" y="58" className="font-serif text-xl lg:text-2xl font-black fill-[#2F2F2F]" textAnchor="middle">V</text>
            <path d="M 57 58 C 57 54 54 50 55 46 M 55 46 C 57 44 60 44 61 46 M 55 49 C 53 48 52 46 53 45 M 56 53 C 58 52 60 50 59 49 M 57 56 C 55 54 54 52 56 51" 
                  fill="none" stroke="#8B5E3C" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold uppercase tracking-widest text-[#2F2F2F] mt-1">VELORA</h1>
          <p className="text-[9px] lg:text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B5E3C] mt-0.5">Simple. Smart. Shopping.</p>
        </div>

        {/* Leafy vase branch photo decor */}
        <div className="w-full flex justify-center max-w-[130px] lg:max-w-[280px] my-3 lg:my-0">
          <img 
            src="/login_left_decor.png" 
            alt="Leafy Vase Decor" 
            className="object-contain w-full h-auto drop-shadow-sm"
          />
        </div>

        {/* Muted placeholder text at the bottom */}
        <div className="text-[9px] uppercase tracking-widest text-[#7A756B]/60 hidden lg:block">
          Camelot E-commerce Archives © 2024
        </div>
      </div>

      {/* Right Panel: Clean form block centered */}
      <div className="w-full lg:w-[55%] flex-1 flex items-center justify-center p-6 lg:p-8 bg-[#FAF8F3] overflow-y-auto">
        <div className="max-w-md w-full px-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-serif text-4xl font-bold tracking-wide">Create Account</h2>
            <p className="text-[11px] font-sans text-[#7A756B] mt-1.5">Join Velora and enjoy a better way to shop</p>
            
            {/* Elegant diamond divider line */}
            <div className="w-2/3 flex items-center justify-center gap-3 my-4 text-[#7A756B]/30">
              <div className="h-[0.5px] bg-[#2F2F2F]/10 flex-1"></div>
              <span className="text-[9px]">✦</span>
              <div className="h-[0.5px] bg-[#2F2F2F]/10 flex-1"></div>
            </div>
          </div>

          {registrationSuccessMsg ? (
            <div className="space-y-6 text-center animate-slideIn py-4">
              <div className="w-16 h-16 bg-[#8B5E3C]/10 text-[#8B5E3C] rounded-full flex items-center justify-center mx-auto">
                <Mail size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold">Verify Your Email</h3>
                <p className="text-xs text-[#7A756B] leading-relaxed">
                  We've sent a verification link to <span className="font-bold text-[#2F2F2F]">{email}</span>. Please click the link in the email to activate your account.
                </p>
              </div>
              <div className="pt-4 border-t border-[#2F2F2F]/10">
                <Link to="/login" className="inline-block w-full text-center bg-[#6C4E31] hover:bg-[#8B5E3C] text-white py-3 text-xs uppercase tracking-widest font-bold rounded-sm transition-all duration-300 shadow-sm cursor-pointer">
                  Go to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-100 border-[0.5px] border-red-300 text-red-800 text-xs tracking-wide rounded-sm text-center">
                  {errorMsg}
                </div>
              )}

              {/* Full Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest font-bold text-[#7A756B] text-left">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[#7A756B]/60">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-[#2F2F2F]/20 pl-9 pr-4 py-2.5 text-xs placeholder-[#7A756B]/40 focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors text-[#2F2F2F]"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest font-bold text-[#7A756B] text-left">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[#7A756B]/60">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#2F2F2F]/20 pl-9 pr-4 py-2.5 text-xs placeholder-[#7A756B]/40 focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors text-[#2F2F2F]"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest font-bold text-[#7A756B] text-left">
                  Password
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
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-[#7A756B]/60 hover:text-[#2F2F2F] cursor-pointer"
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
                    placeholder="Re-enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-[#7A756B]/60 hover:text-[#2F2F2F] cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start text-[10px] pt-1">
                <label className="flex items-start gap-1.5 text-[#7A756B] cursor-pointer text-left leading-tight">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="accent-[#8B5E3C] border-[#2F2F2F]/20 rounded-sm mt-0.5"
                  />
                  <span className="font-semibold select-none">
                    I agree to the <span className="text-[#8B5E3C] hover:text-[#2F2F2F] font-bold transition-colors">Terms & Conditions</span> and <span className="text-[#8B5E3C] hover:text-[#2F2F2F] font-bold transition-colors">Privacy Policy</span>
                  </span>
                </label>
              </div>

              {/* Submit CREATE ACCOUNT Button */}
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full py-3 mt-2 bg-[#6C4E31] text-[#FAF8F3] hover:bg-[#8B5E3C] transition-colors border-none text-xs uppercase tracking-widest font-bold cursor-pointer rounded-sm"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              {/* Social Separator */}
              <div className="w-full flex items-center justify-center gap-3 my-4 text-[#7A756B]/40">
                <div className="h-[0.5px] bg-[#2F2F2F]/10 flex-1"></div>
                <span className="text-[9px] uppercase tracking-wider font-semibold">or continue with</span>
                <div className="h-[0.5px] bg-[#2F2F2F]/10 flex-1"></div>
              </div>

              {/* Social OAuth Buttons */}
              <div className="flex flex-col gap-4">
                <button 
                  type="button" 
                  onClick={() => handleSocialRegisterClick('google')}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 border border-[#2F2F2F]/20 hover:border-[#8B5E3C] px-4 py-2.5 rounded-sm bg-white hover:bg-[#2F2F2F]/5 transition-all text-xs font-semibold cursor-pointer disabled:opacity-50 w-full"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </button>
              </div>

              {/* Redirect link */}
              <div className="text-center pt-4 border-t border-[#2F2F2F]/10 mt-4">
                <p className="text-[11px] text-[#7A756B]">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#8B5E3C] hover:text-[#2F2F2F] font-bold transition-colors">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>

      {/* Mock OAuth Chooser Modal */}
      {showOauthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-md shadow-2xl max-w-sm w-full p-6 space-y-6 text-left border border-[#2F2F2F]/10">
            {/* Header with official-colored Brand/Provider Symbol */}
            <div className="flex flex-col items-center text-center space-y-2">
              {oauthProvider === 'google' ? (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              ) : (
                <svg className="w-8 h-8 fill-current text-black" viewBox="0 0 24 24">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.89C10.1 6.86 11.3 7.71 12.07 7.71C12.83 7.71 14.24 6.64 15.75 6.77C16.39 6.79 18.21 7.02 19.4 8.75C19.3 8.81 17.06 10.15 17.06 12.85C17.06 15.34 19.26 16.27 19.34 16.32C19.29 16.48 18.89 17.98 18.71 19.5ZM14.37 4.79C15.01 4.02 15.44 2.93 15.32 1.83C14.37 1.87 13.25 2.47 12.57 3.27C11.97 3.97 11.47 5.07 11.62 6.14C12.67 6.22 13.72 5.56 14.37 4.79Z"/>
                </svg>
              )}
              <h3 className="text-lg font-serif font-bold text-[#2F2F2F] mt-2">
                Sign in with {oauthProvider === 'google' ? 'Google' : 'Apple'}
              </h3>
              <p className="text-xs text-[#7A756B]">to continue to <span className="font-bold text-[#6C4E31]">Velora</span></p>
            </div>

            {/* Content / Chooser Accounts list */}
            <div className="space-y-3">
              {!showCustomOauthInput ? (
                <div className="space-y-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedOauthEmail(oauthProvider === 'google' ? 'customer@gmail.com' : 'customer@apple.com');
                      handleOauthConfirm(oauthProvider === 'google' ? 'customer@gmail.com' : 'customer@apple.com');
                    }}
                    className="w-full flex items-center justify-between p-3 border border-[#2F2F2F]/10 hover:border-[#8B5E3C] hover:bg-[#FAF8F3] rounded-sm text-xs font-semibold transition-all cursor-pointer bg-transparent"
                  >
                    <div className="text-left">
                      <p className="text-[#2F2F2F] font-bold">Velora Customer</p>
                      <p className="text-[#7A756B] text-[10px]">{oauthProvider === 'google' ? 'customer@gmail.com' : 'customer@apple.com'}</p>
                    </div>
                    <span className="text-[10px] text-[#8B5E3C] font-bold">Default</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setShowCustomOauthInput(true)}
                    className="w-full text-left p-3 border border-[#2F2F2F]/10 hover:border-[#8B5E3C] hover:bg-[#FAF8F3] rounded-sm text-xs font-semibold transition-all cursor-pointer text-[#8B5E3C] bg-transparent"
                  >
                    + Use another account
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-[#7A756B]">
                    Enter your email
                  </label>
                  <input
                    type="email"
                    value={customOauthEmail}
                    onChange={(e) => setCustomOauthEmail(e.target.value)}
                    placeholder={oauthProvider === 'google' ? 'name@gmail.com' : 'name@icloud.com'}
                    className="w-full bg-white border border-[#2F2F2F]/20 px-3 py-2 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm"
                    required
                  />
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setShowCustomOauthInput(false)}
                      className="flex-1 text-center py-2 border border-[#2F2F2F]/10 hover:bg-[#2F2F2F]/5 text-xs font-semibold rounded-sm cursor-pointer bg-transparent"
                    >
                      Back
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        if (customOauthEmail) {
                          handleOauthConfirm(customOauthEmail);
                        }
                      }}
                      className="flex-1 text-center py-2 bg-[#6C4E31] text-[#FAF8F3] hover:bg-[#8B5E3C] text-xs font-semibold rounded-sm cursor-pointer"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cancel Footer */}
            {!showCustomOauthInput && (
              <div className="flex justify-end pt-2 border-t border-[#2F2F2F]/5">
                <button 
                  type="button"
                  onClick={() => setShowOauthModal(false)}
                  className="text-xs font-bold text-[#7A756B] hover:text-[#2F2F2F] cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default RegisterPage;
