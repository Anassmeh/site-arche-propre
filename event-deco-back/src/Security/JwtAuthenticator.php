<?php

namespace App\Security;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

class JwtAuthenticator extends AbstractAuthenticator
{
    public function supports(Request $request): ?bool
    {
        return $request->headers->has('Authorization');
    }

    public function authenticate(Request $request): SelfValidatingPassport
    {
        $header = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $header);

        $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));

        return new SelfValidatingPassport(
            new UserBadge($decoded->email)
        );
    }

    public function onAuthenticationFailure(Request $request, $exception): ?JsonResponse
    {
        return new JsonResponse(['error' => 'Invalid or expired token'], 401);
    }

    public function onAuthenticationSuccess(Request $request, $passport, string $firewallName): ?JsonResponse
    {
        return null;
    }
}
