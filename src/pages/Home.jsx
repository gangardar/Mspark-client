import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid2,
} from "@mui/material";
import Footer from "../component/Footer";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      {/* Hero Section with Background Image */}
      <Box
        sx={{
          backgroundImage: "url(src/resources/Ruby-Jade-Market-Myanmar.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "start",
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "#fff",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backgroundBlendMode: "multiply",
        }}
      >
        <Typography
          color="white"
          variant="h2"
          sx={{ fontSize: "48px", fontWeight: "bold", marginBottom: "20px" }}
        >
          Welcome to Ruby & Jade Market
        </Typography>
        <Typography
          variant="h5"
          sx={{ fontSize: "24px", whiteSpace: "pre-line", mb: 4 }}
        >
          Discover the finest gems from Myanmar
        </Typography>

        {/* Add role selection buttons */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Button
            variant="contained"
            sx={{
              py: { xs: 0.5, md: 1.5 }, // Vertical padding
              px: { xs: 2, md: 4 }, // Horizontal padding
              fontSize: { xs: "0.875rem", md: "1.125rem" },
            }}
            component={Link}
            to="?role=bidder"
          >
            Join as Bidder
          </Button>
          <Button
            variant="outlined"
            size={"large"}
            sx={{
              py: { xs: 0.5, md: 1.5 }, // Vertical padding
              px: { xs: 2, md: 4 }, // Horizontal padding
              fontSize: { xs: "0.875rem", md: "1.125rem" },
              color: "white", borderColor: "white" 
            }}
            component={Link}
            to="?role=merchant"
          >
            Register as Merchant
          </Button>
        </Box>
      </Box>

      {/* Auctions Section */}
      <Container sx={{ padding: "50px 20px", textAlign: "center" }}>
        <Typography
          variant="h3"
          sx={{ fontSize: "36px", marginBottom: "40px" }}
        >
          Featured Auctions
        </Typography>
        <Grid2 container spacing={4} justifyContent="center">
          {/* Auction Card 1 */}
          <Grid2 xs={12} sm={6} md={4}>
            <Card
              sx={{ maxWidth: 280, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            >
              <CardMedia
                component="img"
                height="200"
                image="src/resources/ruby1.jpeg"
                alt="Ruby 1"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Exquisite Ruby
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  A stunning ruby with deep red hues.
                </Typography>
              </CardContent>
              <Button variant="outlined" sx={{ margin: "10px" }}>
                Bid Now
              </Button>
            </Card>
          </Grid2>

          {/* Auction Card 2 */}
          <Grid2 xs={12} sm={6} md={4}>
            <Card
              sx={{ maxWidth: 345, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            >
              <CardMedia
                component="img"
                height="200"
                image="src/resources/jade1.jpeg"
                alt="Jade 1"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Luminous Jade
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  A beautiful piece of jade with a rich green color.
                </Typography>
              </CardContent>
              <Button variant="outlined" sx={{ margin: "10px" }}>
                Bid Now
              </Button>
            </Card>
          </Grid2>

          {/* Auction Card 3 */}
          <Grid2 xs={12} sm={6} md={4}>
            <Card
              sx={{ maxWidth: 280, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            >
              <CardMedia
                component="img"
                height="200"
                image="src/resources/ruby2.jpeg"
                alt="Ruby 2"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Rare Ruby
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  A rare ruby with exceptional clarity.
                </Typography>
              </CardContent>
              <Button variant="outlined">Bid Now</Button>
            </Card>
          </Grid2>
        </Grid2>
      </Container>
      {/* Role Selection Section */}
      <Container sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h3" sx={{ mb: 4 }}>
          Join Our Community
        </Typography>

        <Grid2 container spacing={4} justifyContent="center">
          {/* Bidder Card */}
          <Grid2 xs={12} md={6} flexDirection={"column"}>
            <Card sx={{ p: 3, height: "100%" }}>
              <Typography variant="h5" gutterBottom>
                Become a Bidder
              </Typography>
              <Typography sx={{ mb: 3 }}>
                Participate in auctions and discover rare gems. Perfect for
                collectors and enthusiasts.
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="?role=bidder"
              >
                Register as Bidder
              </Button>
            </Card>
          </Grid2>

          {/* Merchant Card */}
          <Grid2 xs={12} md={6}>
            <Card sx={{ p: 3, height: "100%" }}>
              <Typography variant="h5" gutterBottom>
                Become a Merchant
              </Typography>
              <Typography sx={{ mb: 3 }}>
                List your gems and reach international buyers. For professional
                gem traders.
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="?role=merchant"
              >
                Register as Merchant
              </Button>
            </Card>
          </Grid2>
        </Grid2>
      </Container>
      <Footer />
    </>
  );
};

export default Home;
