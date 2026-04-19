import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categorySchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  image: z.any(),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const { toast } = useToast();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: "",
      description: "",
    },
  });

  const loadCategories = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("image", data.image);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/categories/create`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur API");
      }

      toast({
        title: "Catégorie ajoutée !",
        description: `${data.name} a été ajoutée avec succès.`,
      });

      form.reset();
      loadCategories();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };


    const deleteCategory = async (id) => {
    if (!confirm("Supprimer cette catégorie ?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/categories/delete/${id}`, {
        method: "DELETE",
          headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
      }
      });

      if (!response.ok) {
        const errorData = await response.json();

        toast({
          title: "Erreur",
          description: errorData.error || "La suppression a échoué.",
          variant: "destructive",
        });

        return;
      }

      toast({
        title: "Supprimée ✔",
        description: "La catégorie a été supprimée.",
      });

      setCategories(categories.filter((c) => c.id !== id));

    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de contacter le serveur.",
        variant: "destructive",
      });
    }
  };



  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gestion des Catégories</h1>

        {/* Formulaire */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ajouter une nouvelle catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la catégorie</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Arches de ballons" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            form.setValue("image", e.target.files?.[0])
                          }
                        />
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
                      <FormLabel>Description (optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Description courte" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Ajouter la catégorie
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Liste des catégories */}
        <Card>
          <CardHeader>
            <CardTitle>Catégories existantes ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/api${cat.photo}`}
                      alt={cat.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{cat.name}</p>
                      {cat.description && (
                        <p className="text-sm text-muted-foreground">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    onClick={() => deleteCategory(cat.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddCategory;
