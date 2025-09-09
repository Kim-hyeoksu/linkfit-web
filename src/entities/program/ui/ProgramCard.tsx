import { Program } from "../model/types";

export default function ProgramCard({
  id,
  title,
  description,
  level,
}: Program) {
  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <span className="text-xs text-gray-500">레벨: {level}</span>
    </div>
  );
}
