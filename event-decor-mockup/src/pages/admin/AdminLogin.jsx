import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    setError("");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      navigate("/admin/categories");
    } else {
      setError("Identifiants invalides");
    }
  };

  return (
    <div className="flex justify-center mt-24 px-4"> 
      {/* ⬆️ mt-24 = remonte le bloc près du header */}

      <Card className="w-full max-w-xs shadow-lg border border-border">
        {/* ⬆️ max-w-xs = 320px → bloc plus étroit */}

        <CardHeader>
          <CardTitle className="text-center text-xl">
            Connexion Admin
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <p className="text-red-500 text-center text-sm">{error}</p>
          )}

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" onClick={login}>
            Connexion
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
