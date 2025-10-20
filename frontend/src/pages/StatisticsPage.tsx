import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend
);

type ByMonth = { month: string; count: number };
type TopDisease = { name: string; count: number };
type ByGender = { gender: string; count: number };
type ByAge = { group: string; count: number };

export default function StatisticsPage() {
  const [byMonth, setByMonth] = useState<ByMonth[]>([]);
  const [topDiseases, setTopDiseases] = useState<TopDisease[]>([]);
  const [byGender, setByGender] = useState<ByGender[]>([]);
  const [byAge, setByAge] = useState<ByAge[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/stats/overview/");
      setByMonth(res.data.by_month || []);
      setTopDiseases(res.data.top_diseases || []);
      setByGender(res.data.by_gender || []);
      setByAge(res.data.by_age || []);
    } catch (e) {
      console.error("Błąd ładowania statystyk", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const monthData = {
    labels: byMonth.map(m => m.month),
    datasets: [{
      label: "Diagnozy (miesięcznie)",
      data: byMonth.map(m => m.count),
    }],
  };

  const topDiseaseData = {
    labels: topDiseases.map(d => d.name),
    datasets: [{
      label: "Top 5 chorób",
      data: topDiseases.map(d => d.count),
    }],
  };

  const genderData = {
    labels: byGender.map(g => g.gender || "unknown"),
    datasets: [{
      label: "Wizyty wg płci",
      data: byGender.map(g => g.count),
    }],
  };

  const ageData = {
    labels: byAge.map(a => a.group),
    datasets: [{
      label: "Wizyty wg wieku",
      data: byAge.map(a => a.count),
    }],
  };

  if (loading) return <div className="text-gray-500">Ładowanie…</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Statystyki</h1>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Diagnozy w czasie (miesiące)</h3>
          <Line data={monthData} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Top chorób</h3>
          <Bar data={topDiseaseData} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Wg płci</h3>
          <Bar data={genderData} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Wg grup wiekowych</h3>
          <Bar data={ageData} />
        </div>
      </div>
    </div>
  );
}
