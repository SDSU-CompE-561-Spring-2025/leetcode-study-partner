// export default function Dashboard() {
// 	return <h1>Dashboard Page </h1>;
// }

import DashboardMain from "@/components/Dashboard/DashboardMain";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardMain />
    </div>
  )
}
