import { CatchingPokemon } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";

const Logo = () => {
  return (
    <>
      <IconButton size="large" edge="start" color="inherit" aria-label="logo">
        <CatchingPokemon />
      </IconButton>
      <Typography component="a" href="/" variant="h5" sx={{ flexGrow: 1, textDecoration:'none' }}>
        Mspark
      </Typography>
    </>
  );
};

export default Logo;
