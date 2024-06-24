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
import { Input } from "./ui/input";
import { createCustomer } from "@/lib/db/customerCrud";
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

const schema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().min(1, "Customer email is required"),
  customerPhone: z.string().min(1, "Customer phone is required"),
  customerAddress: z.string().min(1, "Customer address is required"),
});

type FormData = z.infer<typeof schema>;

const AddCustomer = () => {
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
  } = methods;

  async function onSubmit(formData: FormData) {
    try {
      setLoading(true);

      await createCustomer({
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        customer_address: formData.customerAddress,
      });

      setLoading(false);
      setDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Mobile number already exists",
        description: "Try again with a different mobile number.",
      });
      setLoading(false);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add new</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
        </DialogHeader>

        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  {errors.customerName && <p>{errors.customerName.message}</p>}
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  {errors.customerEmail && (
                    <p>{errors.customerEmail.message}</p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile #</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  {errors.customerPhone && (
                    <p>{errors.customerPhone.message}</p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="customerAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  {errors.customerAddress && (
                    <p>{errors.customerAddress.message}</p>
                  )}
                </FormItem>
              )}
            />

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

export default AddCustomer;
