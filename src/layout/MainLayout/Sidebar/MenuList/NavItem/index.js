import PropTypes from 'prop-types';
import { forwardRef, useEffect, useState } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
// material
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from '@mui/material';
// icon
import { Icon } from '@iconify/react';
import circle24Filled from '@iconify/icons-fluent/circle-24-filled';
// context
import { useGlobalContext } from 'context';

const NavItem = ({ item, level }) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));
  const { settingMenu } = useGlobalContext();
  // data
  const [active, setActive] = useState(false);

  const itemIcon = item?.icon ? (
    <Icon icon={item.icon} />
  ) : (
    <Icon icon={circle24Filled} width='8' />
  );

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  let listItemProps = {
    component: forwardRef((props, ref) => (
      <Link ref={ref} {...props} to={item.url} target={itemTarget} />
    )),
  };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const itemHandler = () => {
    if (matchesSM) settingMenu('set_menu', false);
  };

  // active menu item on page load
  useEffect(() => {
    if (!!matchPath({ path: item.url, end: false }, pathname)) {
      setActive(true);
    } else {
      setActive(false);
    }
    // eslint-disable-next-line
  }, [pathname]);

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        borderRadius: 3,
        mb: 0.5,
        alignItems: 'flex-start',
        backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
        py: level > 1 ? 1 : 1.25,
        pl: `${level * 24}px`,
      }}
      selected={active}
      onClick={itemHandler}
    >
      <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }}>
        {itemIcon}
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant={active ? 'h5' : 'body1'}
            sx={{
              fontWeight: active ? 700 : 500,
            }}
            color='inherit'
          >
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography
              variant='caption'
              sx={{ ...theme.typography.subMenuCaption }}
              display='block'
              gutterBottom
            >
              {item.caption}
            </Typography>
          )
        }
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
};

export default NavItem;
