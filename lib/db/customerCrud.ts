"use server";

import prisma from "@/lib/prisma";
import { Customer } from "@prisma/client";
import { PartialBy } from "../type";

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    return await prisma.customer.findMany({
      orderBy: { customer_name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Failed to fetch customers");
  }
};

export const createCustomer = async (
  customerData: PartialBy<Customer, "customer_id">
) => {
  try {
    return await prisma.customer.create({
      data: customerData,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    throw new Error("Failed to create customer");
  }
};

export const updateCustomer = async (
  customerId: number,
  updatedData: PartialBy<Customer, "customer_id">
) => {
  try {
    return await prisma.customer.update({
      where: { customer_id: customerId },
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    throw new Error("Failed to update customer");
  }
};
