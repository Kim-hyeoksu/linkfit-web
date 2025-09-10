import { useState } from "react";
import { addProgram } from "@/entities/program/api/addProgram";
import { Program } from "@/entities/program/model/types";

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
