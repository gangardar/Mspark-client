import {
  Container,
  Typography,
  Box,
  Link,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        MSPARK Privacy Policy
      </Typography>
      <Typography variant="body1">
        Effective Date: {new Date().toLocaleDateString()}
      </Typography>

      <Box sx={{ my: 3 }}>
        <Typography variant="h6" gutterBottom>
          1. Data We Collect
        </Typography>
        <Typography variant="body1">
          - <strong>Account Data:</strong> Name, email, phone, KYC documents.
          <br />- <strong>Gem Data:</strong> Certifications, images,
          specifications.
          <br />- <strong>Payment Data:</strong> Processed via CoinGate (we
          never store full card numbers).
          <br />- <strong>Tracking Data:</strong> Delivery status, carrier info.
        </Typography>
        <ListItem>
          <ListItemText
            primary="Certification Data"
            secondary="Gem spectroscopy reports, microscopic images, and gemologist notes (stored for 5 years for audit purposes)."
          />
        </ListItem>

        {/* Add to the "How We Use Data" section: */}
        <ListItem>
          <ListItemText
            primary="Certification Records"
            secondary="To uphold MSPARK’s gem quality standards and resolve disputes."
          />
        </ListItem>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ my: 3 }}>
        <Typography variant="h6" gutterBottom>
          2. How We Use Data
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="2.1 Gem Verification"
              secondary="To validate gem authenticity using uploaded certificates."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="2.2 Auction Operations"
              secondary="To facilitate bids, payments, and delivery tracking."
            />
          </ListItem>
        </List>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ my: 3 }}>
        <Typography variant="h6" gutterBottom>
          3. GDPR Rights
        </Typography>
        <Typography variant="body1">
          - <strong>Access/Delete:</strong> Request your data via{" "}
          <i>Account Settings</i>.<br />- <strong>Opt-Out:</strong> Unsubscribe
          from marketing emails.
          <br />- <strong>Cookies:</strong> Manage preferences in your browser.
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" color="text.secondary">
        Contact us at{" "}
        <Link href="mailto:privacy@mspark.com">privacy@mspark.com</Link> for
        questions.
      </Typography>
    </Container>
  );
};

export default PrivacyPolicy;
