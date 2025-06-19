import { supabase } from "../lib/supabaseClient";

export interface RestaurantSettings {
  id?: string;
  name: string;
  cnpj?: string;
  address?: string;
  logo_url?: string;
  opening_hours?: any;
  integrations?: { whatsapp?: string; ifood?: string; [key: string]: any };
  payment_methods?: string[];
  created_at?: string;
  updated_at?: string;
}

export async function getRestaurantSettings(): Promise<RestaurantSettings | null> {
  const { data, error } = await supabase
    .from("restaurant_settings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error) return null;
  return data;
}

export async function updateRestaurantSettings(
  settings: Partial<RestaurantSettings>
): Promise<RestaurantSettings | null> {
  const { data, error } = await supabase
    .from("restaurant_settings")
    .upsert(
      { ...settings, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    )
    .select()
    .single();
  if (error) return null;
  return data;
}
