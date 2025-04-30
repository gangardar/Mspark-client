import { 
  Container, 
  Typography, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  List, 
  ListItem, 
  ListItemIcon, 
  Link, 
  Chip, 
  ListItemText
} from '@mui/material';
import { 
  ExpandMore, 
  Verified, 
  Science, 
  Receipt, 
  Gavel, 
  ContactSupport 
} from '@mui/icons-material';

const CertificationGuide = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
        MSPARK Gem Certification Guide
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        How we ensure the authenticity and quality of every gem on our platform.
      </Typography>

      {/* Certification Process Overview */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          <Verified sx={{ verticalAlign: 'middle', mr: 1 }} />
          Our 4-Step Certification Process
        </Typography>
        <List>
          {[
            "Submission Review: Merchant uploads some gem details and at least one high-resolution media.",
            "Merchant send it to company and update in the system as well.",
            "In-House Lab Analysis: MSPARK gemologists inspect physical properties.",
            "Grading: Gems are rated using MSPARK's proprietary standards (MSK-AA to MSK-AAA+).",
            "Certification Issuance: Digital certificate with unique ID generated."
          ].map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon>{index + 1}.</ListItemIcon>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Technical Standards Accordion */}
      <Typography variant="h5" gutterBottom sx={{ mt: 6 }}>
        <Science sx={{ verticalAlign: 'middle', mr: 1 }} />
        Inspection Methods
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="bold">Spectroscopic Analysis</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            We use Raman spectroscopy to detect synthetic treatments or lab-grown stones. 
            Natural gems will show characteristic peaks (e.g., 1332 cm⁻¹ for diamonds).
          </Typography>
          <Chip label="Example Report" variant="outlined" sx={{ mt: 2 }} onClick={() => window.open('/sample-spectroscopy-report.pdf')} />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="bold">Microscopic Examination</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            60x magnification to identify inclusions, cutting artifacts, or fracture fillings.
            <Box component="ul" sx={{ pl: 4, mt: 1 }}>
              <li><strong>Natural inclusions:</strong> Acceptable (e.g., rutile needles in sapphires)</li>
              <li><strong>Treatments:</strong> Must be disclosed (e.g., heat, diffusion)</li>
            </Box>
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Grading Scale */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          <Receipt sx={{ verticalAlign: 'middle', mr: 1 }} />
          MSPARK Grading Scale
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, 
          gap: 2 
        }}>
          {[
            { grade: 'MSK-AAA+', desc: 'Exceptional brilliance, no visible inclusions' },
            { grade: 'MSK-AAA', desc: 'Premium quality, minor inclusions under 10x' },
            { grade: 'MSK-AA', desc: 'Commercial grade, eye-clean' }
          ].map((item) => (
            <Box key={item.grade} border={1} p={2} borderRadius={2}>
              <Typography variant="h6">{item.grade}</Typography>
              <Typography variant="body2">{item.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Dispute Resolution */}
      <Box sx={{ my: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          <Gavel sx={{ verticalAlign: 'middle', mr: 1 }} />
          Dispute Resolution
        </Typography>
        <Typography paragraph>
          If a buyer contests certification:
        </Typography>
        <List dense>
          <ListItem>1. Buyer submits re-evaluation request within 7 days</ListItem>
          <ListItem>2. MSPARK conducts blind re-test (fee may apply)</ListItem>
          <ListItem>3. If discrepancy found: Full refund + seller penalty</ListItem>
        </List>
      </Box>

      {/* CTA */}
      <Box textAlign="center" sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom>
          <ContactSupport sx={{ verticalAlign: 'middle', mr: 1 }} />
          Questions?
        </Typography>
        <Typography>
          Contact our gemology team at <Link href="mailto:gemlab@mspark.com">gemlab@mspark.com</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default CertificationGuide;