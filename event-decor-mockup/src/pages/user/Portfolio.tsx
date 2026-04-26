import { useEffect, useState } from "react";
import PortfolioItem from "@/components/PortfolioItem";

const Portfolio = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/portfolio`)
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Nos réalisations en décoration événementielle à Paris et en Île-de-France</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Découvrez nos décorations de mariage, anniversaire, baptême et baby shower réalisées à Paris et en Île-de-France. Chaque projet est conçu sur mesure selon les envies de nos clients
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <PortfolioItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
