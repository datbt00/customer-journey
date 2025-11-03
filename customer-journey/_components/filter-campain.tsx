"use client";
import { Select } from "@/components/ui/select/select";
import { useState } from "react";

const FilterCampaign = () => {
  const [value] = useState<string>("rolls_royce_phantom_extended");

  return (
    <div className="bg-[#FFFFFF]">
      <Select
        options={[
          {
            label: "Rolls-Royce Phantom Extended Wheelbase",
            value: "rolls_royce_phantom_extended",
          },
          {
            label: "Honda",
            value: "honda",
          },
          {
            label: "Ford",
            value: "ford",
          },
          {
            label: "Chevrolet",
            value: "chevrolet",
          },
          {
            label: "Nissan",
            value: "nissan",
          },
          {
            label: "BMW",
            value: "bmw",
          },
          {
            label: "Mercedes-Benz",
            value: "mercedes_benz",
          },
        ]}
        value={value}
      />
    </div>
  );
};

export default FilterCampaign;
