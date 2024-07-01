"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/custom/data-table";
import { useEffect, useState } from "react";
import { getVariationOnLocation } from "@/lib/db/variationOnLocationCrud";

interface VariationOnLocationType {
  stock: number;
  date: string;
  variationName: string;
  locationName: string;
  stockStatus: string;
  movement: string;
}

const renderStockStatus = ({ row }: any) => {
  const status = row.original.stockStatus;
  const statusColor =
    status === "Low in stock" ? "text-red-500" : "text-green-500";

  return <span className={statusColor}>{status}</span>;
};

const renderMovement = ({ row }: any) => {
  const status = row.original.movement;
  const statusColor = status === "slow" ? "text-red-500" : "text-green-500";

  return <span className={statusColor}>{status}</span>;
};

export const columns: ColumnDef<VariationOnLocationType>[] = [
  {
    accessorKey: "variationName",
    header: "Variation",
  },
  {
    accessorKey: "locationName",
    header: "Location",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },

  {
    accessorKey: "date",
    header: "Updated at",
  },

  {
    accessorKey: "movement",
    header: "Movement",
    cell: renderMovement,
  },
  {
    accessorKey: "stockStatus",
    header: "Status",
    cell: renderStockStatus,
  },
];

export function RecentSales() {
  const [variations, setVariations] = useState<VariationOnLocationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVariations = async () => {
      try {
        const response = await getVariationOnLocation();
        setVariations(response);
      } catch (error) {
        console.error("Error fetching variations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVariations();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <DataTable data={variations} columns={columns}></DataTable>
    </div>
  );
}
