import { useState } from "react";
import { addProgram } from "@/entities/program";
import { Program } from "@/entities/program";

export const useAddProgram = () => {
  const [loading, setLoading] = useState(false);

  const handleAddProgram = async (program: Omit<Program, "id">) => {
    setLoading(true);
    try {
      const newProgram = await addProgram(program);
      return newProgram;
    } finally {
      setLoading(false);
    }
  };

  return { handleAddProgram, loading };
};
