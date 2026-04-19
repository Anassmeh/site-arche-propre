import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// ---------------- TYPES ----------------

type PortfolioItem = {
  id: number;
  title: string;
  description?: string;
  typeEvenement?: string;
  dateRealisation?: string;
  photo: string;
};

// ---------------- SCHEMA ZOD ----------------

const portfolioSchema = z.object({
  title: z.string().min(2, "Le titre est obligatoire"),
  description: z.string().optional(),
  typeEvenement: z.string().optional(),
  dateRealisation: z.string().optional(),
  photo: z.any(),
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

// ---------------- COMPONENT ----------------

const AdminPortfolio = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>([]);

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: "",
      description: "",
      typeEvenement: "",
      dateRealisation: "",
      photo: null,
    },
  });

  // Charger les éléments existants
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/portfolio`)
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  // ---------------- SUPPRESSION ----------------

  const deleteItem = async (id: number) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet élément ?");
    if (!confirmDelete) return;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/portfolio/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!res.ok) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'élément.",
        variant: "destructive",
      });
      return;
    }

    // Mise à jour immédiate de l'UI
    setItems((prev) => prev.filter((i) => i.id !== id));

    toast({
      title: "Supprimé",
      description: "L'élément a bien été supprimé.",
    });
  };

  // ---------------- AJOUT ----------------

  const onSubmit = async (data: PortfolioFormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("typeEvenement", data.typeEvenement || "");
    formData.append("dateRealisation", data.dateRealisation || "");

    if (data.photo instanceof FileList && data.photo.length > 0) {
      formData.append("photo", data.photo[0]);
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/portfolio/create`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!res.ok) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'élément.",
        variant: "destructive",
      });
      return;
    }

    // Recharge la liste
    fetch(`${import.meta.env.VITE_API_URL}/api/portfolio`)
      .then((r) => r.json())
      .then((data) => setItems(data));

    toast({
      title: "Ajouté",
      description: "L'élément a bien été ajouté.",
    });

    form.reset();
  };

  // ---------------- RENDER ----------------

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gestion du portfolio</h1>

        {/* FORMULAIRE D'AJOUT */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ajouter une réalisation</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex : Arche anniversaire rose" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Détail de la réalisation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="typeEvenement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type d'événement</FormLabel>
                      <FormControl>
                        <Input placeholder="Mariage, Anniversaire..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateRealisation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de réalisation</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Ajouter au portfolio
                </Button>

              </form>
            </Form>
          </CardContent>
        </Card>

        {/* LISTE DES ELEMENTS */}
        <Card>
          <CardHeader>
            <CardTitle>Réalisation existantes ({items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {items.map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/api${item.photo}`}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                  />

                  <div className="p-3">
                    <p className="font-semibold">{item.title}</p>

                    {item.typeEvenement && (
                      <p className="text-xs text-muted-foreground">{item.typeEvenement}</p>
                    )}

                    {item.dateRealisation && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.dateRealisation}
                      </p>
                    )}

                    <button
                      onClick={() => deleteItem(item.id)}
                      className="mt-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AdminPortfolio;
