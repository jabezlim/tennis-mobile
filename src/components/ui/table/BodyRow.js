import { TableCell, TableRow } from '@mui/material';

const BodyRow = ({ data, keys }) => {
  return (
    <TableRow>
      {keys &&
        keys.map((tableCell, index) => {
          if (tableCell.fn) {
            return (
              <TableCell
                key={index}
                align={tableCell.alignLeft ? 'left' : 'right'}
              >
                {tableCell.fn(data[tableCell.id])}
              </TableCell>
            );
          } else if (tableCell.cb) {
            return (
              <TableCell
                key={index}
                align={tableCell.alignLeft ? 'left' : 'right'}
                onClick={() => tableCell.cb(data)}
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                {data[tableCell.id]}
              </TableCell>
            );
          }

          return (
            <TableCell
              key={index}
              align={tableCell.alignLeft ? 'left' : 'right'}
            >
              {data[tableCell.id]}
            </TableCell>
          );
        })}
    </TableRow>
  );
};

export default BodyRow;
