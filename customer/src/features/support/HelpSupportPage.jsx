import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle, Package, RefreshCw, CreditCard, Truck,
  ChevronDown, ChevronUp, Mail, Phone, ArrowLeft
} from 'lucide-react';


const faqs = [
  {
    q: 'How do I track my order?',
    a: 'Go to the "Track Order" page from the top navigation bar or header. Enter your Order ID (e.g., ORD-0921) to see real-time shipping and delivery status.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 7-day hassle-free return policy. If you are not satisfied with your purchase, you can return the item within 7 days of delivery for a full refund.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 3–5 business days within India. Express delivery (1–2 days) is available at an additional charge at checkout.',
  },
  {
    q: 'Can I cancel my order?',
    a: 'Orders can be cancelled within 24 hours of placing them, as long as they have not been packed or shipped. Contact us immediately if you wish to cancel.',
  },
  {
    q: 'Which payment methods are accepted?',
    a: 'We accept Visa, Mastercard, UPI, Net Banking, and all major digital wallets. All payments are 100% secure and encrypted.',
  },
  {
    q: 'I received a damaged product. What should I do?',
    a: 'Please take a photo of the damage and contact us within 48 hours of delivery at support@velora.in. We will arrange a replacement or full refund.',
  },
  {
    q: 'How do I reset my password?',
    a: 'On the login page, click "Forgot Password?" and enter your registered email. A secure reset link will be sent to your inbox.',
  },
];

const topics = [
  { icon: Package, label: 'Orders & Tracking', desc: 'Check order status, cancellations' },
  { icon: RefreshCw, label: 'Returns & Refunds', desc: '7-day return policy, refund process' },
  { icon: Truck, label: 'Shipping Info', desc: 'Delivery timelines, areas we serve' },
  { icon: CreditCard, label: 'Payments', desc: 'Accepted methods, failed payments' },
  { icon: MessageCircle, label: 'Account Help', desc: 'Password reset, profile updates' },
];

export const HelpSupportPage = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const toggleFaq = (i) => setOpenIndex(openIndex === i ? null : i);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="space-y-10 animate-fadeIn text-[#2F2F2F]">
      {/* Page Header */}
      <div className="border-b border-[#2F2F2F]/10 pb-5 flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-[#7A756B] hover:text-[#2F2F2F] transition-colors cursor-pointer mb-3"
          >
            <ArrowLeft size={12} /> Back to Home
          </button>
          <h1 className="text-3xl font-serif font-bold tracking-wide">Help & Support</h1>
          <p className="text-xs text-[#7A756B] mt-1.5 font-sans">
            We're here to help. Browse topics or send us a message.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs text-[#7A756B]">
          <div className="flex items-center gap-2 bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm px-4 py-2.5">
            <Mail size={14} className="text-[#8B5E3C]" />
            <span>support@velora.in</span>
          </div>
          <div className="flex items-center gap-2 bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm px-4 py-2.5">
            <Phone size={14} className="text-[#8B5E3C]" />
            <span>1800-VELORA (24/7)</span>
          </div>
        </div>
      </div>

      {/* Help Topics */}
      <div>
        <h2 className="text-sm uppercase tracking-widest font-extrabold text-[#2F2F2F] mb-4">Browse by Topic</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {topics.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm p-4 flex flex-col items-center text-center gap-3 hover:border-[#8B5E3C]/40 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center text-[#8B5E3C] group-hover:bg-[#8B5E3C] group-hover:text-white transition-all">
                <Icon size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-[#2F2F2F] block">{label}</span>
                <span className="text-[10px] text-[#7A756B] mt-0.5 block">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        {/* FAQ Section */}
        <div className="lg:col-span-3 space-y-3">
          <h2 className="text-sm uppercase tracking-widest font-extrabold text-[#2F2F2F] mb-4">
            Frequently Asked Questions
          </h2>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-[#2F2F2F]/5 transition-colors"
              >
                <span className="text-xs font-bold text-[#2F2F2F] pr-4">{faq.q}</span>
                {openIndex === i
                  ? <ChevronUp size={14} className="text-[#8B5E3C] shrink-0" />
                  : <ChevronDown size={14} className="text-[#7A756B] shrink-0" />
                }
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4 text-xs text-[#7A756B] leading-relaxed border-t border-[#2F2F2F]/10 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm p-6 space-y-5">
          <div className="border-b border-[#2F2F2F]/10 pb-4">
            <h2 className="text-sm uppercase tracking-widest font-extrabold text-[#2F2F2F]">
              Send Us a Message
            </h2>
            <p className="text-[10px] text-[#7A756B] mt-1">We'll respond within 24 hours.</p>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <MessageCircle size={22} className="text-green-700" />
              </div>
              <p className="text-sm font-bold text-green-800">Message Sent!</p>
              <p className="text-[10px] text-[#7A756B]">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Priya Sharma"
                  className="bg-white border border-[#2F2F2F]/20 px-3 py-2 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F] placeholder-[#7A756B]/50 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="bg-white border border-[#2F2F2F]/20 px-3 py-2 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F] placeholder-[#7A756B]/50 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">Your Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Describe your issue or question..."
                  className="bg-white border border-[#2F2F2F]/20 px-3 py-2 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F] placeholder-[#7A756B]/50 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#6C4E31] hover:bg-[#8B5E3C] text-white py-2.5 text-xs uppercase tracking-widest font-bold rounded-sm transition-all cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
