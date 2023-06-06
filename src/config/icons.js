import { Box } from '@mui/material';
import { path } from './path';

const IconBox = ({ icon, sx, onClick }) => {
  return (
    <Box
      component='img'
      src={`${path.basename}/images/icon/${icon}.svg`}
      sx={{ cursor: onClick ? 'pointer' : 'default', ...sx }}
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
export const LogoutIcon = ({ color = '', sx = {}, onClick }) => {
  const icon = color === '' ? 'logout' : `logout_${color}`;
  return (
    <IconBox
      icon={icon}
      sx={{ width: 18, height: 18, ...sx }}
      onClick={onClick}
    />
  );
};
export const CloseIcon = ({ color = '', sx = {}, onClick }) => {
  const icon = color === '' ? 'close' : `close_${color}`;
  return (
    <IconBox
      icon={icon}
      sx={{ width: 14, height: 14, ...sx }}
      onClick={onClick}
    />
  );
};
export const CreditCardIcon = ({ color = '', sx = {}, onClick }) => {
  const icon = color === '' ? 'credit_card' : `credit_card_${color}`;
  return (
    <IconBox
      icon={icon}
      sx={{ width: 20, height: 16, ...sx }}
      onClick={onClick}
    />
  );
};
export const CheckIcon = ({ color = '', sx = {}, onClick }) => {
  const icon = color === '' ? 'chekc' : `check_${color}`;
  return (
    <IconBox
      icon={icon}
      sx={{ width: 16.3, height: 12.02, ...sx }}
      onClick={onClick}
    />
  );
};
export const CheckCircleIcon = ({ color = '', sx = {}, onClick }) => {
  const icon = color === '' ? 'check_circle' : `check_circle_${color}`;
  return (
    <IconBox
      icon={icon}
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
export const ChevronLeftIcon = ({ color = '', sx = {}, onClick }) => {
  const icon = color === '' ? 'arrow_back_ios' : `arrow_back_ios_${color}`;
  return (
    <IconBox
      icon={icon}
      sx={{ width: 11.77, height: 20, ...sx }}
      onClick={onClick}
    />
  );
};
export const ChevronRightIcon = ({ color = '', sx = {}, onClick }) => {
  const icon =
    color === '' ? 'arrow_forward_ios' : `arrow_forward_ios_${color}`;
  return (
    <IconBox
      icon={icon}
      sx={{ width: 11.77, height: 20, ...sx }}
      onClick={onClick}
    />
  );
};
export const ChevronUpIcon = ({ color = '', sx = {}, onClick }) => {
  const icon = color === '' ? 'arrow_up_ios' : `arrow_up_ios_${color}`;
  return (
    <IconBox
      icon={icon}
      sx={{ width: 20, height: 11.77, ...sx }}
      onClick={onClick}
    />
  );
};
export const ChevronDownIcon = ({ color = '', sx = {}, onClick }) => {
  const icon = color === '' ? 'arrow_down_ios' : `arrow_down_ios_${color}`;
  return (
    <IconBox
      icon={icon}
      sx={{ width: 20, height: 11.77, ...sx }}
      onClick={onClick}
    />
  );
};
export const EditIcon = ({ color = '', sx = {}, onClick }) => {
  const icon = color === '' ? 'edit' : `edit_${color}`;
  return (
    <IconBox
      icon={icon}
      sx={{ width: 16.95, height: 16.93, ...sx }}
      onClick={onClick}
    />
  );
};
export const CalendarMonthIcon = ({ color = '', sx = {}, onClick }) => {
  const icon = color === '' ? 'calendar_month' : `calendar_month_${color}`;
  return (
    <IconBox
      icon={icon}
      sx={{ width: 18, height: 20, ...sx }}
      onClick={onClick}
    />
  );
};
export const MoreVertIcon = ({ color = '', sx = {}, onClick }) => {
  const icon = color === '' ? 'more_vert' : `more_vert_${color}`;
  return (
    <IconBox
      icon={icon}
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
