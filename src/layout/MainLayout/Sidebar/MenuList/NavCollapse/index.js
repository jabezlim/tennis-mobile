import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
// material
import { useTheme } from '@mui/material/styles';
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
// icon
import { Icon } from '@iconify/react';
import chevronUp20Regular from '@iconify/icons-fluent/chevron-up-20-regular';
import chevronDown20Regular from '@iconify/icons-fluent/chevron-down-20-regular';
import circle24Filled from '@iconify/icons-fluent/circle-24-filled';
// project imports
import NavItem from '../NavItem';

const NavCollapse = ({ menu, level }) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  // data
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    setOpen(!open);
    setSelected(!selected);
  };

  // menu collapse & item
  const menus = menu.children?.map((item) => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} />;
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />;
      default:
        return (
          <Typography key={item.id} variant='h6' color='error' align='center'>
            Menu Items Error
          </Typography>
        );
    }
  });

  const menuIcon = menu.icon ? (
    <Icon icon={menu.icon} width='22' />
  ) : (
    <Icon icon={circle24Filled} width='22' />
  );

  // active menu item on page load
  useEffect(() => {
    if (!!matchPath({ path: menu.id, end: false }, pathname)) {
      setOpen(true);
      setSelected(true);
    } else {
      setOpen(false);
      setSelected(false);
    }
    // eslint-disable-next-line
  }, [pathname]);

  return (
    <>
      <ListItemButton
        sx={{
          borderRadius: '12px',
          mb: 0.5,
          alignItems: 'flex-start',
          backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
          py: level > 1 ? 1 : 1.25,
          pl: `${level * 24}px`,
        }}
        selected={selected}
        onClick={handleClick}
      >
        <ListItemIcon sx={{ my: 'auto', minWidth: !menu.icon ? 18 : 36 }}>
          {menuIcon}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              variant={selected ? 'h5' : 'body1'}
              color='inherit'
              sx={{ my: 'auto', fontWeight: selected ? 700 : 500 }}
            >
              {menu.title}
            </Typography>
          }
          secondary={
            menu.caption && (
              <Typography
                variant='caption'
                sx={{ ...theme.typography.subMenuCaption }}
                display='block'
                gutterBottom
              >
                {menu.caption}
              </Typography>
            )
          }
        />
        {open ? (
          <Icon
            icon={chevronUp20Regular}
            width='18'
            style={{ marginTop: '4px' }}
          />
        ) : (
          <Icon
            icon={chevronDown20Regular}
            width='18'
            style={{ marginTop: '4px' }}
          />
        )}
      </ListItemButton>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <List
          component='div'
          disablePadding
          sx={{
            position: 'relative',
            '&:after': {
              content: "''",
              position: 'absolute',
              left: '32px',
              top: 0,
              height: '100%',
              width: '1px',
              opacity: 1,
              background: theme.palette.primary.light,
            },
          }}
        >
          {menus}
        </List>
      </Collapse>
    </>
  );
};

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number,
};

export default NavCollapse;
