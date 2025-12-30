import { useState } from "react";
import { addProgram } from "@/entities/program";
import { Program } from "@/entities/program";

export const useAddProgram = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleAddProgram = async (program: Omit<Program, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const newProgram = await addProgram(program);
      return newProgram;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { handleAddProgram, loading, error };
};
