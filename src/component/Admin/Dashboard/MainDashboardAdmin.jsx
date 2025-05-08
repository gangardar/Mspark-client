import { Grid2 } from "@mui/material";
import useAdminSummary from "../../../react-query/services/hooks/admin/dashboard/useAdminSummary";
import ActivityChart from "./ActivityChart";
import { ErrorMessage } from "../../common/ErrorMessage";
import SummaryCard from "../../Dashboard/SummaryCard";
import TopPerformers from "./TopPerformers";
import { LoadingSpinner } from "../../common/LoadingSpinner";
import { useEffect, useState } from "react";
import { AttachMoney, Bolt, Gavel, Person } from "@mui/icons-material";

export default function MainDashboardAdmin() {
  const [data, setData] = useState();
  const { data: fetchSummary, isLoading, error } = useAdminSummary();

  useEffect(() => {
    setData(fetchSummary?.data);
  }, [fetchSummary]);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <ErrorMessage
        message={error?.response?.data?.message || "Something went Wrong!"}
      />
    );

  return (
    <Grid2 container spacing={4}>
      {/* Summary Cards */}

      <Grid2 size={{ xs: 12, md: 4 }}>
        <SummaryCard
          title="Total Auctions"
          value={data?.auctions?.total || 0}
          icon={<Gavel/>}
          color="#4e73df"
        />
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <SummaryCard
          title="Active Auctions"
          value={data?.auctions?.active || 0}
          icon={<Bolt/>}
          color="#1cc88a"
        />
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <SummaryCard
          title="Completed Auction"
          value={data?.auctions?.completed}
          icon={<Person/>}
          color="#36b9cc"
        />
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <SummaryCard
          title="Total User"
          value={data?.users?.total}
          icon={<Person/>}
          color="#36b9cc"
        />
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <SummaryCard
          title="Total Revenue"
          value={`$${data?.revenue?.totalRevenue}`}
          icon={<AttachMoney/>}
          color="#36b9cc"
        />
      </Grid2>

      {/* Charts */}
      <Grid2 size={{ xs: 12, lg: 8 }}>
        <ActivityChart />
      </Grid2>

      {/* Top Performers */}
      <Grid2 size={{ xs: 12, lg: 4 }}>
        <TopPerformers />
      </Grid2>
    </Grid2>
  );
}
