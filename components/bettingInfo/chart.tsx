import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styles from "./bettingInfo.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

interface LineProps {
  data: ChartData<"doughnut">;
}

export default function PieChart({ data }: LineProps) {
  return (
    <div className={styles.chart_container}>
      <Doughnut
        style={{ margin: "5px auto" }}
        data={data}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
}
