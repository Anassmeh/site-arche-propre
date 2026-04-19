import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const eventTypes = [
  "Mariage",
  "Anniversaire",
  "Baptême",
  "Entreprise",
  "Baby Shower",
  "Autre",
];

const quoteSchema = z.object({
  eventType: z.string().min(1),
  date: z.string().min(1),
  location: z.string().min(1),
  budget: z.string().min(1),

  wantedProducts: z
    .string()
    .min(3, "Veuillez décrire les produits souhaités"),

  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  contactPreference: z.enum(["email", "phone", "sms"]),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

const Quote = () => {
  const { toast } = useToast();

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      eventType: "",
      date: "",
      location: "",
      budget: "",
      wantedProducts: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      contactPreference: "email",
    },
  });

  const onSubmit = async (data: QuoteFormValues) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/devis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erreur API");

      toast({
        title: "Demande envoyée ✔",
        description: "Nous vous contacterons très prochainement.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erreur ❌",
        description: "Impossible d'envoyer la demande.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Demander un Devis</h1>
        <p className="text-muted-foreground text-lg">
          Remplissez ce formulaire et nous vous recontacterons rapidement
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Informations événement */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              Informations sur l'événement
            </h2>

            {/* Type */}
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'événement</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de l'événement</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lieu */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lieu</FormLabel>
                  <FormControl>
                    <Input placeholder="Ville ou adresse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Produits souhaités */}
            <FormField
              control={form.control}
              name="wantedProducts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produits souhaités</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex : Arche de ballons, support à fleurs, rideau lumineux..."
                      className="min-h-28"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Budget */}
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget estimé</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 500€ - 1000€" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Coordonnées */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Vos coordonnées</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Préférence de contact</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Téléphone</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            Envoyer ma demande
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Quote;
