"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/TopDialog";
import { Button } from "@/components/ui/button";
import { createBulkCustomer, createCustomer } from "@/lib/db/customerCrud";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
import { Upload } from "lucide-react";
import { Customer } from "@prisma/client";

const schema = z.object({
  uploadArea: z.string().min(1, "Json file content is required"),
});

type FormData = z.infer<typeof schema>;

const UploadCustomers = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = methods;

  async function onSubmit(formData: FormData) {
    try {
      setLoading(true);

      const jsonObjects: Omit<Customer, "customer_id">[] = JSON.parse(
        formData.uploadArea
      );

      if (!Array.isArray(jsonObjects)) {
        throw new Error(
          "Invalid data format: Expected an array of customer objects"
        );
      }

      await createBulkCustomer(jsonObjects);
      setLoading(false);
      setDialogOpen(false);
      reset();
      router.refresh();
      toast({
        title: "Success",
        description: "Customers have been uploaded successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description:
          "There was an error processing your request. Please check the JSON format and try again.",
      });
      setLoading(false);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Upload />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Customers</DialogTitle>
        </DialogHeader>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={control}
              name="uploadArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paste the JSON text here</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  {errors.uploadArea && (
                    <p className="text-red-500">{errors.uploadArea.message}</p>
                  )}
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading} variant="default">
                {loading ? "Loading..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadCustomers;
