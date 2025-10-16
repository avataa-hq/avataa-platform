import { useNavigate, To, NavigateOptions, NavigateFunction } from 'react-router-dom';

export const useAppNavigate = () => {
  const nav = useNavigate();

  const navigate = (to: To, options?: NavigateOptions) => {
    nav(`/${to}`, options);
  };

  return navigate as NavigateFunction;
};
