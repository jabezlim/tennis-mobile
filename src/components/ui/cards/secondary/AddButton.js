import { Link } from 'react-router-dom';
// material
import { Button, IconButton, useMediaQuery } from '@mui/material';
// icon
import { Icon } from '@iconify/react';
import add20Regular from '@iconify/icons-fluent/add-20-regular';
import addSquareMultiple20Regular from '@iconify/icons-fluent/add-square-multiple-20-regular';

const AddButton = ({ title = '등록하기', url = '/' }) => {
  const matchXS = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return (
    <>
      {!matchXS && (
        <Button
          fullWidth
          variant='outlined'
          color='tennis'
          component={Link}
          to={url}
          startIcon={<Icon icon={add20Regular} width='16' />}
          sx={{ borderRadius: 5 }}
        >
          {title}
        </Button>
      )}
      {matchXS && (
        <IconButton color='tennis' component={Link} to={url}>
          <Icon icon={addSquareMultiple20Regular} width='30' />
        </IconButton>
      )}
    </>
  );
};

export default AddButton;
