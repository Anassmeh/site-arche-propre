import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category, Product, PortfolioItem, Testimonial, QuoteRequest } from '@/types';
import { categories as initialCategories, products as initialProducts, portfolioItems as initialPortfolio, testimonials as initialTestimonials } from '@/data/mockData';

interface DataContextType {
  categories: Category[];
  products: Product[];
  portfolioItems: PortfolioItem[];
  testimonials: Testimonial[];
  quoteRequests: QuoteRequest[];
  addCategory: (category: Category) => void;
  addProduct: (product: Product) => void;
  addTestimonial: (testimonial: Testimonial) => void;
  addQuoteRequest: (request: QuoteRequest) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [portfolioItems] = useState<PortfolioItem[]>(initialPortfolio);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);

  const addCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const addTestimonial = (testimonial: Testimonial) => {
    setTestimonials(prev => [testimonial, ...prev]);
  };

  const addQuoteRequest = (request: QuoteRequest) => {
    setQuoteRequests(prev => [request, ...prev]);
  };

  return (
    <DataContext.Provider
      value={{
        categories,
        products,
        portfolioItems,
        testimonials,
        quoteRequests,
        addCategory,
        addProduct,
        addTestimonial,
        addQuoteRequest
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
