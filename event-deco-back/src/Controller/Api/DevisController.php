<?php

namespace App\Controller\Api;

use App\Entity\Client;
use App\Entity\Devis;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

#[Route('/api', name: 'api_devis_')]
class DevisController extends AbstractController
{
    /**
     * 🟩 CRÉATION D’UNE DEMANDE DE DEVIS
     */
    #[Route('/devis', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        MailerInterface $mailer
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return new JsonResponse(["error" => "Invalid JSON"], 400);
        }

        // 👤 Création du client
        $client = new Client();
        $client->setNom($data['lastName']);
        $client->setPrenom($data['firstName']);
        $client->setEmail($data['email']);
        $client->setTelephone($data['phone']);
        $client->setPreferenceContact($data['contactPreference']);

        // 📄 Création du devis
        $devis = new Devis();
        $devis->setTypeEvenement($data['eventType']);
        $devis->setLieu($data['location']);
        $devis->setBudget((float) $data['budget']);
        $devis->setDateEvenement(new \DateTime($data['date']));
        $devis->setClient($client);
        $devis->setProduitsSouhaites($data['wantedProducts'] ?? null);
        $devis->setIsProcessed(false);

        // 💾 Sauvegarde BDD
        $em->persist($client);
        $em->persist($devis);
        $em->flush();

        // -------------------------------
        // 📩 ENVOI EMAIL ADMIN (toi)
        // -------------------------------
        $adminEmail = (new Email())
            ->from('archeco2025@outlook.fr')
            ->to('archeco2025@outlook.fr')  // 👉 mets ton email ici
            ->subject('Nouvelle demande de devis')
            ->html("
                <h1>Nouvelle demande de devis</h1>
                <p><strong>Nom :</strong> {$client->getNom()} {$client->getPrenom()}</p>
                <p><strong>Email :</strong> {$client->getEmail()}</p>
                <p><strong>Téléphone :</strong> {$client->getTelephone()}</p>
                <p><strong>Type d'événement :</strong> {$devis->getTypeEvenement()}</p>
                <p><strong>Date :</strong> {$devis->getDateEvenement()->format('Y-m-d')}</p>
                <p><strong>Lieu :</strong> {$devis->getLieu()}</p>
                <p><strong>Budget :</strong> {$devis->getBudget()}</p>
                <p><strong>Produits souhaités :</strong> {$devis->getProduitsSouhaites()}</p>
            ");

        $mailer->send($adminEmail);

        // -------------------------------
        // 📩 ENVOI EMAIL AU CLIENT
        // -------------------------------
        $clientEmail = (new Email())
            ->from('archeco2025@outlook.fr')  // obligatoire avec Mailtrap
            ->to($client->getEmail())
            ->subject('Votre demande de devis a bien été reçue')
            ->html("
                <h2>Bonjour {$client->getPrenom()},</h2>
                <p>Nous avons bien reçu votre demande concernant : <strong>{$devis->getTypeEvenement()}</strong></p>
                <p>Date : {$devis->getDateEvenement()->format('Y-m-d')}</p>
                <p>Nous vous répondrons très prochainement.</p>
                <br>
                <p>L'équipe Archeco 🌸</p>
            ");

        $mailer->send($clientEmail);

        return new JsonResponse([
            "message" => "Demande de devis enregistrée et emails envoyés",
            "devisId" => $devis->getId(),
        ], 201);
    }
    /**
     * 🟦 LISTE DES DEVIS
     */
    #[Route('/devis', name: 'list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $devisList = $em->getRepository(Devis::class)->findAll();

        $data = [];

        foreach ($devisList as $devis) {
            $client = $devis->getClient();

            $data[] = [
                "id" => $devis->getId(),
                "eventType" => $devis->getTypeEvenement(),
                "date" => $devis->getDateEvenement()->format('Y-m-d'),
                "location" => $devis->getLieu(),
                "budget" => $devis->getBudget(),

                // 🆕 Produits souhaités
                "wantedProducts" => $devis->getProduitsSouhaites(),

                // 🆕 Traitement
                "processed" => $devis->isProcessed(),

                "client" => [
                    "firstName" => $client->getPrenom(),
                    "lastName" => $client->getNom(),
                    "email" => $client->getEmail(),
                    "phone" => $client->getTelephone(),
                    "contactPreference" => $client->getPreferenceContact(),
                ],
            ];
        }

        return new JsonResponse($data);
    }

    /**
     * 🟧 MARQUER UN DEVIS COMME TRAITÉ
     */
    #[Route('/admin/devis/{id}/process', name: 'process', methods: ['PATCH'])]
    public function process(int $id, EntityManagerInterface $em): JsonResponse
    {
        $devis = $em->getRepository(Devis::class)->find($id);

        if (!$devis) {
            return new JsonResponse(["error" => "Devis introuvable"], 404);
        }

        $devis->setIsProcessed(true);
        $em->flush();

        return new JsonResponse(["message" => "Devis marqué comme traité"]);
    }
}