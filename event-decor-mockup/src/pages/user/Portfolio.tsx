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
        <h1 className="text-4xl font-bold mb-4">Notre Portfolio</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Découvrez nos plus belles réalisations et laissez-vous inspirer pour votre prochain événement
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
