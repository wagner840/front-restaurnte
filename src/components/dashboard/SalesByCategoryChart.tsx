import React from "react";

export interface SalesByCategoryData {
  category: string;
  amount: number;
}

interface SalesByCategoryChartProps {
  data: SalesByCategoryData[];
  isLoading?: boolean;
  className?: string;
}

// Cores predefinidas para categorias com melhor contraste
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Lanches: { bg: "bg-blue-500", text: "text-blue-700" },
  Bebidas: { bg: "bg-green-500", text: "text-green-700" },
  Sobremesas: { bg: "bg-orange-500", text: "text-orange-700" },
  Acompanhamentos: { bg: "bg-purple-500", text: "text-purple-700" },
  "Pratos Principais": { bg: "bg-red-500", text: "text-red-700" },
  Entradas: { bg: "bg-yellow-500", text: "text-yellow-700" },
  Outros: { bg: "bg-gray-500", text: "text-gray-700" },
};

// Função para obter cores da categoria
const getCategoryColors = (category: string): { bg: string; text: string } => {
  return (
    CATEGORY_COLORS[category] || { bg: "bg-gray-500", text: "text-gray-700" }
  );
};

// Função para formatar valor monetário
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Função para calcular porcentagem
const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Componente de Skeleton para loading
const SkeletonBar: React.FC = () => (
  <div className="animate-pulse">
    <div className="flex justify-between mb-2">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="h-2 bg-gray-200 rounded-full"></div>
  </div>
);

export const SalesByCategoryChart: React.FC<SalesByCategoryChartProps> = ({
  data,
  isLoading = false,
  className = "",
}) => {
  // Calcula o total de vendas
  const totalSales = React.useMemo(
    () => data.reduce((sum, item) => sum + item.amount, 0),
    [data]
  );

  // Ordena os dados por valor (maior para menor)
  const sortedData = React.useMemo(
    () => [...data].sort((a, b) => b.amount - a.amount),
    [data]
  );

  // Estado de carregamento
  if (isLoading) {
    return (
      <div
        className={`bg-white rounded-xl border border-gray-200 p-4 md:p-6 ${className}`}
      >
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
          Vendas por Categoria
        </h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((index) => (
            <SkeletonBar key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Estado vazio
  if (!data || data.length === 0) {
    return (
      <div
        className={`bg-white rounded-xl border border-gray-200 p-4 md:p-6 ${className}`}
      >
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
          Vendas por Categoria
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <svg
            className="w-12 h-12 text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-sm text-gray-500">
            Nenhum dado de vendas disponível no momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-4 md:p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">
          Vendas por Categoria
        </h3>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(totalSales)}
          </p>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="space-y-4">
        {sortedData.map((item) => {
          const percentage = calculatePercentage(item.amount, totalSales);
          const colors = getCategoryColors(item.category);

          return (
            <div key={item.category} className="group">
              {/* Header da categoria */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div
                    className={`w-3 h-3 rounded-full ${colors.bg} flex-shrink-0 
                      ring-2 ring-transparent group-hover:ring-offset-2 group-hover:ring-${colors.bg.replace(
                        "bg-",
                        ""
                      )} 
                      transition-all duration-200`}
                  />
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.amount)}
                  </span>
                  <span className="text-xs text-gray-500 min-w-[3rem] text-right">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="relative w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full rounded-full ${colors.bg} 
                    transition-all duration-500 ease-out group-hover:brightness-110`}
                  style={{ width: `${percentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumo mobile - mostrar apenas no mobile */}
      {sortedData.length > 3 && (
        <div className="mt-6 pt-4 border-t border-gray-100 md:hidden">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Top 3 categorias representam</span>
            <span className="font-medium">
              {calculatePercentage(
                sortedData
                  .slice(0, 3)
                  .reduce((sum, item) => sum + item.amount, 0),
                totalSales
              )}
              % do total
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
