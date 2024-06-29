"use client";
import React, { useRef, useState } from "react";
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
import useFormStore from "@/app/store";

const AddVariation = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    formData,
    errors,
    loading,
    setFormData,
    setErrors,
    setLoading,
    addVariation,
  } = useFormStore();

  const validateForm = () => {
    let formErrors = {
      variationName: "",
      variationPrice: "",
      variationImage: "",
    };
    let isValid = true;

    if (!formData.variationName) {
      formErrors.variationName = "Variation name is required";
      isValid = false;
    }

    if (!formData.variationPrice) {
      formErrors.variationPrice = "Variation price is required";
      isValid = false;
    }

    if (formData.variationImage) {
      const fileType = formData.variationImage.type;
      if (!["image/jpeg", "image/png", "image/jpg"].includes(fileType)) {
        formErrors.variationImage = "Only jpg, jpeg, and png files are allowed";
        isValid = false;
      }
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "variationImage" && files) {
      setFormData({ [name]: files[0] });
    } else {
      setFormData({ [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        addVariation({
          id: Date.now().toString(), // Generate a unique ID for the variation
          name: formData.variationName,
          price: formData.variationPrice,
          image: formData.variationImage
            ? URL.createObjectURL(formData.variationImage)
            : null,
          locations: [], // Initialize with an empty array of locations
        });
        setDialogOpen(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add new</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add variation</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <label htmlFor="variationName">Variation Name</label>
            <Input
              type="text"
              name="variationName"
              placeholder="Variation Name"
              value={formData.variationName}
              onChange={handleChange}
            />
            {errors.variationName && <p>{errors.variationName}</p>}
          </div>

          <div>
            <label htmlFor="variationPrice">Variation Price</label>
            <Input
              type="text"
              name="variationPrice"
              placeholder="Variation Price"
              value={formData.variationPrice}
              onChange={handleChange}
            />
            {errors.variationPrice && <p>{errors.variationPrice}</p>}
          </div>

          <div>
            <label htmlFor="variationImage" className="text-right mb-2">
              Image
            </label>
            <Input
              type="file"
              accept="image/*"
              ref={inputFileRef}
              name="variationImage"
              id="variationImage"
              onChange={handleChange}
            />
            {errors.variationImage && <p>{errors.variationImage}</p>}
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit} disabled={loading} variant="default">
              {loading ? "Loading" : "Save"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddVariation;
