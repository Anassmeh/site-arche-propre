import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Logo from "@/assets/logoSiteArche.png";


const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  const userLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/services', label: 'Nos prestations' },
    { to: '/products', label: 'Produits' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/quote', label: 'Devis' },
    { to: '/testimonials', label: 'Témoignages' },
  ];

  const adminLinks = [
    { to: '/admin/categories', label: 'Catégories' },
    { to: '/admin/products', label: 'Produits' },
    { to: '/admin/orders', label: 'Commandes' },
    { to: '/admin/portfolio', label: 'Portfolio' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to={isAdmin ? '/admin/categories' : '/'} className="flex items-center space-x-2">
            {/* <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {isAdmin ? 'Admin Panel' : 'Élégance Événements'}
            </h1> */}
            <img
  src={isAdmin ? Logo : Logo}
  alt="Logo"
  className="h-20 w-auto object-contain"
/>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.to ? 'text-primary' : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!isAdmin && (
              <Button asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                <Link to="/quote">Réserver ma décoration</Link>
              </Button>
            )}
            {/* {!isAdmin && (
              <Button asChild variant="outline">
                <Link to="/admin/categories">Admin</Link>
              </Button>
            )} */}
            {isAdmin && (
              <Button asChild variant="outline">
                <Link to="/">Retour au site</Link>
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col space-y-3">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.to ? 'text-primary' : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!isAdmin && (
              <Button asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90 w-full">
                <Link to="/quote" onClick={() => setMobileMenuOpen(false)}>
                  Demander un devis
                </Link>
              </Button>
            )}
            {/* {!isAdmin && (
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/categories" onClick={() => setMobileMenuOpen(false)}>
                  Admin
                </Link>
              </Button>
            )} */}
            {isAdmin && (
              <Button asChild variant="outline" className="w-full">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  Retour au site
                </Link>
              </Button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
