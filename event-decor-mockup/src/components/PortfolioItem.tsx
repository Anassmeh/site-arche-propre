import { PortfolioItem as PortfolioItemType } from '@/types';
import { Card } from '@/components/ui/card';

interface PortfolioItemProps {
  item: PortfolioItemType;
}

const PortfolioItem = ({ item }: PortfolioItemProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-soft hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={`${import.meta.env.VITE_API_URL}/api${item.photo}`}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <div className="text-white">
            <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
            {item.category && (
              <p className="text-sm opacity-90">{item.category}</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PortfolioItem;
