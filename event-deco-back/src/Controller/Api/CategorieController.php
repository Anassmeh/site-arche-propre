<?php

namespace App\Controller\Api;

use App\Entity\Categorie;
use App\Repository\CategorieRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_categories_')]
final class CategorieController extends AbstractController
{
    #[Route('/categories', name: 'list', methods: ['GET'])]
    public function list(CategorieRepository $repo): JsonResponse
    {
        $categories = $repo->findAll();

        $data = array_map(function (Categorie $cat) {
            return [
                'id'    => $cat->getId(),
                'name'  => $cat->getNom(),
                'photo' => $cat->getPhoto() ? '/uploads/categories/'.$cat->getPhoto() : null,
            ];
        }, $categories);

        return new JsonResponse($data, 200);
    }

    #[Route('/admin/categories/create', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $name = $request->request->get('name');
        $description = $request->request->get('description');

        $existing = $em->getRepository(Categorie::class)->findOneBy(['nom' => $name]);
        if ($existing) {
            return new JsonResponse([
                'error' => 'Une catégorie avec ce nom existe déjà'
            ], 400);
        }

        /** @var UploadedFile|null $file */
        $file = $request->files->get('image');

        if (!$name) {
            return new JsonResponse(['error' => 'Le champ "name" est obligatoire'], 400);
        }

        $fileName = null;

        if ($file) {
            $uploadsDir = $this->getParameter('kernel.project_dir') . '/public/uploads/categories';

            if (!is_dir($uploadsDir)) {
                mkdir($uploadsDir, 0777, true);
            }

            $fileName = uniqid() . '.' . $file->guessExtension();
            $file->move($uploadsDir, $fileName);
        }

        $categorie = new Categorie();
        $categorie->setNom($name);
        $categorie->setPhoto($fileName);

        $em->persist($categorie);
        $em->flush();

        return new JsonResponse(['message' => 'Catégorie créée avec succès'], 201);
    }
    #[Route('/admin/categories/delete/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        $category = $em->getRepository(Categorie::class)->find($id);

        if (!$category) {
            return new JsonResponse(["error" => "Catégorie introuvable"], 404);
        }

        // Vérifier si des produits utilisent cette catégorie
        $products = $em->getRepository(\App\Entity\Produit::class)
                    ->findBy(['categorie' => $category]);

        if (count($products) > 0) {
            return new JsonResponse([
                "error" => "Impossible de supprimer : des produits sont encore liés à cette catégorie."
            ], 400);
        }

        // Supprimer l'image associée
        if ($category->getPhoto()) {
            $path = $this->getParameter('kernel.project_dir') . '/public/uploads/categories/' . $category->getPhoto();
            if (file_exists($path)) {
                unlink($path);
            }
        }

        // Supprimer la catégorie
        $em->remove($category);
        $em->flush();

        return new JsonResponse(["message" => "Catégorie supprimée"]);
    }
}