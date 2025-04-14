import { Typography } from '@mui/material'
import { PaymentTable } from '../../component/Payment/PaymentTable'

function PendingPayment() {
  return (
    <>
    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Pending Payments
      </Typography>
      <PaymentTable paymentStatus='pending'/>
    </>
  )
}

export default PendingPayment