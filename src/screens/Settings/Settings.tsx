import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useTheme } from "../../contexts/ThemeContext";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import {
  getRestaurantSettings,
  updateRestaurantSettings,
  RestaurantSettings,
} from "../../services/restaurantService";
import { Skeleton } from "../../components/ui/skeleton";

export const Settings: React.FC = () => {
  const { theme, setTheme, soundEnabled, setSoundEnabled } = useTheme();
  const [restaurant, setRestaurant] = useState<RestaurantSettings>({
    name: "",
    cnpj: "",
    address: "",
    logo_url: "",
    opening_hours: { seg: "08:00-18:00", sab: "09:00-14:00", dom: "Fechado" },
    integrations: { whatsapp: "", ifood: "" },
    payment_methods: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRestaurantSettings().then((data) => {
      if (data) setRestaurant(data);
      setLoading(false);
    });
  }, []);

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  const handleSoundChange = (checked: boolean) => {
    setSoundEnabled(checked);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulação: apenas URL local
      setRestaurant({
        ...restaurant,
        logo_url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleOpeningHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestaurant({
      ...restaurant,
      opening_hours: {
        ...restaurant.opening_hours,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleIntegrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestaurant({
      ...restaurant,
      integrations: {
        ...restaurant.integrations,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handlePaymentMethodsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setRestaurant((prev) => ({
      ...prev,
      payment_methods: prev.payment_methods?.includes(value)
        ? prev.payment_methods.filter((m: string) => m !== value)
        : [...(prev.payment_methods || []), value],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateRestaurantSettings(restaurant);
    setIsSaving(false);
    toast.success("Dados do restaurante salvos com sucesso!");
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Configurações
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Personalize as configurações do seu restaurante
        </p>
        <Card>
          <CardHeader>
            <CardTitle>Aparência e Som</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme-switch">Tema Escuro</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ative para uma experiência com menos brilho.
                </p>
              </div>
              <Switch
                id="theme-switch"
                checked={theme === "dark"}
                onCheckedChange={handleThemeChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sound-switch">Efeitos Sonoros</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ative para receber notificações sonoras.
                </p>
              </div>
              <Switch
                id="sound-switch"
                checked={soundEnabled}
                onCheckedChange={handleSoundChange}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Dados do Restaurante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <Skeleton className="w-full h-[200px]" />
            ) : (
              <>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex flex-col items-center gap-2">
                    {restaurant.logo_url ? (
                      <img
                        src={restaurant.logo_url}
                        alt="Logo do restaurante"
                        className="w-24 h-24 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                        Logo
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      aria-label="Alterar logo do restaurante"
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        name="name"
                        value={restaurant.name}
                        onChange={handleChange}
                        aria-label="Nome do restaurante"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        name="cnpj"
                        value={restaurant.cnpj}
                        onChange={handleChange}
                        aria-label="CNPJ do restaurante"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        name="address"
                        value={restaurant.address}
                        onChange={handleChange}
                        aria-label="Endereço do restaurante"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="seg">Horário Seg-Sex</Label>
                    <Input
                      id="seg"
                      name="seg"
                      value={restaurant.opening_hours?.seg || ""}
                      onChange={handleOpeningHoursChange}
                      aria-label="Horário Seg-Sex"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sab">Horário Sábado</Label>
                    <Input
                      id="sab"
                      name="sab"
                      value={restaurant.opening_hours?.sab || ""}
                      onChange={handleOpeningHoursChange}
                      aria-label="Horário Sábado"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dom">Horário Domingo</Label>
                    <Input
                      id="dom"
                      name="dom"
                      value={restaurant.opening_hours?.dom || ""}
                      onChange={handleOpeningHoursChange}
                      aria-label="Horário Domingo"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="payment_methods">
                      Métodos de Pagamento Aceitos
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        "Dinheiro",
                        "Cartão de Crédito",
                        "Cartão de Débito",
                        "Pix",
                        "Vale Refeição",
                      ].map((method) => (
                        <label key={method} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="payment_methods"
                            value={method}
                            checked={restaurant.payment_methods?.includes(
                              method
                            )}
                            onChange={handlePaymentMethodsChange}
                          />
                          {method}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      name="whatsapp"
                      placeholder="Número do WhatsApp"
                      value={restaurant.integrations?.whatsapp || ""}
                      onChange={handleIntegrationChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifood">iFood</Label>
                    <Input
                      name="ifood"
                      placeholder="Token/ID do iFood"
                      value={restaurant.integrations?.ifood || ""}
                      onChange={handleIntegrationChange}
                    />
                  </div>
                </div>
                <div>
                  <Label>Integrações (JSON)</Label>
                  <Input
                    name="integrations"
                    value={JSON.stringify(restaurant.integrations || {})}
                    onChange={(e) =>
                      setRestaurant({
                        ...restaurant,
                        integrations: JSON.parse(e.target.value || "{}"),
                      })
                    }
                    aria-label="Integrações"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    aria-label="Salvar dados do restaurante"
                  >
                    {isSaving ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
