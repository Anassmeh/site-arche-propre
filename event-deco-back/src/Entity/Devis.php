<?php

namespace App\Entity;

use App\Repository\DevisRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DevisRepository::class)]
class Devis
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $typeEvenement = null;

    #[ORM\Column]
    private ?\DateTime $dateEvenement = null;

    #[ORM\Column(length: 255)]
    private ?string $lieu = null;

    #[ORM\Column]
    private ?float $budget = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $produitsSouhaites = null;

    #[ORM\Column(type: 'boolean')]
    private bool $isProcessed = false;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Client $client = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTypeEvenement(): ?string
    {
        return $this->typeEvenement;
    }

    public function setTypeEvenement(string $typeEvenement): static
    {
        $this->typeEvenement = $typeEvenement;

        return $this;
    }

    public function getDateEvenement(): ?\DateTime
    {
        return $this->dateEvenement;
    }

    public function setDateEvenement(\DateTime $dateEvenement): static
    {
        $this->dateEvenement = $dateEvenement;

        return $this;
    }

    public function isProcessed(): bool
    {
        return $this->isProcessed;
    }

    public function setIsProcessed(bool $isProcessed): static
    {
        $this->isProcessed = $isProcessed;
        return $this;
    }

    public function getLieu(): ?string
    {
        return $this->lieu;
    }

    public function setLieu(string $lieu): static
    {
        $this->lieu = $lieu;

        return $this;
    }

    public function getBudget(): ?float
    {
        return $this->budget;
    }

    public function setBudget(float $budget): static
    {
        $this->budget = $budget;

        return $this;
    }

    public function getProduitsSouhaites(): ?string
    {
        return $this->produitsSouhaites;
    }

    public function setProduitsSouhaites(?string $produitsSouhaites): static
    {
        $this->produitsSouhaites = $produitsSouhaites;
        return $this;
    }


    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): static
    {
        $this->client = $client;

        return $this;
    }
}
