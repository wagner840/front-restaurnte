import React from "react";
import { TrendingUp, Users } from "lucide-react";

interface QuickStatsProps {
  revenueGrowth: number;
  activeCustomers: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  revenueGrowth,
  activeCustomers,
}) => {
  return (
    <div className="bg-card rounded-xl border p-4 md:p-6">
      <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">
        Estatísticas Rápidas
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Crescimento</p>
              <p className="text-xs text-muted-foreground">vs. 7 dias atrás</p>
            </div>
          </div>
          <span
            className={`text-base md:text-lg font-bold ${
              revenueGrowth >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {revenueGrowth >= 0 ? "+" : ""}
            {revenueGrowth.toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Clientes Ativos
              </p>
              <p className="text-xs text-muted-foreground">últimos 30 dias</p>
            </div>
          </div>
          <span className="text-base md:text-lg font-bold text-foreground">
            {activeCustomers}
          </span>
        </div>
      </div>
    </div>
  );
};
