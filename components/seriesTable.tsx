"use client";

import { Search } from "lucide-react";
import Link from "next/link";
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
import EditSeries from "./EditSeries";
import AddSeries from "./AddSeries";
import DeleteSeries from "./DeleteSeries";

type Series = {
  series_id: number;
  series_name: string;
  series_image: string;
  series_desc: string;
  brand_id: number;
  Brand: {
    brand_name: string;
  };
};

interface seriesTableProps {
  series: Series[];
  brandId: number;
}

function seriesTable({ series, brandId }: seriesTableProps) {
  const [search, setSearch] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue);
  };

  const filteredSeries = series.filter((series) => {
    return (
      search.toLowerCase() === "" ||
      series.series_name.toLowerCase().includes(search)
    );
  });
  return (
    <CustomContainer>
      <h1 className="text-3xl px-2 mb-4">
        {series.length !== 0 ? series[0].Brand.brand_name : "No"} series
      </h1>
      <Card className="mb-4">
        <div className="flex justify-between items-center gap-5 px-3 py-6">
          <div className="flex items-center border border-primary-foreground px-3 rounded-md ">
            <Search />
            <Input
              placeholder="Search series..."
              className="w-96 border-none focus-visible:outline-none "
              onChange={handleInputChange}
            />
          </div>
          <AddSeries brandId={brandId} />
        </div>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-72">Series Name</TableHead>
            <TableHead>Series Image</TableHead>
            <TableHead className="w-80">Series Description</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSeries.map((series) => (
            <TableRow key={series.series_id}>
              <TableCell>
                <Link
                  className="hover:underline"
                  href={`/dashboard/brands/${brandId}/series/${series?.series_id}/model`}
                >
                  {series.series_name}
                </Link>
              </TableCell>
              <TableCell>
                <img
                  src={series.series_image}
                  alt={series.series_name}
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
              </TableCell>
              <TableCell>{series.series_desc}</TableCell>
              <TableCell>
                <EditSeries
                  brandId={series.brand_id}
                  seriesId={series.series_id}
                  seriesName={series.series_name}
                  seriesDescription={series.series_desc}
                />
              </TableCell>

              <TableCell>
                <DeleteSeries seriesId={series.series_id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CustomContainer>
  );
}
export default seriesTable;
