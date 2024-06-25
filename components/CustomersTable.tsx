"use client";
import { Search } from "lucide-react";
import Image from "next/image";
import CustomContainer from "./CustomContainer";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useState } from "react";
import { Customer } from "@prisma/client";
import EditCustomer from "./EditCustomer";
import AddCustomer from "./AddCustomer";
import UploadCustomers from "./UploadCustomers";
import DeleteCustomer from "./DeleteCustomer";


interface CustomersTableProps {
  customers: Customer[];
}
function CustomersTable({ customers }: CustomersTableProps) {
  const [search, setSearch] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue);
  };

  const filteredCustomers = customers.filter((customer) => {
    return (
      search.toLowerCase() === "" ||
      customer.customer_name.toLowerCase().includes(search)
    );
  });
  return (
    <CustomContainer>
      <h1 className="text-3xl px-2 mb-4">Customers</h1>
      <Card className="mb-4">
        <div className="flex justify-between items-center gap-5 px-3 py-6">
          <div className="flex items-center border border-primary-foreground px-3 rounded-md ">
            <Search />
            <Input
              placeholder="Search customers"
              className="lg:w-96 border-none focus-visible:outline-none "
              onChange={handleInputChange}
            />
          </div>
          <AddCustomer />
          <UploadCustomers />
        </div>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-72">Name</TableHead>
            <TableHead className="w-80">Email</TableHead>
            <TableHead className="w-80">Phone</TableHead>
            <TableHead className="w-80">Address</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow key={customer.customer_id}>
              <TableCell>{customer.customer_name}</TableCell>

              <TableCell>{customer.customer_email}</TableCell>
              <TableCell>{customer.customer_phone}</TableCell>
              <TableCell>{customer.customer_address}</TableCell>

              <TableCell>
                <EditCustomer
                  customerId={customer.customer_id}
                  customerName={customer.customer_name}
                  customerEmail={customer.customer_email}
                  customerPhone={customer.customer_phone}
                  customerAddress={customer.customer_address}
                />
              </TableCell>
              <TableCell>
                <DeleteCustomer customerId={customer.customer_id} />
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CustomContainer>
  );
}

export default CustomersTable;
