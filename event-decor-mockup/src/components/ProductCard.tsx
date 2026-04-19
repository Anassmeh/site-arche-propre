import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-soft hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={`${import.meta.env.VITE_API_URL}/api${product.image}`}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
          {product.price}€
        </Badge> */}
      </div>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
