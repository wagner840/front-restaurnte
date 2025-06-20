import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import {
  getRestaurantSettings,
  updateRestaurantSettings,
} from "../../services/restaurantService";
import { Skeleton } from "../../components/ui/skeleton";
import { ThemeSettings } from "../../components/settings/ThemeSettings";
import { SoundSettings } from "../../components/settings/SoundSettings";
import type { RestaurantSettings } from "../../types";

export const Settings: React.FC = () => {
  const [restaurant, setRestaurant] = useState<RestaurantSettings>({
    name: "",
    cnpj: "",
    address: "",
    logo_url: "",
    opening_hours: {
      seg: "",
      sab: "",
      dom: "",
    },
    integrations: {
      whatsapp: "",
      ifood: "",
    },
    payment_methods: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRestaurantSettings();
  }, []);

  const loadRestaurantSettings = async () => {
    try {
      const data = await getRestaurantSettings();
      if (data) {
        setRestaurant({
          ...data,
          cnpj: data.cnpj || "",
          address: data.address || "",
          logo_url: data.logo_url || "",
          opening_hours: {
            seg: data.opening_hours?.seg || "",
            sab: data.opening_hours?.sab || "",
            dom: data.opening_hours?.dom || "",
          },
          integrations: {
            whatsapp: data.integrations?.whatsapp || "",
            ifood: data.integrations?.ifood || "",
          },
          payment_methods: data.payment_methods || [],
        });
      }
    } catch (error) {
      toast.error("Erro ao carregar as configurações");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await updateRestaurantSettings(restaurant);
      if (success) {
        toast.success("Configurações salvas com sucesso!");
      } else {
        toast.error("Erro ao salvar as configurações");
      }
    } catch (error) {
      toast.error("Erro ao salvar as configurações");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
          </CardHeader>
          <CardContent>
            <ThemeSettings />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <SoundSettings />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Restaurante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="restaurant-name">Nome do Restaurante</Label>
              <Input
                id="restaurant-name"
                name="restaurant-name"
                autoComplete="organization"
                value={restaurant.name}
                onChange={(e) =>
                  setRestaurant({ ...restaurant, name: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="restaurant-cnpj">CNPJ</Label>
              <Input
                id="restaurant-cnpj"
                name="restaurant-cnpj"
                autoComplete="off"
                value={restaurant.cnpj}
                onChange={(e) =>
                  setRestaurant({ ...restaurant, cnpj: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="restaurant-address">Endereço</Label>
              <Input
                id="restaurant-address"
                name="restaurant-address"
                autoComplete="street-address"
                value={restaurant.address}
                onChange={(e) =>
                  setRestaurant({ ...restaurant, address: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="restaurant-logo">URL do Logo</Label>
              <Input
                id="restaurant-logo"
                name="restaurant-logo"
                autoComplete="off"
                value={restaurant.logo_url}
                onChange={(e) =>
                  setRestaurant({ ...restaurant, logo_url: e.target.value })
                }
              />
            </div>

            <div className="grid gap-4">
              <Label>Horário de Funcionamento</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="hours-seg">Segunda a Sexta</Label>
                  <Input
                    id="hours-seg"
                    name="hours-seg"
                    autoComplete="off"
                    value={restaurant.opening_hours?.seg || ""}
                    onChange={(e) =>
                      setRestaurant({
                        ...restaurant,
                        opening_hours: {
                          seg: e.target.value,
                          sab: restaurant.opening_hours?.sab || "",
                          dom: restaurant.opening_hours?.dom || "",
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hours-sab">Sábado</Label>
                  <Input
                    id="hours-sab"
                    name="hours-sab"
                    autoComplete="off"
                    value={restaurant.opening_hours?.sab || ""}
                    onChange={(e) =>
                      setRestaurant({
                        ...restaurant,
                        opening_hours: {
                          seg: restaurant.opening_hours?.seg || "",
                          sab: e.target.value,
                          dom: restaurant.opening_hours?.dom || "",
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hours-dom">Domingo</Label>
                  <Input
                    id="hours-dom"
                    name="hours-dom"
                    autoComplete="off"
                    value={restaurant.opening_hours?.dom || ""}
                    onChange={(e) =>
                      setRestaurant({
                        ...restaurant,
                        opening_hours: {
                          seg: restaurant.opening_hours?.seg || "",
                          sab: restaurant.opening_hours?.sab || "",
                          dom: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <Label>Integrações</Label>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    autoComplete="tel"
                    value={restaurant.integrations?.whatsapp || ""}
                    onChange={(e) =>
                      setRestaurant({
                        ...restaurant,
                        integrations: {
                          whatsapp: e.target.value,
                          ifood: restaurant.integrations?.ifood || "",
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ifood">iFood</Label>
                  <Input
                    id="ifood"
                    name="ifood"
                    autoComplete="off"
                    value={restaurant.integrations?.ifood || ""}
                    onChange={(e) =>
                      setRestaurant({
                        ...restaurant,
                        integrations: {
                          whatsapp: restaurant.integrations?.whatsapp || "",
                          ifood: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={handleSave} disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
