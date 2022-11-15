import { TableCell, TableHead, TableRow } from '@mui/material';

const HeadCell = ({ labels }) => {
  return (
    <TableHead>
      <TableRow>
        {labels &&
          labels.map((headCell, index) => (
            <TableCell
              key={index}
              align={headCell.alignLeft ? 'left' : 'right'}
              sx={{ fontWeight: 700 }}
            >
              {headCell.label}
            </TableCell>
          ))}
      </TableRow>
    </TableHead>
  );
};

export default HeadCell;
