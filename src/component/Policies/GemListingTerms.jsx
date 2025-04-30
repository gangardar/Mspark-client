import { Container, Typography, Box, Link, List, ListItem, ListItemText } from '@mui/material';

const GemListingTerms = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        MSPARK Gem Certification & Listing Terms
      </Typography>
      <Typography variant="body1" color="error">
        By listing a gem, you agree to MSPARK’s certification process and these terms.
      </Typography>

      {/* Section 1: MSPARK Certification */}
      <Box sx={{ my: 3 }}>
        <Typography variant="h6" gutterBottom>
          1. MSPARK Certification Process
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="1.1 Certification Authority"
              secondary="MSPARK certifies gems through in-house gemologists using advanced tools (e.g., spectrometers, microscopes)."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="1.2 Certification Validity"
              secondary={
                <>
                  Certificates are valid for <strong>2 years</strong>. Re-certification may require physical inspection. 
                  View <Link href="/certification-standards">MSPARK’s Grading Standards</Link>.
                </>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="1.3 Liability"
              secondary="MSPARK guarantees certification accuracy but is not liable for market value fluctuations or buyer misuse."
            />
          </ListItem>
        </List>
      </Box>

      {/* Section 2: Dispute Resolution */}
      <Box sx={{ my: 3 }}>
        <Typography variant="h6" gutterBottom>
          2. Disputes & Re-Certification
        </Typography>
        <Typography variant="body1">
          - Buyers may request re-certification within <strong>7 days</strong> of delivery (fee applies).<br />
          - Fraudulent listings result in <strong>account termination</strong> and legal action.<br />
          - Disputes are resolved via MSPARK’s arbitration process.
        </Typography>
      </Box>

      {/* Rest remains similar to previous example */}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        Contact <Link href="mailto:certifications@mspark.com">certifications@mspark.com</Link> for certification queries.
      </Typography>
    </Container>
  );
};

export default GemListingTerms