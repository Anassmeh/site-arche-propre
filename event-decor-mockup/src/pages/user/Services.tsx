import { useEffect, useState } from "react";
import CategoryCard from "@/components/CategoryCard";

const Services = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("https://archedeco.com/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Erreur lors du fetch :", error));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Matériel de décoration événementielle</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Découvrez notre sélection de matériel de décoration événementielle à louer pour mariages, anniversaires, baptêmes et autres événements privés
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Services;
