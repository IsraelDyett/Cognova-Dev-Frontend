import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BusinessProduct as Product } from "@prisma/client";

interface CreateUpdateProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  onSubmit: (product: Partial<Product>) => void;
}

export function CreateUpdateProduct({
  open,
  onOpenChange,
  product,
  onSubmit,
}: CreateUpdateProductProps) {
  const [formData, setFormData] = useState({
    name: product?.name ?? "",
    price: product?.price?.toString() ?? "",
    stock: product?.stock?.toString() ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    });
    onOpenChange(false);
    setFormData({ name: "", price: "", stock: "" });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setFormData({ ...formData, price: value });
    }
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setFormData({ ...formData, stock: value });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Update Product" : "Create New Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              maxLength={100}
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="text"
              inputMode="decimal"
              value={formData.price}
              onChange={handlePriceChange}
              required
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="text"
              inputMode="numeric"
              value={formData.stock}
              onChange={handleStockChange}
              required
              placeholder="0"
            />
          </div>
          <Button type="submit">{product ? "Update" : "Create"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
