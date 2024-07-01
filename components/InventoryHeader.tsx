import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

function InventoryHeader() {
  return (
    <div>
      <div className="space-y-1">
        <h1 className="text-2xl font-medium">Welcome Back.</h1>
        <p className="text-sm">Here's what's in your inventory</p>
      </div>
      <div className="flex items-center gap-2 py-3">
        <Link href={"/dashboard/inventory/items"}>
          <Button className="w-24">Items</Button>
        </Link>

        <Link href={"/dashboard/inventory/categories"}>
          <Button className="w-24">Categories</Button>
        </Link>
        <Link href={"/dashboard/inventory/locations"}>
          <Button className="w-24">Locations</Button>
        </Link>
        <Link href={"/dashboard/inventory/itemBrands"}>
          <Button className="w-24">Brands</Button>
        </Link>

        <Link href={"/dashboard/inventory/vendors"}>
          <Button className="w-24">Vendors</Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className="space-x-1">
              <span>Item Activity</span>
              <ChevronDown size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href={"/dashboard/inventory/returns"}>Returns</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"/dashboard/inventory/transfers"}>
                Internal Transfers
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default InventoryHeader;
