"use client";

import React, { useState, useEffect } from "react";
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

const EditVariation = ({ variation }: any) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    setFormData,
    setErrors,
    setLoading,
    updateVariation,
    formData,
    errors,
    loading,
  } = useFormStore();

  useEffect(() => {
    if (dialogOpen) {
      setFormData({
        variationName: variation.name,
        variationPrice: variation.price,
        variationImage: null,
      });
      setErrors({
        variationName: "",
        variationPrice: "",
        variationImage: "",
      });
    }
  }, [dialogOpen]);

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

  const handleChange = (e: any) => {
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
        const updatedVariation = {
          ...variation,
          name: formData.variationName,
          price: formData.variationPrice,
          image: formData.variationImage
            ? URL.createObjectURL(formData.variationImage)
            : variation.image,
        };
        updateVariation(updatedVariation);
        setDialogOpen(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit variation</DialogTitle>
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

export default EditVariation;
