import { Box, Card, CardHeader, Divider } from "@mui/material";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { LoadingSpinner } from "../../common/LoadingSpinner";
import useAdminAuction from "../../../react-query/services/hooks/admin/dashboard/useAdminAuction";
import { useEffect, useState } from "react";
import { ErrorMessage } from "../../common/ErrorMessage";

ChartJS.register(...registerables);

export default function ActivityChart() {
  const [data, setData] = useState();
  const { data: fetchAuction, isLoading, isError, error } = useAdminAuction();

  useEffect(() => {
    setData(fetchAuction?.data);
    
  }, [fetchAuction]);
  console.log(data);

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <ErrorMessage
        message={error?.response?.data?.message || "Something Went Wrong"}
      />
    );

  const chartData = {
    labels: data?.timeline.map((item) => item._id),
    datasets: [
      {
        label: "Auctions Created",
        data: data?.timeline.map((item) => item.count),
        borderColor: "#4e73df",
        backgroundColor: "rgba(78, 115, 223, .4)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Auctions Completed",
        data: data?.timeline.map((item) => item.completed),
        borderColor: "#1cc88a",
        backgroundColor: "rgba(28, 200, 138, 0.4)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <Card>
      <CardHeader
        title="Auction Activity"
        subheader="Last 30 Days"
        action={
          <select className="form-select" style={{ width: 120 }}>
            <option>30 Days</option>
            <option>7 Days</option>
            <option>90 Days</option>
          </select>
        }
      />
      <Divider />
      <Box sx={{ p: 3, height: 350 }}>
        <Chart
          type="bar"
          data={chartData}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top" },
            },
            scales: {
              y: { beginAtZero: true },
            },
          }}
        />
      </Box>
    </Card>
  );
}
