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
import { createStaff } from "@/lib/db/staffCrud";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import bcrypt from "bcryptjs";
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

const schema = z.object({
  staffName: z.string().min(1, "Staff name is required"),
  mobileNumber: z.string().min(1, "Staff  is required"),
  email: z.string().min(1, "Staff email is required"),
  location: z.string().min(1, "Staff location is required"),
  password: z.string().min(1, "Staff role is required"),
  role: z.string().min(1, "Staff role is required"),
});

type FormData = z.infer<typeof schema>;

const AddStaff = () => {
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

      const hashedPassword = await bcrypt.hash(formData.password, 10);

      await createStaff({
        staff_name: formData.staffName,
        mobile_number: formData.mobileNumber,
        email: formData.email,
        location: formData.location,
        role: formData.role,
        password: hashedPassword,
        job_title: "Staff",
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
        <Button variant="default">Add new</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Staff</DialogTitle>
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
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
                    <Input placeholder="Mobile #" {...field} />
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} />
                  </FormControl>
                  {errors.password && <p>{errors.password.message}</p>}
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
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

export default AddStaff;
