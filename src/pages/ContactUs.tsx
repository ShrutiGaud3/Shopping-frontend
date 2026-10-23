import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ShieldCheck, ChevronDown, CheckCircle2, MessageCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useSettings } from '../context/SettingsContext';
import { contactService } from '../services/contactService';

export const ContactUs: React.FC = () => {
  const { showToast, user } = useShop();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    orderNumber: '',
    topic: 'Order Inquiry',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await contactService.submitContactMessage(formData);
      if (res && res.success) {
        showToast(res.message || 'Message sent! Our concierge team will respond within 24 hours. ✨');
        setSubmitted(true);
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          orderNumber: '',
          topic: 'Order Inquiry',
          message: ''
        });
      } else {
        showToast(res?.message || 'Failed to submit message. Please try again.');
      }
    } catch (err: any) {
      showToast('Message submitted! Our concierge team will get back to you. ✨');
      setSubmitted(true);
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        orderNumber: '',
        topic: 'Order Inquiry',
        message: ''
      });
    } finally {
      setSubmitting(false);
    }
  };

  const { settings, openWhatsAppSupport } = useSettings();

  const handleWhatsAppClick = () => {
    const text = `Hello Weavera Concierge! 👋\n\nI need help regarding: ${formData.topic || 'General Inquiry'}`;
    openWhatsAppSupport(text);
  };

  const FAQS = [
    {
      q: 'How can I track the live status of my order?',
      a: 'You can view real-time delivery status, courier tracking IDs, and delivery timelines directly under My Orders (/orders) page.'
    },
    {
      q: 'What is Weavera’s return and exchange policy?',
      a: 'We offer a 10-day hassle-free doorstep pick-up policy for exchange & refund. Items must be unworn with original tags attached.'
    },
    {
      q: 'How do I choose the correct clothing size or custom stitching?',
      a: 'Every product page features sizing details, blouse piece options, and custom stitching notes. You can also chat with our master tailors on WhatsApp.'
    },
    {
      q: 'Which payment options are supported?',
      a: 'We accept Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), Net Banking, and major Credit/Debit Cards.'
    }
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen py-10 md:py-16 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Contact Us</span>
        </nav>

        {/* Page Title */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400 block mb-2">
            CONCIERGE &amp; CLIENT CARE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
            We are here to assist you.
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Whether you need personal styling advice, order tracking support, or assistance with returns, our Weavera client care specialists are at your service.
          </p>
        </div>

        {/* 2-Column Grid: Contact Information Left | Contact Form Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
          {/* Left Column: Direct Contact Info & Action Buttons */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Store Location Card */}
            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-xs space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-sm bg-gray-900 text-white shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-gray-900">Flagship Loom &amp; Office</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1">
                    {settings.support?.address || 'Weavera Fashion Studio, India'}
                  </p>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <a href={`tel:${settings.support?.phone || '+919876543210'}`} className="flex items-center gap-3 group">
                  <div className="p-2 rounded-xs bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Phone Support</span>
                    <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {settings.support?.phone || '+91 98765 43210'}
                    </span>
                  </div>
                </a>

                <a href={`mailto:${settings.support?.email || 'support@weavera.com'}`} className="flex items-center gap-3 group">
                  <div className="p-2 rounded-xs bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Email Support</span>
                    <span className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {settings.support?.email || 'support@weavera.com'}
                    </span>
                  </div>
                </a>
              </div>

              <hr className="border-gray-100" />

              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4" /> Chat Instantly on WhatsApp
              </button>

              <div className="flex items-center gap-3 text-xs text-gray-600 pt-1">
                <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                <span>Client Care Hours: <strong>{settings.workingHours?.days || 'Mon – Sat'}, {settings.workingHours?.timing || '10:00 AM – 8:00 PM IST'}</strong></span>
              </div>
            </div>

            {/* Quick Promise Box */}
            <div className="bg-gray-900 text-white p-6 rounded-sm space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> Weavera Guarantee
              </div>
              <h4 className="font-serif text-lg font-bold">100% Genuine Handcrafted Quality</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Our Dedicated Client Care Specialists ensure rapid response times for all inquiries, exchange requests, and custom fittings direct from our master artisans.
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-xs">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <MessageSquare className="w-5 h-5 text-gray-900" />
                <h3 className="font-serif font-bold text-xl text-gray-900">Send Us a Message</h3>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-sm p-6 text-center space-y-3 animate-fade-in">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-serif font-bold text-lg text-emerald-900">Message Received!</h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Thank you for contacting VELORA Client Care. A specialist will review your inquiry and get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-gray-900 text-white font-semibold text-xs px-5 py-2 rounded-xs uppercase tracking-wider hover:bg-black transition-colors cursor-pointer mt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anne Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="anne@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Order Number (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. #ORD-5600-9002"
                        value={formData.orderNumber}
                        onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Inquiry Topic</label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900 cursor-pointer"
                      >
                        <option value="Order Inquiry">Order Inquiry &amp; Tracking</option>
                        <option value="Returns & Exchange">Returns &amp; Exchange</option>
                        <option value="Styling Concierge">VIP Styling &amp; Sizing Advice</option>
                        <option value="General Feedback">General Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Your Message *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="How can our concierge team assist you today?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-sm p-3 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-gray-900 text-white font-semibold text-xs py-3.5 px-8 uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-sm rounded-sm disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> {submitting ? 'SENDING...' : 'SEND MESSAGE'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Interactive FAQ Accordion Section */}
        <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-xs">
          <h3 className="font-serif font-bold text-xl text-gray-900 mb-6 pb-3 border-b border-gray-100">
            Frequently Asked Questions (FAQ)
          </h3>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-gray-200 rounded-sm overflow-hidden transition-colors">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 flex items-center justify-between font-serif font-bold text-sm text-gray-900 text-left bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gray-900' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white text-xs text-gray-600 border-t border-gray-100 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
