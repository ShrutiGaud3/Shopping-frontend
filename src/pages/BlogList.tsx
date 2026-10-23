import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../services/blogService';
import { useSettings } from '../context/SettingsContext';
import type { BlogPostItem } from '../types';
import {
  BookOpen,
  Clock,
  Search,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Calendar,
  Loader2
} from 'lucide-react';

export const BlogList: React.FC = () => {
  const { openWhatsAppSupport } = useSettings();
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await blogService.getBlogs({
        tag: selectedTag === 'All' ? undefined : selectedTag,
        search: searchTerm.trim() || undefined
      });

      if (res && res.success) {
        setBlogs(res.data);
        if (res.tags && res.tags.length > 0) {
          setTags(['All', ...res.tags]);
        }
      }
    } catch (err) {
      console.error('Failed to load blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [selectedTag]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlogs();
  };

  const featuredPost = blogs.length > 0 ? blogs[0] : null;
  const regularPosts = blogs.length > 1 ? blogs.slice(1) : [];

  return (
    <div className="bg-slate-50/50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Editorial &amp; Style Stories</span>
        </nav>

        {/* Hero Magazine Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/70 text-purple-800 text-[11px] font-bold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Handloom Heritage &amp; Couture
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Weavera Style Stories
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
            Curated style guides, master weaver craft diaries, and festive ethnic runway inspirations.
          </p>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tag Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {(tags.length > 0 ? tags : ['All', 'Heritage Silk', 'Saree Guide', 'Bridal Lehenga', 'Festive Styling']).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedTag === t
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search guides, fabrics, trends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 bg-gray-50/50"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </form>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-900 mx-auto mb-3" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Loading Stories...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center my-6">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">No articles found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              We couldn't find any articles matching your search or tag. Try exploring another category or check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured Article Hero Card */}
            {featuredPost && (
              <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-gray-100">
                    <img
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-xs text-gray-900 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                        Featured Story
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                        <span className="text-purple-700 font-semibold">{featuredPost.category}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{featuredPost.readTime}</span>
                        </div>
                      </div>

                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 leading-snug group-hover:text-purple-700 transition-colors">
                        <Link to={`/blog/${featuredPost.slug}`}>
                          {featuredPost.title}
                        </Link>
                      </h2>

                      <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>

                      {featuredPost.tags && featuredPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {featuredPost.tags.slice(0, 4).map((tag, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={featuredPost.author?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
                          alt={featuredPost.author?.name}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        />
                        <div className="text-left">
                          <span className="block font-semibold text-gray-900 text-xs">
                            {featuredPost.author?.name}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {featuredPost.author?.role || 'Style Curator'}
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 group-hover:translate-x-1 transition-transform"
                      >
                        Read Article <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Regular Articles Grid */}
            {regularPosts.length > 0 && (
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  Latest Articles &amp; Styling Guides
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {regularPosts.map((post) => (
                    <article
                      key={post._id || post.id || post.slug}
                      className="bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-purple-200 transition-all flex flex-col group"
                    >
                      <Link to={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-gray-100 block">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-gray-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          {post.category}
                        </span>
                      </Link>

                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-2">
                            <Clock className="w-3 h-3" />
                            <span>{post.readTime}</span>
                            <span>•</span>
                            <Calendar className="w-3 h-3" />
                            <span>
                              {post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                                : 'Recent'}
                            </span>
                          </div>

                          <h4 className="font-serif font-bold text-base sm:text-lg text-gray-900 leading-snug group-hover:text-purple-700 transition-colors line-clamp-2">
                            <Link to={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h4>

                          <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-gray-700">
                            By {post.author?.name || 'Weavera Style Team'}
                          </span>

                          <Link
                            to={`/blog/${post.slug}`}
                            className="text-xs font-bold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
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
        )}

        {/* WhatsApp Personal Stylist Banner */}
        <div className="mt-14 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg relative overflow-hidden text-left">
          <div className="relative z-10 max-w-2xl">
            <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3 border border-emerald-400/30">
              Personal Fashion Advisory
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Need personalized sizing or bridal fabric advice?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mb-6">
              Connect directly with our master weavers and fashion stylists on WhatsApp for instant video consultation, loom swatches, and custom stitching queries.
            </p>
            <button
              onClick={() => openWhatsAppSupport('Hello Weavera Stylist Team! 👋 I am reading your style stories and would love guidance on choosing the right ethnic fabric and fit.')}
              className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-lg transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-950 text-emerald-400" />
              Chat with a Weavera Stylist on WhatsApp
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
