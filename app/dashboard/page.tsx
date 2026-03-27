import { getWeakness } from "@/lib/getWeakness";
import { WeaknessChart } from "@/components/WeaknessChart";

const DashboardPage = async () => {
  const data = await getWeakness();

  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        📊 Your Performance Analytics
      </h1>

      <div className="bg-blue-100 rounded-2xl shadow-lg p-6">
      <WeaknessChart data={data} />
      </div>
    </div>
  );
};

export default DashboardPage;