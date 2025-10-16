import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import { ErrorPage } from '../errorPage';

interface IProps {
  errorMessage?: string;
  pathToMainPage?: string;
  code?: string;
}

export const NotFoundPage = ({
  errorMessage = 'Page not found',
  pathToMainPage = '/',
  code = '404',
}: IProps) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ErrorPage error={{ message: errorMessage, code }} />
      <Button onClick={() => navigate(pathToMainPage)}>Back to main</Button>
    </div>
  );
};
