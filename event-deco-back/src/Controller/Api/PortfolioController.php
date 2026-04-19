<?php

namespace App\Controller\Api;

use App\Entity\Portfolio;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'api_portfolio_')]
class PortfolioController extends AbstractController
{
    #[Route('/portfolio', name: 'list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $items = $em->getRepository(Portfolio::class)->findBy([], ['dateRealisation' => 'DESC']);

        $data = array_map(function (Portfolio $p) {
            return [
                'id'             => $p->getId(),
                'title'          => $p->getTitre(),
                'description'    => $p->getDescription(),
                'photo'          => '/uploads/portfolio/' . $p->getPhoto(),
                'dateRealisation'=> $p->getDateRealisation()?->format('Y-m-d'),
                'typeEvenement'  => $p->getTypeEvenement(),
            ];
        }, $items);

        return new JsonResponse($data);
    }

    #[Route('/admin/portfolio/create', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $title         = $request->request->get('title');
        $description   = $request->request->get('description');
        $typeEvenement = $request->request->get('typeEvenement');
        $dateStr       = $request->request->get('dateRealisation');

        /** @var \Symfony\Component\HttpFoundation\File\UploadedFile|null $file */
        $file = $request->files->get('photo');

        if (!$file) {
            return new JsonResponse(['error' => 'Photo obligatoire'], 400);
        }

        $uploadsDir = $this->getParameter('kernel.project_dir') . '/public/uploads/portfolio';

        if (!is_dir($uploadsDir)) {
            mkdir($uploadsDir, 0777, true);
        }

        $extension = $file->getClientOriginalExtension();
        $fileName  = uniqid() . '.' . $extension;
        $file->move($uploadsDir, $fileName);

        $portfolio = new Portfolio();
        $portfolio->setTitre($title);
        $portfolio->setDescription($description);
        $portfolio->setTypeEvenement($typeEvenement);
        $portfolio->setPhoto($fileName);

        if ($dateStr) {
            $portfolio->setDateRealisation(new \DateTime($dateStr));
        } else {
            $portfolio->setDateRealisation(new \DateTime());
        }

        $em->persist($portfolio);
        $em->flush();

        return new JsonResponse(['message' => 'Portfolio ajouté'], 201);
    }
    #[Route('/admin/portfolio/delete/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        // dd("test");
        $item = $em->getRepository(Portfolio::class)->find($id);

        if (!$item) {
            return new JsonResponse(['error' => 'Portfolio introuvable'], 404);
        }

        // Supprimer aussi la photo du serveur
        $filePath = $this->getParameter('kernel.project_dir') . '/public/uploads/portfolio/' . $item->getPhoto();
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $em->remove($item);
        $em->flush();

        return new JsonResponse(['message' => 'Portfolio supprimé'], 200);
    }
}