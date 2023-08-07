import { useNavigate } from 'react-router-dom';

export const useQueue = () => {
  const navigate = useNavigate();

  const handleNavigateToSearch = () => {
    navigate('/search');
  };

  return {
    handleNavigateToSearch
  };
};
