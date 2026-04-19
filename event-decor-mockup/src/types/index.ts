export interface Category {
  id: string;
  name: string;
  photo: string;
  description?: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price?: number;
  categoryId: string;
  image: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  photo: string;
  category?: string;
}

export interface Testimonial {
  id: string;
  nom: string;
  note: number;
  contenu: string;
  date: string;
}

export interface QuoteRequest {
  id: string;
  eventType: string;
  date: string;
  location: string;
  selectedCategories: string[];
  selectedProducts: string[];
  budget: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  contactPreference: 'email' | 'phone' | 'sms';
  createdAt: string;
}

export type EventType = 
  | 'Mariage'
  | 'Anniversaire'
  | 'Baptême'
  | 'Entreprise'
  | 'Baby Shower'
  | 'Autre';
