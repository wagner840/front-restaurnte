import { supabase } from "../lib/supabaseClient";
import { RestaurantSettings } from "../types";

export async function getRestaurantSettings(): Promise<RestaurantSettings | null> {
  const { data, error } = await supabase
    .from("restaurant_settings")
    .select("*")
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function updateRestaurantSettings(
  settings: RestaurantSettings
): Promise<boolean> {
  const { error } = await supabase.from("restaurant_settings").upsert(settings);

  if (error) {
    return false;
  }

  return true;
}
