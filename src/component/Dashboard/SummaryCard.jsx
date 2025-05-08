import { Card, CardContent, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const StyledCard = styled(Card)(({ theme, color }) => ({
  borderLeft: `4px solid ${color}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const IconAvatar = styled(Avatar)(({ theme, color }) => ({
    ...theme,
  backgroundColor: color,
  width: 48,
  height: 48,
}));

export default function SummaryCard({ title, value, icon, color }) {
  return (
    <StyledCard color={color}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
      <IconAvatar color={color}>
        {icon}
      </IconAvatar>
    </StyledCard>
    
  );
}

SummaryCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    icon: PropTypes.any,
    color: PropTypes.string.isRequired
}