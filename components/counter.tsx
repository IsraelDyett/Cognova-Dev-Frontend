"use client";

import { useState } from "react";
import { Button } from "@nextui-org/button";

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <Button
      color="primary"
      isLoading
      spinnerPlacement="end"
      onPress={() => setCount(count + 1)}
    >
      Count {count}
    </Button>
  );
};
