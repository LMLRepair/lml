import { Overview } from "@/app/dashboard/_components/overview";
import { RecentSales } from "@/app/dashboard/_components/recent-sales";
import React from "react";
import { Label } from "./ui/label";

function InventoryOverviewBody() {
  return (
    <div>
      <h1 className="text-2xl font-medium">Inventory Overview</h1>
      <div className="flex items-center gap-10">
        <Overview />
        <RecentSales />
      </div>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-medium">Quick Report</h1>
        <div className="flex items-center space-x-20 ">
          <div className=" space-y-1">
            <Label>Total Sales</Label>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-semibold">$1,200</span>
              <span className="text-green-500">+20%</span>
            </div>
          </div>
          <div className=" space-y-1">
            <Label>Total Items</Label>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-semibold">120</span>
              <span className="text-green-500">+20%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryOverviewBody;
