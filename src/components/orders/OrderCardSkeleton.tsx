import React from "react";
import { Skeleton } from "../ui/skeleton";
import { CardContent, CardFooter, CardHeader } from "../ui/card";
import { BaseCard } from "../ui/BaseCard";

export const OrderCardSkeleton: React.FC = () => {
  return (
    <BaseCard className="flex flex-col justify-between animate-pulse">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="space-y-2 pt-2 border-t">
          <Skeleton className="h-4 w-16" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 border-t flex justify-between items-center">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </CardFooter>
    </BaseCard>
  );
};
