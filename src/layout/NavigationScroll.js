import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// util
import { scrollToTop } from 'utils/util';

const NavigationScroll = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  return children || null;
};

NavigationScroll.propTypes = {
  children: PropTypes.node,
};

export default NavigationScroll;
