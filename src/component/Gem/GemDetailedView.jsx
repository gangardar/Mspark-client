import PropTypes from "prop-types"; // Import PropTypes
import {
  Paper,
  Typography,
  Grid2,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import Logo from "../Logo";
import style from "./css/GemTable.module.css";

const GemDetailedView = ({ gem }) => {
  if (!gem) {
    return <Typography variant="h6">No gem data available.</Typography>;
  }

  // Function to handle printing
  const handlePrint = () => {
    var printContents = document.getElementById("certificate").innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload()
  };

  // Function to handle missing values
  const getValue = (value) =>
    value !== undefined && value !== null ? value : "-";

  return (
    <div id="certificate" className={style.printContainer}>
      <Paper
        sx={{
          p: 4,
          border: "2px solid #000",
          maxWidth: "800px",
          margin: "auto",
          position: "relative",
        }}
      >
        <Logo />
        {/* Print Button */}
        <Box sx={{ textAlign: "right", mb: 2 }}>
          <Button
            variant="contained"
            sx={{
              "@media print": {
                display: "none",
              },
            }}
            onClick={handlePrint}
          >
            Print
          </Button>
        </Box>

        {/* Certification Header */}
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Gem Certification
        </Typography>

        {/* Gem Details */}
        <Grid2 container spacing={3}>
          {/* Left Column */}
          <Grid2 item xs={12} md={6}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell>{getValue(gem.name)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                  <TableCell>{getValue(gem.type)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Color</TableCell>
                  <TableCell>{getValue(gem.color)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Weight (ct)</TableCell>
                  <TableCell>{getValue(gem.weight)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Shape</TableCell>
                  <TableCell>{getValue(gem.shape)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Rarity</TableCell>
                  <TableCell>{getValue(gem.rarity)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid2>

          {/* Right Column */}
          <Grid2 item xs={12} md={6}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Density</TableCell>
                  <TableCell>{getValue(gem.density)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Refractive Index
                  </TableCell>
                  <TableCell>{getValue(gem.refractiveIndex)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Hardness</TableCell>
                  <TableCell>{getValue(gem.hardness)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Transparency
                  </TableCell>
                  <TableCell>{getValue(gem.transparency)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell>{getValue(gem.status)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                  <TableCell>${getValue(gem.price)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid2>
        </Grid2>

        {/* Dimension Section */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Dimensions
          </Typography>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Length (mm)</TableCell>
                <TableCell>{getValue(gem.dimension?.length)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Width (mm)</TableCell>
                <TableCell>{getValue(gem.dimension?.width)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Height (mm)</TableCell>
                <TableCell>{getValue(gem.dimension?.height)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            This is an official certification for the gemstone described above.
          </Typography>
        </Box>
      </Paper>
    </div>
  );
};

// Prop Validation
GemDetailedView.propTypes = {
  gem: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    color: PropTypes.string,
    weight: PropTypes.number,
    shape: PropTypes.string,
    rarity: PropTypes.string,
    density: PropTypes.number,
    refractiveIndex: PropTypes.number,
    hardness: PropTypes.number,
    transparency: PropTypes.string,
    status: PropTypes.string,
    price: PropTypes.number,
    dimension: PropTypes.shape({
      length: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number,
    }),
  }).isRequired,
};

export default GemDetailedView;
