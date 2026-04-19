import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Élégance Événements</h3>
            <p className="text-sm text-muted-foreground">
              Location de décorations élégantes pour tous vos événements spéciaux.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition">Accueil</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-primary transition">Nos prestations</Link></li>
              <li><Link to="/products" className="text-muted-foreground hover:text-primary transition">Produits</Link></li>
              <li><Link to="/portfolio" className="text-muted-foreground hover:text-primary transition">Portfolio</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/quote" className="text-muted-foreground hover:text-primary transition">Demander un devis</Link></li>
              <li><Link to="/testimonials" className="text-muted-foreground hover:text-primary transition">Témoignages</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {/* <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>06 12 34 56 78</span>
              </li> */}
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>ArcheCo2025@outlook.fr</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="https://www.facebook.com/profile.php?id=61583398607996" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/archecompagnie/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
