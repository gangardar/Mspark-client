import { Box, Typography, Tabs, Tab} from "@mui/material";
import WalletOperations from "./WalletOperations";
import { useState } from "react";
import { useMspark } from "../../../react-query/services/hooks/mspark/useMspark";
import { LoadingSpinner } from "../../common/LoadingSpinner";
import { EmptyState } from "../../common/EmptyState";
import { ErrorMessage } from "../../common/ErrorMessage";
import MsparkInfoCard from "./MsparkInfoCard";
import AddressCard from "../../User/AddressCard";
import AccountsTable from "./AccountsTable";
import Register from "../../Register";

function MsparkDetails() {
  const [tabValue, setTabValue] = useState(0);
  const { data: mspark, isLoading, isError, error } = useMspark();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTableOnView = (account) => {
    console.log('Edit account:', account);
  }

  if (isLoading) return <LoadingSpinner message="Loading Mspark data.." />;
  if (isError)
    return (
      <ErrorMessage
        message={
          error.response?.data?.message ||
          error?.message ||
          "Something went wrong!"
        }
      />
    );
  if (!mspark || !mspark.data)
    return (
      <EmptyState
        title={"Msaprk is Empty!"}
        description={"Something Went Wrong. Try Refreshing..."}
      />
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mspark Management
      </Typography>

      <MsparkInfoCard mspark={mspark.data} />

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Accounts" />
        <Tab label="Address" />
        <Tab label="Wallet Operations" />
        <Tab label="Add Admin" />
        <Tab label="Settings" />
      </Tabs>

      {tabValue === 0 && <AccountsTable accounts={mspark?.data?.accounts} onView={handleTableOnView}/>}
      {tabValue === 1 && <AddressCard mspark={mspark.data} />}
      {tabValue === 2 && <WalletOperations mspark={mspark.data} />}
      {tabValue === 3 && <Register role="admin"/>}
    </Box>
  );
}

export default MsparkDetails;
