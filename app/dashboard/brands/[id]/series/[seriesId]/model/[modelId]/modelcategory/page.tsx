"use client";
import AddModelCategory from "@/components/AddModelCategory";
import CustomContainer from "@/components/CustomContainer";
import DeleteModelCategory from "@/components/DeleteModelCategory";
import EditModelCategory from "@/components/EditModelCategory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getModelCategory } from "@/lib/db/modelCategoryCrud";
import { ModelCategory } from "@prisma/client";
import { ArrowLeftIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  params: {
    id: string;
    modelId: string;
    seriesId: string;
  };
  searchParams: {
    modelName: string;
  };
}

const ModelCategoryPage = ({ params, searchParams }: Props) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [modelCategories, setModelCategories] = useState<ModelCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getModelCategory(parseInt(params.modelId));
        setModelCategories(response);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.modelId]);

  return (
    <CustomContainer>
      <div className="flex flex-col gap-7">
        <Card>
          <div className="flex justify-between p-5">
            <div className="flex items-center gap-4 ">
              <div className="flex flex-col gap-1">
                <div className="flex gap-4">
                  <h1 className="text-2xl font-semibold">
                    {searchParams.modelName}
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <Button
                className={`${
                  theme === "light"
                    ? "bg-primary text-secondary-foreground"
                    : "bg-primary text-secondary"
                }`}
                onClick={() => router.back()}
              >
                <ArrowLeftIcon />
              </Button>
              <AddModelCategory modelId={parseInt(params.modelId)} />
            </div>
          </div>
        </Card>
        <Card>
          {loading ? (
            <div className="p-5">Loading...</div>
          ) : error ? (
            <div className="p-5 text-red-500">
              Failed to load model categories.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type Of Repair</TableHead>
                  <TableHead>Raw</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead>Shipping</TableHead>
                  <TableHead>Labour</TableHead>
                  <TableHead>Time Frame</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modelCategories.map((modelCategory) => (
                  <TableRow key={modelCategory.modelCategory_id}>
                    <TableCell>{modelCategory.type_of_repair}</TableCell>
                    <TableCell className="font-medium">
                      {modelCategory.raw}
                    </TableCell>
                    <TableCell className="font-medium">
                      {modelCategory.tax} %
                    </TableCell>
                    <TableCell className="font-medium">
                      $ {modelCategory.shipping}
                    </TableCell>
                    <TableCell className="font-medium">
                      {modelCategory.labour}
                    </TableCell>
                    <TableCell className="font-medium">
                      {modelCategory.timeFrame}
                    </TableCell>
                    <TableCell className="font-medium">
                      $
                      {Math.ceil(
                        modelCategory.raw +
                          modelCategory.raw * (modelCategory.tax / 100) +
                          modelCategory.shipping +
                          modelCategory.labour
                      )}
                    </TableCell>

                    <TableCell className="font-medium">
                      <EditModelCategory
                        modelCategoryId={modelCategory.modelCategory_id}
                        tax={modelCategory.tax.toString()}
                        labour={modelCategory.labour.toString()}
                        shipping={modelCategory.shipping.toString()}
                        raw={modelCategory.raw.toString()}
                        timeFrame={modelCategory.timeFrame}
                        typeOfRepair={modelCategory.type_of_repair.toString()}
                      />
                    </TableCell>

                    <TableCell>
                      <DeleteModelCategory
                        modelCategoryId={modelCategory.modelCategory_id}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </CustomContainer>
  );
};

export default ModelCategoryPage;
