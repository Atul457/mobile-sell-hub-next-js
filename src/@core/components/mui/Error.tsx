import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled error message container
const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontWeight: 500,
  marginTop: theme.spacing(0.5),
  fontSize: theme.typography.caption.fontSize,
}));

interface ErrorProps {
  message?: string | null;
  visible?: boolean;
}

const Error: React.FC<ErrorProps> = ({ message, visible = true }) => {
  if (!message || !visible) return null;

  return <ErrorText role="alert">{message}</ErrorText>;
};

export default Error;
