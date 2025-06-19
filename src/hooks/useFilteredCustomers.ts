import { useMemo } from "react";
import { Customer } from "../types";

export const useFilteredCustomers = (
  customers: Customer[],
  searchTerm: string
) => {
  const filteredCustomers = useMemo(
    () =>
      customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (customer.email &&
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    [customers, searchTerm]
  );

  return filteredCustomers;
};
