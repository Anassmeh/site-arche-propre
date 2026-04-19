<?php

namespace App\Controller\Api;

use App\Entity\Temoignage;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/temoignages', name: 'api_temoignages_')]
class TemoignageController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $temoignages = $em->getRepository(Temoignage::class)->findBy([], ['createdAt' => 'DESC']);

        $data = array_map(function (Temoignage $t) {
            return [
                "id" => $t->getId(),
                "nom" => $t->getNom(),
                "contenu" => $t->getContenu(),
                "note" => $t->getNote(),
                "date" => $t->getCreatedAt()->format("Y-m-d"),
            ];
        }, $temoignages);

        return new JsonResponse($data);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return new JsonResponse(["error" => "JSON invalide"], 400);
        }

        $temoignage = new Temoignage();
        $temoignage->setNom($data["name"]);
        $temoignage->setContenu($data["comment"]);
        $temoignage->setNote($data["rating"]);
        $temoignage->setCreatedAt(new \DateTime());

        $em->persist($temoignage);
        $em->flush();

        return new JsonResponse(["message" => "Témoignage ajouté"], 201);
    }
}
