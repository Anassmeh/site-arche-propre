import { Link } from 'react-router-dom';
import { Category } from '@/types';
import { Card, CardContent } from '@/components/ui/card';


interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/products?category=${category.id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-soft hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden">
          <img
            // src={category.image}
            src={`${import.meta.env.VITE_API_URL}/api${category.photo}`}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2 text-center">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-muted-foreground text-center">{category.description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
