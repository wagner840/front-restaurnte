import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Crown, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { TopSellingProduct } from "@/types";

interface TopSellingProductsProps {
  // products agora será buscado internamente
}

const fetchTopSellingProducts = async (): Promise<TopSellingProduct[]> => {
  const { data, error } = await supabase.rpc("get_top_selling_products_global");
  if (error) {
    throw new Error("Could not fetch top selling products");
  }
  return data || [];
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export const TopSellingProducts: React.FC<TopSellingProductsProps> = () => {
  const { data: products, isLoading } = useQuery<TopSellingProduct[]>({
    queryKey: ["topSellingProducts"],
    queryFn: fetchTopSellingProducts,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Produtos Mais Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center">
            <Crown className="h-5 w-5 text-yellow-600" />
          </div>
          Produtos Mais Vendidos (Global)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {products?.map((product, index) => (
            <motion.div
              key={product.product_name}
              variants={item}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-colors",
                "hover:bg-accent/5"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "font-bold w-6 h-6 flex items-center justify-center rounded-full text-sm",
                    index === 0
                      ? "bg-yellow-100 text-yellow-700"
                      : index === 1
                      ? "bg-accent/10 text-foreground"
                      : index === 2
                      ? "bg-orange-100 text-orange-700"
                      : "text-muted-foreground"
                  )}
                >
                  {index + 1}
                </span>
                <span className="font-medium text-foreground">
                  {product.product_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">
                  {product.total_quantity} unidades
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};
