import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Shield, Truck, RefreshCw, BookOpen, Users, Briefcase, Newspaper } from 'lucide-react';

const pages = {
  'about': {
    title: 'Our Story',
    icon: Users,
    subtitle: 'How Velora came to be — simple choices, smart shopping.',
    sections: [
      {
        heading: 'Who We Are',
        content: 'Velora was founded with one simple belief: shopping should be easy, honest, and enjoyable. We are a curated e-commerce platform focused on bringing quality products from trusted brands directly to your doorstep across India.',
      },
      {
        heading: 'Our Mission',
        content: 'We believe every customer deserves a premium shopping experience — clear pricing, fast delivery, easy returns, and real human support. No hidden fees. No confusing policies. Just great products at great prices.',
      },
      {
        heading: 'Our Values',
        content: 'Simplicity • Quality • Transparency • Customer First. These four values guide every decision we make — from which products we list to how we handle returns.',
      },
      {
        heading: 'Our Team',
        content: 'We are a passionate team of product enthusiasts, engineers, and customer care specialists based in India, dedicated to building a shopping experience you can trust.',
      },
    ],
  },
  'privacy': {
    title: 'Privacy Policy',
    icon: Shield,
    subtitle: 'How we collect, use, and protect your personal data.',
    sections: [
      {
        heading: 'Information We Collect',
        content: 'We collect personal information you provide when registering (name, email, phone), placing orders (address, payment method), or contacting support. We also collect usage data such as pages visited and products viewed.',
      },
      {
        heading: 'How We Use Your Data',
        content: 'Your data is used to process orders, personalise your shopping experience, send order updates, improve our services, and provide customer support. We never sell your personal data to third parties.',
      },
      {
        heading: 'Data Security',
        content: 'All data is encrypted in transit using industry-standard SSL/TLS protocols. Payment information is handled by PCI-DSS compliant payment processors. We do not store card details on our servers.',
      },
      {
        heading: 'Your Rights',
        content: 'You have the right to access, correct, or delete your personal data at any time. Contact us at privacy@velora.in to make a request. We will respond within 30 days.',
      },
      {
        heading: 'Cookies',
        content: 'We use cookies to remember your session, preferences, and cart contents. You can disable cookies in your browser settings, though some features may not function correctly.',
      },
    ],
  },
  'terms': {
    title: 'Terms & Conditions',
    icon: BookOpen,
    subtitle: 'The rules and guidelines for using the Velora platform.',
    sections: [
      {
        heading: 'Acceptance of Terms',
        content: 'By accessing or using the Velora platform, you agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of our services immediately.',
      },
      {
        heading: 'Account Responsibility',
        content: 'You are responsible for maintaining the confidentiality of your account credentials. Any activity that occurs under your account is your responsibility. Report unauthorised access immediately.',
      },
      {
        heading: 'Product Listings',
        content: 'We strive to display accurate product information, images, and pricing. Prices and availability are subject to change. We reserve the right to cancel orders in the event of pricing errors.',
      },
      {
        heading: 'Order & Payment',
        content: 'All orders are subject to acceptance. We reserve the right to refuse service. Payment must be completed at the time of purchase. Orders are confirmed only after successful payment.',
      },
      {
        heading: 'Limitation of Liability',
        content: 'Velora shall not be liable for indirect, incidental, or consequential damages arising from product use or platform access. Our liability is limited to the order value of the transaction in question.',
      },
    ],
  },
  'shipping': {
    title: 'Shipping Policy',
    icon: Truck,
    subtitle: 'Everything about how and when your order reaches you.',
    sections: [
      {
        heading: 'Delivery Timelines',
        content: 'Standard delivery: 3–5 business days. Express delivery: 1–2 business days (available at additional cost). Remote locations may require 5–7 business days.',
      },
      {
        heading: 'Shipping Charges',
        content: 'We offer free standard shipping on all orders above ₹499. For orders below ₹499, a flat shipping fee of ₹149 applies. Express shipping costs ₹299 regardless of order value.',
      },
      {
        heading: 'Order Processing',
        content: 'Orders placed before 2:00 PM (IST) on business days are processed the same day. Orders placed after 2:00 PM or on weekends/holidays are processed the next business day.',
      },
      {
        heading: 'Tracking Your Order',
        content: 'Once your order is dispatched, you will receive a tracking ID via email. Use the "Track Order" feature on our platform to monitor your delivery in real time.',
      },
      {
        heading: 'Delivery Areas',
        content: 'We currently deliver across all major cities and towns in India. Orders to remote pincodes may take additional time. Enter your pincode at checkout to confirm serviceability.',
      },
    ],
  },
  'returns': {
    title: 'Return Policy',
    icon: RefreshCw,
    subtitle: 'Hassle-free returns and refunds — no questions asked.',
    sections: [
      {
        heading: '7-Day Return Window',
        content: 'If you are not fully satisfied with your purchase, you may return it within 7 days of delivery for a full refund or exchange. Items must be unused, in original packaging, with all tags intact.',
      },
      {
        heading: 'How to Initiate a Return',
        content: 'Contact us at returns@velora.in or use the "Help & Support" page within 7 days of receiving your order. Provide your Order ID and reason for return. We will arrange a free pickup within 2 business days.',
      },
      {
        heading: 'Refund Processing',
        content: 'Refunds are processed within 5–7 business days after the returned item is received and inspected. Refunds are credited to the original payment method (card, UPI, bank account).',
      },
      {
        heading: 'Non-Returnable Items',
        content: 'Perishable goods, personalised/custom products, digital downloads, and intimate apparel cannot be returned unless they arrive damaged or defective.',
      },
      {
        heading: 'Damaged or Wrong Items',
        content: 'If you receive a damaged or wrong product, photograph it and contact us within 48 hours of delivery. We will send a replacement at no extra cost or issue a full refund.',
      },
    ],
  },
  'careers': {
    title: 'Careers at Velora',
    icon: Briefcase,
    subtitle: 'Join our team and help shape the future of shopping in India.',
    sections: [
      {
        heading: 'Why Work With Us?',
        content: 'At Velora, we move fast, think big, and put people first. We offer competitive salaries, flexible working hours, remote-friendly roles, and a culture where your ideas actually matter.',
      },
      {
        heading: 'Open Roles',
        content: 'We are currently hiring for: Full-Stack Engineer (React/Node), Product Manager, Customer Experience Specialist, Data Analyst, and Marketing Associate. More roles added regularly.',
      },
      {
        heading: 'Our Culture',
        content: 'We are a diverse, inclusive team that celebrates curiosity and ownership. We hold regular learning sessions, team outings, and hackathons. Every team member has a direct impact on our product.',
      },
      {
        heading: 'How to Apply',
        content: 'Send your resume and a brief note about why you want to join Velora to careers@velora.in. We review every application personally and respond within 7 business days.',
      },
    ],
  },
  'blog': {
    title: 'Velora Blog',
    icon: Newspaper,
    subtitle: 'Shopping guides, product reviews, and lifestyle stories.',
    sections: [
      {
        heading: '🛍️ Top 10 Must-Have Products This Season',
        content: 'From elegant leather bags to smart home gadgets, our curated list of this season\'s best products will help you shop smarter. Each pick is handpicked by our product team for quality and value.',
      },
      {
        heading: '💡 How to Get the Best Deals on Velora',
        content: 'Did you know our "Today\'s Deals" section refreshes every 24 hours? Pro tip: check in every morning for flash discounts of up to 60% off. Bookmark the Offers page for exclusive promo codes.',
      },
      {
        heading: '📦 Behind the Scenes: How We Pack Your Orders',
        content: 'Every order at Velora goes through a 3-point quality check before dispatch. Our packaging team ensures items are bubble-wrapped, sealed, and labelled correctly so they reach you in perfect condition.',
      },
      {
        heading: '🎯 Style Guide: Building a Capsule Wardrobe',
        content: 'A capsule wardrobe is built on a few versatile, timeless pieces that you can mix and match. We explore the 12 essential items every wardrobe needs and where to find them on Velora.',
      },
    ],
  },
};

