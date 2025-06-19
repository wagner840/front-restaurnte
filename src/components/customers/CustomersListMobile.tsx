import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Customer } from "../../types";
import { Mail, Phone } from "lucide-react";

interface CustomersListMobileProps {
  customers: Customer[];
  onCardClick: (customer: Customer) => void;
}

export const CustomersListMobile: React.FC<CustomersListMobileProps> = ({
  customers,
  onCardClick,
}) => {
  return (
    <div className="space-y-4">
      {customers.length > 0 ? (
        customers.map((customer) => (
          <Card
            key={customer.customer_id}
            onClick={() => onCardClick(customer)}
            className="cursor-pointer"
          >
            <CardHeader>
              <CardTitle>{customer.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customer.email || "N/A"}</span>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nenhum cliente encontrado.</p>
        </div>
      )}
    </div>
  );
};
