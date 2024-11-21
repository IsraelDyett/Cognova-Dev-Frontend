import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Business } from "@prisma/client";

export default function CreateUpdateBusinessForm({
  onSubmit,
  initialData = {},
}: {
  onSubmit: (data: any) => void;
  initialData?: Partial<Business>;
}) {
  const [formData, setFormData] = useState<Business>({
    id: "",
    workspaceId: "",
    name: "",
    type: "",
    description: "",
    hasDelivery: false,
    hasPickup: false,
    acceptsReturns: false,
    hasWarranty: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...initialData,
  } as Business);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Business Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="type">Business Type</Label>
        <Input id="type" name="type" value={formData.type} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasDelivery"
          name="hasDelivery"
          checked={formData.hasDelivery}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, hasDelivery: checked as boolean }))
          }
        />
        <Label htmlFor="hasDelivery">Offers Delivery</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasPickup"
          name="hasPickup"
          checked={formData.hasPickup}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, hasPickup: checked as boolean }))
          }
        />
        <Label htmlFor="hasPickup">Offers Pickup</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="acceptsReturns"
          name="acceptsReturns"
          checked={formData.acceptsReturns}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, acceptsReturns: checked as boolean }))
          }
        />
        <Label htmlFor="acceptsReturns">Accepts Returns</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasWarranty"
          name="hasWarranty"
          checked={formData.hasWarranty}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, hasWarranty: checked as boolean }))
          }
        />
        <Label htmlFor="hasWarranty">Offers Warranty</Label>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
