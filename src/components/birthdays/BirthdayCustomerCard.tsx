import React from "react";
import { Customer } from "../../types";
import { Card, CardContent } from "../ui/card";
import { StatusUpdateButton } from "./StatusUpdateButton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Cake } from "lucide-react";

interface BirthdayCustomerCardProps {
  customer: Customer;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const correctedDate = new Date(date.getTime() + userTimezoneOffset);
  return correctedDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
};

export const BirthdayCustomerCard: React.FC<BirthdayCustomerCardProps> = ({
  customer,
}) => {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src={`https://avatar.vercel.sh/${customer.name}.png`}
            />
            <AvatarFallback>
              {customer.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{customer.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Cake className="h-4 w-4" />
              {formatDate(customer.birthday)}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <StatusUpdateButton customer={customer} />
        </div>
      </CardContent>
    </Card>
  );
};
