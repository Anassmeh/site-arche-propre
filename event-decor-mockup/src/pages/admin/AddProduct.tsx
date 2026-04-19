import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const productSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  price: z.string().min(1),
  categoryId: z.string().min(1),
  image: z.any()
});

type ProductFormValues = z.infer<typeof productSchema>;

const AddProduct = () => {
  const { toast } = useToast();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      categoryId: "",
      image: null,
    },
  });

  // 🔹 Charger catégories + produits
  const loadProducts = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data));

    loadProducts();
  }, []);

  // 🔥 SUPPRESSION PRODUIT
  const deleteProduct = async (id: number) => {
    if (!confirm("Supprimer ce produit ?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de supprimer ce produit.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Supprimé ✔",
        description: "Le produit a été supprimé.",
      });

      loadProducts();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur réseau.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("categoryId", data.categoryId);

      if (data.image instanceof FileList && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/create`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });

      if (!response.ok) throw new Error("Erreur API");

      toast({
        title: "Produit ajouté !",
        description: `${data.title} a été ajouté.`,
      });

      form.reset();
      loadProducts();

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d’ajouter.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ajouter un produit</CardTitle>
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
                      <FormControl><Input {...field} /></FormControl>
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
                      <FormControl><Textarea {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix (€)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">Ajouter</Button>

              </form>
            </Form>

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits existants ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-3 bg-muted rounded-lg">

                <div className="flex items-center gap-3">
                  <img src={`${import.meta.env.VITE_API_URL}/api${p.image}`} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm text-muted-foreground">{p.price}€</p>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteProduct(p.id)}
                >
                  Supprimer
                </Button>

              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AddProduct;
