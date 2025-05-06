import { useForm } from 'react-hook-form';
import { 
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useSendPasswordResetEmail } from '../../react-query/services/hooks/users/useSendPasswordResetEmail';

const ForgotPassword = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();
  
  const {
    mutate: sendResetEmail,
    isLoading,
    isSuccess,
    error: apiError
  } = useSendPasswordResetEmail();

  const onSubmit = (data) => {
    sendResetEmail(data.email);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'background.paper'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Forgot Password
        </Typography>
        
        {isSuccess ? (
          <Alert severity="success">
            Password reset email sent! Please check your inbox.
          </Alert>
        ) : (
          <>
            <Typography variant="body1" color="text.secondary">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </Typography>

            {apiError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {apiError.message}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              endIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </>
        )}

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link component={RouterLink} to="/" variant="body2">
            Remember your password? Sign in
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;