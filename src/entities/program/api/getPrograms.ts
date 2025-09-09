// import axios from "@/shared/api/axios";
import { Program } from "../model/types";

export const getPrograms = async (): Promise<Program[]> => {
  // const { data } = await axios.get<Program[]>("/api/programs");
  const data = [
    {
      id: 1,
      title: "초급자용 프로그램",
      description: "처음 운동하는 사람들을 위한 프로그램입니다.",
      level: "beginner",
    },
  ];
  return data;
};
