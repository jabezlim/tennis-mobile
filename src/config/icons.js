import { Box } from '@mui/material';
import { path } from './path';
import { ICON_COLOR_CSS } from './constants';

const IconBox = ({ icon, sx, onClick, filter }) => {
  return (
    <Box
      component='img'
      src={`${path.basename}/images/icon/${icon}.svg`}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        filter: filter ? filter : ICON_COLOR_CSS.default,
        ...sx,
      }}
      onClick={onClick}
    />
  );
};

export const TennisSquadIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='tennis_squad'
      sx={{ width: 190, height: 22, ...sx }}
      onClick={onClick}
    />
  );
};
export const ShoppingCartIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='shopping_cart'
      sx={{ width: 19.98, height: 20, ...sx }}
      onClick={onClick}
    />
  );
};
export const PersonIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='person'
      sx={{ width: 20, height: 20, ...sx }}
      onClick={onClick}
    />
  );
};
export const AccountOffIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='account_circle_off'
      sx={{ width: 21.33, height: 21.3, ...sx }}
      onClick={onClick}
    />
  );
};
export const LogoutIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='logout'
      sx={{ width: 18, height: 18, ...sx }}
      onClick={onClick}
    />
  );
};
export const CloseIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='close'
      sx={{ width: 14, height: 14, ...sx }}
      onClick={onClick}
    />
  );
};
export const CreditCardIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='credit_card'
      sx={{ width: 20, height: 16, ...sx }}
      onClick={onClick}
    />
  );
};
export const CheckIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='check'
      sx={{ width: 16.3, height: 12.02, ...sx }}
      onClick={onClick}
    />
  );
};
export const CheckCircleIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='check_circle'
      sx={{ width: 20, height: 20, ...sx }}
      onClick={onClick}
    />
  );
};
export const ArrowBackIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='arrow_back'
      sx={{ width: 16, height: 16, ...sx }}
      onClick={onClick}
    />
  );
};
export const ChevronLeftIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='arrow_back_ios'
      sx={{ width: 11.77, height: 20, ...sx }}
      onClick={onClick}
      filter={ICON_COLOR_CSS.black}
    />
  );
};
export const ChevronRightIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='arrow_forward_ios'
      sx={{ width: 11.77, height: 20, ...sx }}
      onClick={onClick}
      filter={ICON_COLOR_CSS.black}
    />
  );
};
export const ChevronUpIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='arrow_up_ios'
      sx={{ width: 20, height: 11.77, ...sx }}
      onClick={onClick}
      filter={ICON_COLOR_CSS.black}
    />
  );
};
export const ChevronDownIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='arrow_down_ios'
      sx={{ width: 20, height: 11.77, ...sx }}
      onClick={onClick}
      filter={ICON_COLOR_CSS.black}
    />
  );
};
export const EditIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='edit'
      sx={{ width: 16.95, height: 16.93, ...sx }}
      onClick={onClick}
    />
  );
};
export const CalendarMonthIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='calendar_month'
      sx={{ width: 18, height: 20, ...sx }}
      onClick={onClick}
    />
  );
};
export const MoreVertIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='more_vert'
      sx={{ width: 4, height: 16, ...sx }}
      onClick={onClick}
    />
  );
};
export const VisibilityOffIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='visibility_off'
      sx={{ width: 22, height: 19.8, ...sx }}
      onClick={onClick}
    />
  );
};
export const VisibilityIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='visibility'
      sx={{ width: 22, height: 15, ...sx }}
      onClick={onClick}
    />
  );
};
export const HomeIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='home'
      sx={{ width: 24, height: 24, ...sx }}
      onClick={onClick}
    />
  );
};
export const BookIcon = ({ sx, onClick }) => {
  return (
    <IconBox
      icon='booking'
      sx={{ width: 21.3, height: 19.65, ...sx }}
      onClick={onClick}
    />
  );
};
export const TicketIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='ticket'
      sx={{ width: 20, height: 16, ...sx }}
      onClick={onClick}
    />
  );
};
export const LessonIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='lesson'
      sx={{ width: 20, height: 22.07, ...sx }}
      onClick={onClick}
    />
  );
};
export const FavoriteIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='favorite'
      sx={{ width: 20, height: 18.35, ...sx }}
      onClick={onClick}
    />
  );
};
export const GradeIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='grade'
      sx={{ width: 20, height: 19, ...sx }}
      onClick={onClick}
    />
  );
};
export const EventAvailableIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='event_available'
      sx={{ width: 18, height: 20, ...sx }}
      onClick={onClick}
    />
  );
};
export const VideoIcon = ({ sx = {}, onClick }) => {
  return (
    <IconBox
      icon='smart_display'
      sx={{ width: 20, height: 16, ...sx }}
      onClick={onClick}
    />
  );
};
