<?php

namespace App\Controller\Api;

use App\Entity\Produit;
use App\Entity\Categorie;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_products_')]
class ProduitController extends AbstractController
{
    /**
     * GET – Liste tous les produits
     */
    #[Route('/products', name: 'list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $products = $em->getRepository(Produit::class)->findAll();

        $result = array_map(function (Produit $p) {
            return [
                'id'          => $p->getId(),
                'title'       => $p->getTitre(),
                'description' => $p->getDescription(),
                'price'       => $p->getPrix(),
                'image'       => '/uploads/products/' . $p->getPhoto(),
                'category'    => $p->getCategorie()->getId(),
            ];
        }, $products);

        return new JsonResponse($result);
    }

    /**
     * POST – Ajout d’un produit (avec upload image)
     */
    #[Route('/admin/products/create', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        try {
            $title       = $request->request->get('title');
            $description = $request->request->get('description');
            $price       = $request->request->get('price');
            $categoryId  = $request->request->get('categoryId');

            if (!$title || !$price || !$categoryId) {
                return new JsonResponse(['error' => 'Champs requis manquants'], 400);
            }

            // Récupération de la catégorie
            $category = $em->getRepository(Categorie::class)->find($categoryId);

            if (!$category) {
                return new JsonResponse(['error' => 'Catégorie introuvable'], 400);
            }

            // Gestion de l'image
            $file = $request->files->get('image');
            $fileName = null;

            if ($file) {
                $uploadsDir = $this->getParameter('kernel.project_dir') . '/public/uploads/products';

                if (!is_dir($uploadsDir)) {
                    mkdir($uploadsDir, 0777, true);
                }

                // On évite guessExtension() → fileinfo non nécessaire
                $extension = $file->getClientOriginalExtension();
                $fileName = uniqid() . '.' . $extension;

                $file->move($uploadsDir, $fileName);
            }

            // Création du produit
            $product = new Produit();
            $product->setTitre($title);
            $product->setDescription($description);
            $product->setPrix($price);
            $product->setPhoto($fileName);
            $product->setCategorie($category);

            $em->persist($product);
            $em->flush();

            return new JsonResponse(['message' => 'Produit créé'], 201);
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => $e->getMessage(),
                'line'  => $e->getLine(),
            ], 500);
        }
    }

    #[Route('/admin/products/delete/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        $product = $em->getRepository(Produit::class)->find($id);

        if (!$product) {
            return new JsonResponse(["error" => "Produit introuvable"], 404);
        }

        // Supprimer l'image
        if ($product->getPhoto()) {
            $path = __DIR__ . '/../../../public' . $product->getPhoto();
            if (file_exists($path)) {
                unlink($path);
            }
        }

        $em->remove($product);
        $em->flush();

        return new JsonResponse(["message" => "Produit supprimé"]);
    }
}