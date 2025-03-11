import { Container, Box, Typography, Button, Card, CardContent, CardMedia, Grid2 } from '@mui/material';
import Footer from '../component/Footer';

const Home = () => {
  return (
    <>
      {/* Hero Section with Background Image */}
      <Box
        sx={{
          backgroundImage: 'url(src/resources/Ruby-Jade-Market-Myanmar.jpeg)', // Add your image path here
          backgroundSize: 'cover', // Ensure the image covers the entire section
          backgroundPosition: 'start', // Center the image
          height: '70vh', // Set a fixed height for the hero section
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: '#fff', // Text color for better contrast
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay to improve text readability
          backgroundBlendMode: 'multiply', // Blend the overlay with the background image
        }}
      >
        <Typography color='white' variant="h2" sx={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
          Welcome to Ruby & Jade Market
        </Typography>
        <Typography variant="h5" sx={{ fontSize: '24px', whiteSpace: 'pre-line' }}>
          Discover the finest gems from Myanmar
        </Typography>
      </Box>

      {/* Auctions Section */}
      <Container sx={{ padding: '50px 20px', textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontSize: '36px', marginBottom: '40px' }}>
          Featured Auctions
        </Typography>
        <Grid2 container spacing={4} justifyContent="center">
          {/* Auction Card 1 */}
          <Grid2 item xs={12} sm={6} md={4}>
            <Card sx={{ maxWidth: 280, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
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
              <Button variant='outlined' sx={{ margin: '10px'}}>
                Bid Now
              </Button>
            </Card>
          </Grid2>

          {/* Auction Card 2 */}
          <Grid2 item xs={12} sm={6} md={4}>
            <Card sx={{ maxWidth: 345, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
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
              <Button variant='outlined' sx={{ margin: '10px'}}>
                Bid Now
              </Button>
            </Card>
          </Grid2>

          {/* Auction Card 3 */}
          <Grid2 item xs={12} sm={6} md={4}>
            <Card sx={{ maxWidth: 280, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
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
              <Button variant='outlined' >
                Bid Now
              </Button>
            </Card>
          </Grid2>
        </Grid2>
      </Container>
      <Footer/>
    </>
  );
};

export default Home;