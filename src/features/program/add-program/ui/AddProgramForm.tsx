"use client";

import React, { useState } from "react";
import { useAddProgram } from "../";

export const AddProgramForm = ({ onAdded }: { onAdded: () => void }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [level, setLevel] = useState("beginner");
  const { handleAddProgram, loading } = useAddProgram();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAddProgram({ title, description: desc, level });
    setTitle("");
    setDesc("");
    setLevel("beginner");
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
        onChange={(e) => setLevel(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "추가 중..." : "추가하기"}
      </button>
    </form>
  );
};
