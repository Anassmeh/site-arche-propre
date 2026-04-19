import { Testimonial } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < testimonial.note ? 'fill-accent text-accent' : 'text-muted'}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground mb-4 italic">
          "{testimonial.contenu}"
        </p>
        <div className="flex items-center justify-between">
          <p className="font-semibold">{testimonial.nom}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(testimonial.date).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
