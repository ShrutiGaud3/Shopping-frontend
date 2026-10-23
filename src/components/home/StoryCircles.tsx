import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../types';

export const StoryCircles: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        setLoading(true);
        const res = await categoryService.getCategoryTree();
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setCategories(res.data.filter((c) => c.showInMenu !== false));
        }
      } catch (err) {
        console.warn('Could not load categories for StoryCircles:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const defaultStories = [
    {
      name: 'Sarees',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
      slug: 'sarees'
    },
    {
      name: 'Salwar Suits',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=400&q=80',
      slug: 'salwar-suits'
    },
    {
      name: 'Lehengas',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
      slug: 'lehengas'
    }
  ];

  if (loading) {
    return (
      <section className="bg-white py-6 border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-5 sm:gap-8 overflow-x-auto pb-2 scrollbar-none justify-center animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-slate-200" />
                <div className="h-3 w-14 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const rawItems = categories.length > 0 ? categories : (defaultStories as any[]);

  const getRank = (name: string, slug?: string) => {
    const text = `${name || ''} ${slug || ''}`.toLowerCase();
    if (text.includes('saree')) return 1;
    if (text.includes('suit') || text.includes('salwar')) return 2;
    if (text.includes('lehenga')) return 3;
    return 10;
  };

  const items = [...rawItems].sort((a, b) => {
    const rA = getRank(a.name, a.slug);
    const rB = getRank(b.name, b.slug);
    if (rA !== rB) return rA - rB;
    return (a.order || 0) - (b.order || 0);
  });

  return (
    <section className="bg-white py-6 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5 sm:gap-8 overflow-x-auto pb-2 scrollbar-none justify-center">
          {items.map((cat, idx) => (
            <Link
              key={cat.id || cat.slug || idx}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center gap-2 group shrink-0"
            >
              {/* Circular Gradient Story Ring */}
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-rose-600 group-hover:scale-108 transition-transform duration-300 shadow-md">
                <div className="p-0.5 rounded-full bg-white">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>

              {/* Category Name Label */}
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 tracking-wide uppercase group-hover:text-rose-600 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
