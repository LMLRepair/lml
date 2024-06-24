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
import { createModelCategory } from "@/lib/db/modelCategoryCrud";
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
import { Input } from "./ui/input";

const schema = z.object({
  typeOfRepair: z.string().min(1, "Type of repair is required"),
  raw: z.string().min(1, "Raw value is required"),
  tax: z.string().min(1, "Tax value is required"),
  shipping: z.string().min(1, "Shipping value is required"),
  labour: z.string().min(1, "Labour value is required"),
  timeFrame: z.string().min(1, "Time frame is required"),
});

type FormData = z.infer<typeof schema>;

interface AddModelCategoryProps {
  modelId: number;
}

const AddModelCategory = ({ modelId }: AddModelCategoryProps) => {
  const [loading, setLoading] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  async function onSubmit(formData: FormData) {
    try {
      setLoading(true);

      await createModelCategory({
        model_id: modelId,
        type_of_repair: formData.typeOfRepair,
        raw: parseInt(formData.raw),
        tax: parseInt(formData.tax),
        shipping: parseInt(formData.shipping),
        labour: parseInt(formData.labour),
        timeFrame: formData.timeFrame,
      });

      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.error("An error occurred:", error);
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add new</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={control}
              name="typeOfRepair"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="typeOfRepair" className="text-right">
                    Type of repair
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {errors.typeOfRepair && <p>{errors.typeOfRepair.message}</p>}

            <FormField
              control={control}
              name="raw"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="raw" className="text-right">
                    Raw
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                </FormItem>
              )}
            />
            {errors.raw && <p>{errors.raw.message}</p>}

            <FormField
              control={control}
              name="tax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="tax" className="text-right">
                    Tax %
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                </FormItem>
              )}
            />
            {errors.tax && <p>{errors.tax.message}</p>}

            <FormField
              control={control}
              name="shipping"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="shipping" className="text-right">
                    Shipping
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                </FormItem>
              )}
            />
            {errors.shipping && <p>{errors.shipping.message}</p>}

            <FormField
              control={control}
              name="labour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="labour" className="text-right">
                    Labour
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                </FormItem>
              )}
            />
            {errors.labour && <p>{errors.labour.message}</p>}

            <FormField
              control={control}
              name="timeFrame"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="timeFrame" className="text-right">
                    Time frame
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {errors.timeFrame && <p>{errors.timeFrame.message}</p>}

            <DialogFooter>
              <Button type="submit" disabled={loading} variant="default">
                {loading ? "Loading" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddModelCategory;
