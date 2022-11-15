import { Link } from 'react-router-dom';
// material
import { useTheme } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
// icon
import { Icon } from '@iconify/react';
import chevronRightFill from '@iconify/icons-eva/chevron-right-fill';

const Breadcrumbs = ({ navigations = [] }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        mb: { xs: '10px', md: '16px' },
        border: '1px solid',
        borderColor: theme.palette.primary[200] + 75,
        background: theme.palette.background.default,
      }}
    >
      <MuiBreadcrumbs
        sx={{
          p: 2,
          '& .MuiBreadcrumbs-separator': {
            mx: 1,
          },
        }}
        aria-label='breadcrumb'
        separator={<Icon icon={chevronRightFill} />}
      >
        {navigations &&
          navigations.map((navigation, index) => {
            if (navigation.url) {
              return (
                <Typography
                  component={Link}
                  to={navigation.url}
                  variant='subtitle1'
                  sx={{
                    color: 'grey.900',
                    textDecoration: 'none',
                  }}
                  key={index}
                >
                  {navigation.label}
                </Typography>
              );
            }
            if (navigation.fn) {
              return (
                <Typography
                  component={Link}
                  to='#'
                  variant='subtitle1'
                  sx={{
                    color: 'grey.900',
                    textDecoration: 'none',
                  }}
                  onClick={navigation.fn}
                  key={index}
                >
                  {navigation.label}
                </Typography>
              );
            }
            return (
              <Typography
                variant='subtitle1'
                sx={{ color: 'grey.500' }}
                key={index}
              >
                {navigation.label}
              </Typography>
            );
          })}
      </MuiBreadcrumbs>
    </Card>
  );
};

export default Breadcrumbs;
