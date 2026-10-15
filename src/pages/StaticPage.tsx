import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { pageService } from '../services/pageService';
import { faqService } from '../services/faqService';
import { useSettings } from '../context/SettingsContext';
import type { PageItem, FaqItem } from '../types';

export const StaticPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PageItem | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<Record<string, boolean>>({});
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('All');
  const { openWhatsAppSupport } = useSettings();

  useEffect(() => {
    let isMounted = true;
    const loadContent = async () => {
      setLoading(true);
      try {
        if (!slug) return;

        // Fetch CMS page
        const pageRes = await pageService.getPageBySlug(slug);
        if (isMounted && pageRes.success && pageRes.data) {
          setPage(pageRes.data);
        }

        // If it's FAQ page, or slug is 'faq' or 'faqs', fetch FAQs
        if (slug === 'faq' || slug === 'faqs') {
          const faqRes = await faqService.getFaqs();
          if (isMounted && faqRes.success && faqRes.data) {
            setFaqs(faqRes.data);
          }
        }
      } catch (err) {
        console.error('Error loading static page:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadContent();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const toggleFaq = (id: string) => {
    setOpenFaq((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isFaqPage = slug === 'faq' || slug === 'faqs';

  // Group FAQs by category
  const faqCategories = ['All', ...Array.from(new Set(faqs.map((f) => f.category || 'General')))];
  const filteredFaqs =
    selectedFaqCategory === 'All'
      ? faqs
      : faqs.filter((f) => (f.category || 'General') === selectedFaqCategory);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">Loading information...</p>
      </div>
    );
  }

  // Graceful fallback for non-existent pages
  if (!page && !isFaqPage) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-500 text-sm mb-6">
          The requested page could not be found or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 text-xs text-rose-200/80 mb-3">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-rose-100 font-medium">
              {isFaqPage ? 'Help Center' : 'Legal & Policies'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight text-white mb-3">
            {isFaqPage ? 'Frequently Asked Questions' : page?.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            {isFaqPage
              ? 'Find answers regarding orders, international shipping, custom stitching, and return processes.'
              : page?.metaDescription || 'Transparent and customer-first shopping guidelines.'}
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-10">
          
          {/* Static CMS Page Content */}
          {page && (
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base mb-10">
              <div
                className="whitespace-pre-line space-y-4"
                dangerouslySetInnerHTML={{ __html: page.content.replace(/\n/g, '<br />') }}
              />
            </div>
          )}

          {/* Interactive FAQ Section */}
          {isFaqPage && (
            <div>
              {/* Category Filter Pills */}
              {faqCategories.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
                  {faqCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedFaqCategory(cat)}
                      className={`text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition cursor-pointer ${
                        selectedFaqCategory === cat
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Accordion Questions */}
              {filteredFaqs.length > 0 ? (
                <div className="space-y-3">
                  {filteredFaqs.map((faq) => {
                    const isOpen = !!openFaq[faq.id || faq.question];

                    return (
                      <div
                        key={faq.id || faq.question}
                        className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-slate-300"
                      >
                        <button
                          onClick={() => toggleFaq(faq.id || faq.question)}
                          className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white hover:bg-slate-50 transition cursor-pointer"
                        >
                          <span className="font-semibold text-slate-900 text-sm sm:text-base pr-4">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180 text-rose-600' : ''
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50 pt-4 leading-relaxed whitespace-pre-line">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  <HelpCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  No FAQs available in this category.
                </div>
              )}
            </div>
          )}

          {/* Need More Help WhatsApp Banner */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-600" />
                Still have questions or need sizing assistance?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Our Surat ethnic fashion stylists are available on WhatsApp for instant video consultation and sizing guidance.
              </p>
            </div>
            <button
              onClick={() => openWhatsAppSupport('Hello VELORA! 👋 I have a question regarding store policies / products.')}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-full transition shadow-md shadow-emerald-600/20 shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Talk to Stylist</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
