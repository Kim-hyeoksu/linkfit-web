"use client";

import React, { useState } from "react";
import { useAddProgram } from "../";

export const AddProgramForm = ({ onAdded }: { onAdded: () => void }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [level, setLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">(
    "BEGINNER",
  );
  const { handleAddProgram, loading } = useAddProgram();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAddProgram({
      categoryId: 0,
      programName: title,
      description: desc,
      level,
      programType: "PERSONAL",
      status: "DRAFT",
      plans: [],
    });
    setTitle("");
    setDesc("");
    setLevel("BEGINNER");
    onAdded(); // 리스트 갱신 트리거
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 p-3 border rounded-md"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="프로그램 이름"
        className="border p-2 rounded"
      />
      <input
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="설명"
        className="border p-2 rounded"
      />
      <select
        value={level}
        onChange={(e) =>
          setLevel(e.target.value as "BEGINNER" | "INTERMEDIATE" | "ADVANCED")
        }
        className="border p-2 rounded"
      >
        <option value="BEGINNER">Beginner</option>
        <option value="INTERMEDIATE">Intermediate</option>
        <option value="ADVANCED">Advanced</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "추가 중..." : "추가하기"}
      </button>
    </form>
  );
};
