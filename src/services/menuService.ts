import { supabase } from "../lib/supabaseClient";
import { MenuItem } from "../types";
import { toast } from "sonner";

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase.from("menu_items").select("*");

  if (error) {
    toast.error("Erro ao buscar itens do menu.");
    throw error;
  }

  return data || [];
};

export const addMenuItem = async (
  menuItem: Omit<MenuItem, "id" | "created_at">
): Promise<MenuItem> => {
  const { data, error } = await supabase
    .from("menu_items")
    .insert([menuItem])
    .select()
    .single();

  if (error) {
    toast.error("Erro ao adicionar item ao menu.");
    throw error;
  }

  return data;
};

export const updateMenuItem = async (
  id: string,
  updates: Partial<Omit<MenuItem, "id" | "created_at">>
): Promise<MenuItem> => {
  const { data, error } = await supabase
    .from("menu_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    toast.error("Erro ao atualizar item do menu.");
    throw error;
  }

  return data;
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (error) {
    toast.error("Erro ao deletar item do menu.");
    throw error;
  }
};
