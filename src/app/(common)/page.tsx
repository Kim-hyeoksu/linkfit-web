import {
  GreetingWidget,
  UpcomingScheduleWidget,
  WorkoutStatusWidget,
} from "@/widgets/home";

export default function Home() {
  return (
    <div className="bg-[#f9fafb] min-h-screen pb-24">
      <div className="px-5 pt-12 pb-6">
        <GreetingWidget />
        <UpcomingScheduleWidget />
        <WorkoutStatusWidget />
      </div>
    </div>
  );
}
