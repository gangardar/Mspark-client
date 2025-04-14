import { Typography } from "@mui/material"
import { PaymentTable } from "../../component/Payment/PaymentTable"

function FailedPayment() {
  return (
    <>
    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
    Failed Payments
    </Typography>
    <PaymentTable paymentStatus="failed"/>
    </>
  )
}

export default FailedPayment