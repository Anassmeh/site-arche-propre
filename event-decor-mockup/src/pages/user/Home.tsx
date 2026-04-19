import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import CategoryCard from '@/components/CategoryCard';
import heroImage from '@/assets/hero-image.jpg';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  // const { categories } = useData();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
      fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
        .then((res) => res.json())
        .then((data) => setCategories(data));
    }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Décoration élégante"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/50 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Sublimez votre événement avec nos décorations élégantes et personnalisables
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Créez des moments inoubliables avec nos prestations haut de gamme
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white text-lg px-8 py-6"
            >
              <Link to="/quote">
                Demander un devis
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Nos Catégories de Services</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez notre sélection de décorations pour tous types d'événements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à créer votre événement de rêve ?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Contactez-nous dès maintenant pour discuter de votre projet et obtenir un devis personnalisé
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Link to="/quote">Demander un devis gratuit</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
