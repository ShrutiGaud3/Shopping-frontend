import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../types';

export const StoryCircles: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const res = await categoryService.getCategoryTree();
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setCategories(res.data.filter((c) => c.showInMenu !== false));
        }
      } catch (err) {
        console.warn('Could not load categories for StoryCircles:', err);
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
      name: 'Lehengas',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
      slug: 'lehengas'
    },
    {
      name: 'Salwar Suits',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=400&q=80',
      slug: 'salwar-suits'
    },
    {
      name: 'Kurtis',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      slug: 'kurtis'
    },
    {
      name: 'Gowns',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80',
      slug: 'gowns'
    },
    {
      name: 'Occasions',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
      slug: 'occasions'
    }
  ];

  const items = categories.length > 0 ? categories : (defaultStories as any[]);

  return (
    <section className="bg-white py-6 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5 sm:gap-8 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
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
