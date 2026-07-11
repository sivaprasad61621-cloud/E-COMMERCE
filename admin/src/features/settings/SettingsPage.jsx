import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSettings } from '../../store/slices/settingsSlice';
import Card from '../../components/Card';
import Button from '../../components/Button';
import {
  Settings, User, Sliders, Database, Save, Check,
  Bell, Lock, RefreshCw, Wifi, WifiOff, Eye, EyeOff, AlertCircle
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const SettingsPage = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const user = useSelector((state) => state.auth.user);

  // Business config states
  const [storeName, setStoreName] = useState(settings.storeName);
  const [currency, setCurrency] = useState(settings.currency);
  const [lowStockThreshold, setLowStockThreshold] = useState(settings.lowStockThreshold);
  const [theme, setTheme] = useState(settings.theme);

  // Notification toggle states (persisted in localStorage)
  const [notifyLowStock, setNotifyLowStock] = useState(
    () => JSON.parse(localStorage.getItem('notify_lowStock') ?? 'true')
  );
  const [notifyNewOrder, setNotifyNewOrder] = useState(
    () => JSON.parse(localStorage.getItem('notify_newOrder') ?? 'true')
  );
  const [notifyNewCustomer, setNotifyNewCustomer] = useState(
    () => JSON.parse(localStorage.getItem('notify_newCustomer') ?? 'false')
  );

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);

  // Database status
  const [dbStatus, setDbStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [serverUrl, setServerUrl] = useState(API);
  const [lastPinged, setLastPinged] = useState(null);

  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToastMessage = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Ping server to check status
  const checkServerStatus = async () => {
    setDbStatus('checking');
    try {
      const res = await fetch(`${serverUrl}/health`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        setDbStatus('online');
      } else {
        setDbStatus('offline');
      }
    } catch {
      setDbStatus('offline');
    }
    setLastPinged(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
  };

  useEffect(() => {
    checkServerStatus();
  }, []);

  // Save business settings
  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateSettings({ storeName, currency, lowStockThreshold, theme }));
    localStorage.setItem('notify_lowStock', JSON.stringify(notifyLowStock));
    localStorage.setItem('notify_newOrder', JSON.stringify(notifyNewOrder));
    localStorage.setItem('notify_newCustomer', JSON.stringify(notifyNewCustomer));
    showToastMessage('Platform configurations saved successfully.');
  };

  // Password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPwdError('');
    if (currentPassword !== 'password123') {
      setPwdError('Current password is incorrect.');
      return;
    }
    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }
    setPwdSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPwdSuccess(false), 3000);
    showToastMessage('Password updated successfully.');
  };

  const toggleSwitch = (value, setter, key) => {
    const next = !value;
    setter(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  const Toggle = ({ enabled, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex w-11 h-6 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? 'bg-[#8B5E3C]' : 'bg-[#2F2F2F]/20'
      }`}
    >
      <span
        className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-8 animate-fadeIn text-[#2F2F2F]">
      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-[#2F2F2F] text-[#FAF8F3] px-4 py-3 rounded-sm shadow-vintage-flat flex items-center gap-2 border-[0.5px] border-[#FAF8F3]/20 animate-slideIn z-50 text-sm tracking-wide">
          <Check size={16} className="text-[#8B5E3C]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#2F2F2F]/20 pb-6">
        <h2 className="text-4xl font-serif tracking-wide mb-2 flex items-center gap-3">
          <Settings size={28} className="text-[#8B5E3C] animate-spin-slow" />
          <span>Administration Settings</span>
        </h2>
        <p className="text-sm font-sans text-[#7A756B]">
          Configure business metadata, system parameters, notifications, password, and server connections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ── LEFT COLUMN ── */}
        <div className="space-y-8">

          {/* Business Config */}
          <form onSubmit={handleSave}>
            <Card title="Business Configuration" icon={Sliders}>
              <div className="space-y-5 pt-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">Storefront Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="bg-transparent border border-[#2F2F2F]/20 p-3 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors text-[#2F2F2F] font-serif text-lg font-medium"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">Primary Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="bg-transparent border border-[#2F2F2F]/20 p-3 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors text-[#2F2F2F]"
                    >
                      <option value="₹">₹ (INR)</option>
                      <option value="$">$ (USD)</option>
                      <option value="€">€ (EUR)</option>
                      <option value="£">£ (GBP)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">Low Stock Limit</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(e.target.value)}
                      className="bg-transparent border border-[#2F2F2F]/20 p-3 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors text-[#2F2F2F] font-mono"
                      required
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Notification Preferences */}
            <Card title="Notification Preferences" icon={Bell} className="mt-8">
              <div className="space-y-4 pt-2">
                {[
                  { label: 'Low Stock Alerts', sublabel: 'Alert when product stock drops below limit', value: notifyLowStock, key: 'notify_lowStock', setter: setNotifyLowStock },
                  { label: 'New Order Alerts', sublabel: 'Dashboard badge when new orders arrive', value: notifyNewOrder, key: 'notify_newOrder', setter: setNotifyNewOrder },
                  { label: 'New Customer Alerts', sublabel: 'Notify when a new customer registers', value: notifyNewCustomer, key: 'notify_newCustomer', setter: setNotifyNewCustomer },
                ].map(({ label, sublabel, value, key, setter }) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-[#2F2F2F]/10 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-[#2F2F2F]">{label}</p>
                      <p className="text-[11px] text-[#7A756B] mt-0.5">{sublabel}</p>
                    </div>
                    <Toggle enabled={value} onToggle={() => toggleSwitch(value, setter, key)} />
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" className="px-8 py-3.5 flex items-center gap-2 cursor-pointer shadow-sm hover:shadow">
                <Save size={16} />
                <span>Save Configurations</span>
              </Button>
            </div>
          </form>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-8">

          {/* Admin Profile */}
          <Card title="Admin Profile Details" icon={User}>
            <div className="space-y-4 pt-2">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">Authenticated Email Address</label>
                <input
                  type="email"
                  value={user?.email || 'admin@sshopping.com'}
                  disabled
                  className="bg-[#2F2F2F]/5 border border-[#2F2F2F]/10 p-3 text-sm rounded-sm text-[#7A756B] cursor-not-allowed font-mono"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">Account Authorization Level</label>
                <input
                  type="text"
                  value={user?.role || 'admin'}
                  disabled
                  className="bg-[#2F2F2F]/5 border border-[#2F2F2F]/10 p-3 text-sm rounded-sm text-[#7A756B] cursor-not-allowed uppercase tracking-wider font-semibold"
                />
              </div>
            </div>
          </Card>

          {/* Change Password */}
          <Card title="Change Password" icon={Lock}>
            <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
              {pwdError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700">
                  <AlertCircle size={14} />
                  {pwdError}
                </div>
              )}
              {pwdSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-sm text-xs text-green-700">
                  <Check size={14} />
                  Password updated successfully.
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPwd ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-transparent border border-[#2F2F2F]/20 p-3 pr-10 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors"
                    required
                  />
                  <button type="button" onClick={() => setShowCurrentPwd(!showCurrentPwd)} className="absolute right-3 top-3.5 text-[#7A756B]">
                    {showCurrentPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full bg-transparent border border-[#2F2F2F]/20 p-3 pr-10 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors"
                    required
                  />
                  <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-3.5 text-[#7A756B]">
                    {showNewPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="bg-transparent border border-[#2F2F2F]/20 p-3 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors"
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="secondary" className="px-6 py-2.5 flex items-center gap-2 cursor-pointer text-sm">
                  <Lock size={14} />
                  <span>Update Password</span>
                </Button>
              </div>
            </form>
          </Card>

          {/* Database & System Status */}
          <Card title="Database & System Status" icon={Database}>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-[#2F2F2F]/10 pb-3">
                <span className="text-xs uppercase tracking-widest text-[#7A756B] font-semibold">Connection Status</span>
                <span className={`text-xs px-2 py-1 font-semibold uppercase tracking-widest rounded-sm border flex items-center gap-1.5 ${
                  dbStatus === 'online'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : dbStatus === 'offline'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-[#2F2F2F]/5 text-[#7A756B] border-[#2F2F2F]/10'
                }`}>
                  {dbStatus === 'online' ? <Wifi size={11} /> : dbStatus === 'offline' ? <WifiOff size={11} /> : <RefreshCw size={11} className="animate-spin" />}
                  {dbStatus === 'online' ? 'API Online' : dbStatus === 'offline' ? 'Offline Mock Mode' : 'Checking...'}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">Server API URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    className="flex-1 bg-transparent border border-[#2F2F2F]/20 p-2.5 text-xs font-mono focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors text-[#2F2F2F]"
                  />
                  <button
                    type="button"
                    onClick={checkServerStatus}
                    className="px-3 border border-[#2F2F2F]/20 rounded-sm hover:bg-[#2F2F2F]/5 transition-colors text-[#7A756B] flex items-center gap-1 text-xs"
                  >
                    <RefreshCw size={12} className={dbStatus === 'checking' ? 'animate-spin' : ''} />
                    Ping
                  </button>
                </div>
                {lastPinged && (
                  <p className="text-[10px] text-[#7A756B]">Last checked: {lastPinged}</p>
                )}
              </div>

              <div className="p-3 bg-[#8B5E3C]/5 border-[0.5px] border-[#8B5E3C]/20 rounded-sm">
                <p className="text-[11px] leading-relaxed text-[#7A756B] font-sans">
                  <strong className="text-[#8B5E3C]">Developer Instruction:</strong> To switch to online PostgreSQL database mode, set{' '}
                  <code className="bg-[#2F2F2F]/5 px-1 py-0.5 rounded font-mono text-xs">USE_SUPABASE=true</code>{' '}
                  inside your backend server env parameters, register your migration schema, and restart your server environment.
                </p>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
