import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/devis`)
      .then((res) => res.json())
      .then((data) => {
        // Trier les plus récents en premiers
        const sorted = data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setOrders(sorted);
      })
      .catch((err) => console.error("Erreur chargement devis:", err));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 🔥 Marquer une commande comme traitée
  const markAsProcessed = async (id) => {
    const response = await fetch(`https://archedeco.com/api/admin/devis/${id}/process`, {
      method: "PATCH",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    });

    if (response.ok) {
      loadOrders();
    } else {
      alert("Erreur lors du traitement");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Commandes et Devis</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Aucune demande de devis pour le moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((request) => (
            <Card
              key={request.id}
              className={
                request.processed
                  ? "bg-green-100 border-green-300"
                  : "bg-red-100 border-red-300"
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {request.client.firstName} {request.client.lastName}
                  </CardTitle>

                  <Badge>{request.eventType}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">

                  <div>
                    <h4 className="font-semibold mb-2">Détails de l'événement</h4>
                    <div className="space-y-1 text-muted-foreground">
                      <p><span className="font-medium text-foreground">Date:</span> {new Date(request.date).toLocaleDateString("fr-FR")}</p>
                      <p><span className="font-medium text-foreground">Lieu:</span> {request.location}</p>
                      <p><span className="font-medium text-foreground">Budget:</span> {request.budget} €</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Coordonnées</h4>
                    <div className="space-y-1 text-muted-foreground">
                      <p><span className="font-medium">Email:</span> {request.client.email}</p>
                      <p><span className="font-medium">Téléphone:</span> {request.client.phone}</p>
                      <p><span className="font-medium">Contact préféré:</span> {request.client.contactPreference}</p>
                    </div>
                  </div>

                </div>

                <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
                  <h4 className="font-semibold mb-2">Produits souhaités</h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {request.wantedProducts || "Aucun produit spécifié"}
                  </p>
                </div>

                {/* Bouton traité */}
                {!request.processed && (
                  <Button
                    onClick={() => markAsProcessed(request.id)}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Marquer comme traité
                  </Button>
                )}

                <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                  Devis #{request.id}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
