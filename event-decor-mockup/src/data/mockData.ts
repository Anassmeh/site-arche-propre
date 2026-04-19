import { Category, Product, PortfolioItem, Testimonial } from '@/types';
import balloonArchImg from '@/assets/categories/balloon-arch.jpg';
import flowerArchImg from '@/assets/categories/flower-arch.jpg';
import structuresImg from '@/assets/categories/structures.jpg';
import tableDecorImg from '@/assets/categories/table-decor.jpg';
import eventPackImg from '@/assets/categories/event-pack.jpg';
import wedding1Img from '@/assets/portfolio/wedding-1.jpg';
import birthday1Img from '@/assets/portfolio/birthday-1.jpg';
import corporate1Img from '@/assets/portfolio/corporate-1.jpg';

export const categories: Category[] = [
  {
    id: 'balloon-arch',
    name: 'Arches de ballons',
    image: balloonArchImg,
    description: 'Magnifiques arches de ballons pour sublimer vos événements'
  },
  {
    id: 'flower-arch',
    name: 'Arches de fleurs',
    image: flowerArchImg,
    description: 'Arches florales élégantes pour des moments inoubliables'
  },
  {
    id: 'structures',
    name: 'Supports / structures',
    image: structuresImg,
    description: 'Structures et supports professionnels pour vos décorations'
  },
  {
    id: 'table-decor',
    name: 'Décorations de table',
    image: tableDecorImg,
    description: 'Centres de table et décorations raffinées'
  },
  {
    id: 'event-pack',
    name: 'Pack événement',
    image: eventPackImg,
    description: 'Packs complets pour un événement clé en main'
  }
];

export const products: Product[] = [
  {
    id: 'p1',
    title: 'Arche de ballons rose & or',
    description: 'Arche élégante en ballons pastel rose et dorés, idéale pour mariages et baptêmes',
    price: 250,
    categoryId: 'balloon-arch',
    image: balloonArchImg
  },
  {
    id: 'p2',
    title: 'Arche de ballons arc-en-ciel',
    description: 'Arche colorée et festive pour anniversaires',
    price: 220,
    categoryId: 'balloon-arch',
    image: balloonArchImg
  },
  {
    id: 'p3',
    title: 'Arche florale romantique',
    description: 'Arche de roses et verdure pour cérémonie de mariage',
    price: 450,
    categoryId: 'flower-arch',
    image: flowerArchImg
  },
  {
    id: 'p4',
    title: 'Arche florale champêtre',
    description: 'Mix de fleurs sauvages et feuillages pour un style naturel',
    price: 380,
    categoryId: 'flower-arch',
    image: flowerArchImg
  },
  {
    id: 'p5',
    title: 'Structure hexagonale dorée',
    description: 'Cadre géométrique doré pour fond de scène',
    price: 180,
    categoryId: 'structures',
    image: structuresImg
  },
  {
    id: 'p6',
    title: 'Arche circulaire blanche',
    description: 'Structure ronde minimaliste pour décoration florale',
    price: 150,
    categoryId: 'structures',
    image: structuresImg
  },
  {
    id: 'p7',
    title: 'Centre de table floral doré',
    description: 'Composition florale avec chandelier doré',
    price: 80,
    categoryId: 'table-decor',
    image: tableDecorImg
  },
  {
    id: 'p8',
    title: 'Centre de table bohème',
    description: 'Décoration de table naturelle avec bougies',
    price: 65,
    categoryId: 'table-decor',
    image: tableDecorImg
  },
  {
    id: 'p9',
    title: 'Pack mariage complet',
    description: 'Arche florale + 10 centres de table + déco cérémonie',
    price: 850,
    categoryId: 'event-pack',
    image: eventPackImg
  },
  {
    id: 'p10',
    title: 'Pack anniversaire enfant',
    description: 'Arche de ballons + décoration murale + accessoires',
    price: 350,
    categoryId: 'event-pack',
    image: eventPackImg
  }
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'port1',
    title: 'Mariage Romantique',
    image: wedding1Img,
    category: 'Mariage'
  },
  {
    id: 'port2',
    title: 'Anniversaire Coloré',
    image: birthday1Img,
    category: 'Anniversaire'
  },
  {
    id: 'port3',
    title: 'Événement Corporate',
    image: corporate1Img,
    category: 'Entreprise'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Sophie Martin',
    rating: 5,
    comment: 'Un service exceptionnel ! Les décorations ont transformé notre mariage en un véritable conte de fées. Merci infiniment !',
    date: '2024-10-15'
  },
  {
    id: 't2',
    name: 'Thomas Dubois',
    rating: 5,
    comment: 'Professionnalisme et créativité au rendez-vous. L\'anniversaire de ma fille était magique grâce à vos décorations.',
    date: '2024-09-22'
  },
  {
    id: 't3',
    name: 'Marie Legrand',
    rating: 4,
    comment: 'Très belles prestations, équipe à l\'écoute. Juste un petit délai de livraison mais le résultat était sublime !',
    date: '2024-08-30'
  }
];
