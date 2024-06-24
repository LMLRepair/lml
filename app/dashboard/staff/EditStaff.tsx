"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateStaff } from "@/lib/db/staffCrud";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { set } from "date-fns";

const schema = z.object({
  staffName: z.string().min(1, "Staff name is required"),
  mobileNumber: z.string().min(1, "Staff  is required"),
  email: z.string().min(1, "Staff email is required"),
  location: z.string().min(1, "Staff location is required"),
  role: z.string().min(1, "Staff role is required"),
});

type FormData = z.infer<typeof schema>;

interface EditStaffProps {
  staffId: number;
  staffName: string;
  mobileNumber: string;
  email: string;
  location: string;
  role: string;
}

const EditStaff = ({
  staffId,
  staffName,
  mobileNumber,
  email,
  role,
  location,
}: EditStaffProps) => {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      staffName,
      mobileNumber,
      email,
      location,
      role,
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  async function onSubmit(formData: FormData) {
    try {
      setLoading(true);

      await updateStaff(staffId, {
        staff_name: formData.staffName,
        mobile_number: formData.mobileNumber,
        email: formData.email,
        location: formData.location,
        role: formData.role,
      });

      setLoading(false);
      setDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Email already exists",
        description: "Try again with a different Email.",
      });
      setLoading(false);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {staffName}</DialogTitle>
        </DialogHeader>

        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={control}
              name="staffName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Staff Name" {...field} />
                  </FormControl>
                  {errors.staffName && <p>{errors.staffName.message}</p>}
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff Description</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Staff Description"
                      {...field}
                    />
                  </FormControl>
                  {errors.email && <p>{errors.email.message}</p>}
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile #</FormLabel>
                  <FormControl>
                    <Input type="mobile" placeholder="Mobile #" {...field} />
                  </FormControl>
                  {errors.mobileNumber && <p>{errors.mobileNumber.message}</p>}
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Location" {...field} />
                  </FormControl>
                  {errors.location && <p>{errors.location.message}</p>}
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change role</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-max">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles:</SelectLabel>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {errors.role && <p>{errors.role.message}</p>}
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

export default EditStaff;
