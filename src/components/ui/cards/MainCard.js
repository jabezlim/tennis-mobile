import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// material
import { useTheme } from '@mui/material/styles';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@mui/material';

const cardHeaderSX = {
  px: { xs: 1.5, sm: 3 },
  py: { xs: 2, sm: 3 },
  '& .MuiCardHeader-action': { mr: 0 },
};
const MainCard = forwardRef(
  (
    {
      border = true,
      boxShadow,
      children,
      headerSX = {},
      content = true,
      contentClass = '',
      contentSX = {},
      darkTitle,
      secondary,
      direction = 'row',
      shadow,
      sx = {},
      title,
      ...others
    },
    ref
  ) => {
    const theme = useTheme();
    const secondaryValue =
      direction === 'row'
        ? { action: secondary }
        : {
            subheader: secondary,
            subheaderTypographyProps: { sx: { pt: 1.5 } },
          };

    return (
      <Card
        ref={ref}
        {...others}
        sx={{
          border: border ? '1px solid' : 'none',
          borderColor: theme.palette.primary[200] + 75,
          ':hover': {
            boxShadow: boxShadow
              ? shadow || '0 2px 14px 0 rgb(32 40 45 / 8%)'
              : 'inherit',
          },
          ...sx,
        }}
      >
        {/* card header and action */}
        {!darkTitle && title && (
          <CardHeader
            sx={{ ...cardHeaderSX, ...headerSX }}
            title={title}
            {...secondaryValue}
          />
        )}
        {darkTitle && title && (
          <CardHeader
            sx={{ ...cardHeaderSX, ...headerSX }}
            title={<Typography variant='h3'>{title}</Typography>}
            {...secondaryValue}
          />
        )}

        {/* content & header divider */}
        {title && <Divider />}

        {/* card content */}
        {content && (
          <CardContent
            sx={{ p: { xs: 1.5, sm: 3 }, ...contentSX }}
            className={contentClass}
          >
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  secondary: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.object,
  ]),
  direction: PropTypes.oneOf(['row', 'column']),
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.object,
  ]),
};

export default MainCard;
