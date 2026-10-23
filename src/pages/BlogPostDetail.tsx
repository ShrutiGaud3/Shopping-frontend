import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService } from '../services/blogService';
import { useSettings } from '../context/SettingsContext';
import { openWhatsApp } from '../utils/whatsapp';
import type { BlogPostItem } from '../types';
import {
  Clock,
  Calendar,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  Check,
  Sparkles,
  BookOpen,
  Loader2,
  Copy
} from 'lucide-react';

export const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { openWhatsAppSupport } = useSettings();

  const [post, setPost] = useState<BlogPostItem | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        const res = await blogService.getBlogBySlug(slug);
        if (res && res.success && res.data) {
          setPost(res.data);
          setRelatedPosts(res.relatedPosts || []);
        } else {
          setPost(null);
        }
      } catch (err) {
        console.error('Failed to load blog detail:', err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!post) return;
    const text = `Read this ethnic style story on Weavera: *${post.title}* - ${window.location.href}`;
    openWhatsApp(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-gray-900" />
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Loading Article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <BookOpen className="w-12 h-12 text-gray-300 mb-3" />
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
        <p className="text-sm text-gray-500 mb-6 max-w-md">
          The editorial article you are looking for does not exist or may have been unpublished.
        </p>
        <Link
          to="/blog"
          className="bg-gray-900 text-white text-xs font-bold px-6 py-3 uppercase tracking-wider rounded-sm hover:bg-black transition-colors"
        >
          Return to Style Stories
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-6 sm:py-10 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-black">Style Stories</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold truncate max-w-[240px] sm:max-w-none">{post.title}</span>
        </nav>

        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to all articles
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              {post.category}
            </span>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {post.readTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })
                  : 'Recent'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {post.views || 1} views
              </span>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-600 font-serif italic mt-4 leading-relaxed border-l-2 border-purple-500 pl-4 py-1">
            "{post.excerpt}"
          </p>

          {/* Author Card & Share Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <img
                src={post.author?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
                alt={post.author?.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-purple-200"
              />
              <div>
                <span className="block font-bold text-gray-900 text-sm">
                  {post.author?.name || 'SuratiKart Style Team'}
                </span>
                <span className="text-xs text-gray-500">
                  {post.author?.role || 'Senior Fashion & Handloom Curator'}
                </span>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Share via WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> Share on WhatsApp
              </button>

              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy article link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                {copied ? 'Link Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md mb-10 bg-gray-100 border border-gray-100">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="prose prose-slate prose-lg max-w-none space-y-6 text-gray-800 text-sm sm:text-base leading-relaxed">
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="space-y-4 [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-3 [&>h3]:font-serif [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:leading-relaxed [&>p]:text-gray-700 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>blockquote]:border-l-4 [&>blockquote]:border-purple-600 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-900 [&>blockquote]:bg-purple-50/50 [&>blockquote]:py-2 [&>blockquote]:rounded-r-sm"
          />
        </div>

        {/* Tags Footnote */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Related Topics &amp; Weaves
            </span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, i) => (
                <Link
                  key={i}
                  to={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900 text-xs font-medium px-3 py-1 rounded-md transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* WhatsApp Personal Stylist Card */}
        <div className="mt-10 bg-gradient-to-r from-emerald-50 via-teal-50 to-purple-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Inspired by this craft?
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
              Speak with a Surat Ethnic Stylist
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-lg">
              Have questions about fabric weight, blouse unstitched allowance, or matching jewelry? Our in-house stylists are available on WhatsApp for complimentary video styling.
            </p>
          </div>

          <button
            onClick={() => openWhatsAppSupport(`Hello Weavera! 👋 I am reading your article '${post.title}' and would like styling recommendations or loom details.`)}
            className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            Enquire on WhatsApp
          </button>
        </div>

        {/* Related Posts Row */}
        {relatedPosts.length > 0 && (
          <div className="mt-14 pt-10 border-t border-gray-200">
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">
              You May Also Like
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <article
                  key={rel._id || rel.id || rel.slug}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col"
                >
                  <Link to={`/blog/${rel.slug}`} className="aspect-[16/10] overflow-hidden bg-gray-100 block">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
                        {rel.category}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-gray-900 leading-snug group-hover:text-purple-700 transition-colors line-clamp-2">
                        <Link to={`/blog/${rel.slug}`}>
                          {rel.title}
                        </Link>
                      </h4>
                    </div>
                    <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                      <span>{rel.readTime}</span>
                      <Link
                        to={`/blog/${rel.slug}`}
                        className="text-purple-700 font-bold inline-flex items-center gap-0.5"
                      >
                        Read <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
