import { supabase } from "../lib/supabaseClient";
import { MenuItem } from "../types";

export const getMenuItems = async () => {
  const { data, error } = await supabase.from("menu_items").select("*");

  if (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }

  return data || [];
};

export const addMenuItem = async (
  menuItem: Omit<MenuItem, "id" | "created_at">
) => {
  const { data, error } = await supabase
    .from("menu_items")
    .insert([menuItem])
    .select()
    .single();

  if (error) {
    console.error("Error adding menu item:", error);
    throw error;
  }

  return data;
};

export const updateMenuItem = async (
  id: string,
  updates: Partial<MenuItem>
) => {
  const { data, error } = await supabase
    .from("menu_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating menu item:", error);
    throw error;
  }

  return data;
};

export const deleteMenuItem = async (id: string) => {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (error) {
    console.error("Error deleting menu item:", error);
    throw error;
  }
};
