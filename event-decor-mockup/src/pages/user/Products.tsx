import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Charger les catégories + produits depuis l’API Symfony
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data));

    fetch("https://archedeco.com/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // Récupérer la catégorie depuis les paramètres d’URL
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Filtrage selon la catégorie sélectionnée
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => String(p.category) === String(selectedCategory));

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);

    if (value === "all") setSearchParams({});
    else setSearchParams({ category: value });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Nos Produits</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Découvrez tous nos produits disponibles à la location
        </p>

        <div className="max-w-xs">
          <label className="block text-sm font-medium mb-2">
            Filtrer par catégorie
          </label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>

              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Liste des produits */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Aucun produit trouvé pour cette catégorie.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
