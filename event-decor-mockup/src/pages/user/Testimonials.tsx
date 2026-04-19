import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import TestimonialCard from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Star } from "lucide-react";

const testimonialSchema = z.object({
  name: z.string().min(2),
  comment: z.string().min(10),
});

const Testimonials = () => {
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [testimonials, setTestimonials] = useState([]);

  const form = useForm({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      comment: "",
    },
  });

  // Charger les témoignages dès le chargement de la page
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/temoignages`)
      .then((res) => res.json())
      .then((data) => setTestimonials(data));
  }, []);

  const onSubmit = async (data) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/temoignages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        comment: data.comment,
        rating: rating,
      }),
    });

    if (!response.ok) {
      toast({ title: "Erreur", variant: "destructive" });
      return;
    }

    toast({ title: "Merci pour votre témoignage !" });

    form.reset();
    setRating(5);

    // Rechargement des témoignages
    fetch(`${import.meta.env.VITE_API_URL}/api/temoignages`)
      .then((res) => res.json())
      .then((data) => setTestimonials(data));
  };

  return (
    <div className="container mx-auto px-4 py-12">

      <div className="max-w-2xl mx-auto bg-card border rounded-lg p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Note */}
            <div>
              <FormLabel>Note</FormLabel>
              <div className="flex gap-2 mt-2">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)}>
                    <Star size={28} className={n <= rating ? "fill-accent text-accent" : "text-muted"} />
                  </button>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre témoignage</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Publier mon témoignage
            </Button>
          </form>
        </Form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </div>
      
    </div>
  );
};

export default Testimonials;
