"use server";

import prisma from "@/lib/prisma";
import { Staff } from "@prisma/client";
import { PartialBy } from "../type";

export const getStaffs = async (): Promise<Staff[]> => {
  try {
    return await prisma.staff.findMany({
      orderBy: { staff_name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw new Error("Failed to fetch staff");
  }
};

export const getStaff = async (email: string): Promise<Staff> => {
  try {
    const staff = await prisma.staff.findFirst({
      where: { email: email },
      orderBy: { staff_name: "asc" },
    });

    if (!staff) {
      throw new Error("Staff not found");
    }
    return staff;
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw new Error("Failed to fetch staff");
  }
};

export const createStaff = async (staffData: PartialBy<Staff, "staff_id">) => {
  try {
    return await prisma.staff.create({
      data: staffData,
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    throw new Error("Failed to create staff");
  }
};

export const updateStaff = async (
  staffId: number,
  updatedData: PartialBy<Staff, "staff_id" | "password">
) => {
  try {
    return await prisma.staff.update({
      where: { staff_id: staffId },
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    throw new Error("Failed to update staff");
  }
};

export const deleteStaff = async (staffId: number) => {
  try {
    await prisma.staff.delete({
      where: {
        staff_id: staffId,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};