export const StaticInfoPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const page = pages[slug];

  if (!page) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <p className="text-3xl font-serif font-bold">Page not found</p>
        <button onClick={() => navigate('/')} className="text-xs text-[#8B5E3C] font-bold hover:underline cursor-pointer">← Back to Home</button>
      </div>
    );
  }

  const Icon = page.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn text-[#2F2F2F]">
      {/* Header */}
      <div className="border-b border-[#2F2F2F]/10 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-[#7A756B] hover:text-[#2F2F2F] transition-colors cursor-pointer mb-4"
        >
          <ArrowLeft size={12} /> Back
        </button>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center text-[#8B5E3C]">
            <Icon size={22} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-wide">{page.title}</h1>
            <p className="text-xs text-[#7A756B] mt-1 font-sans">{page.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {page.sections.map((section, i) => (
          <div key={i} className="bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm p-6 space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#2F2F2F]">{section.heading}</h2>
            <p className="text-sm text-[#7A756B] leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="bg-[#6C4E31] rounded-sm p-6 text-center space-y-3">
        <p className="text-sm font-serif font-bold text-white">Have more questions?</p>
        <p className="text-xs text-white/70">Our support team is available 24/7 to help you.</p>
        <button
          onClick={() => navigate('/help')}
          className="bg-white text-[#6C4E31] px-6 py-2 text-xs uppercase tracking-widest font-bold rounded-sm hover:bg-[#FAF8F3] transition-colors cursor-pointer"
        >
          Visit Help & Support
        </button>
      </div>
    </div>
  );
};

export default StaticInfoPage;
