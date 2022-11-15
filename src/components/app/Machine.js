import { useState } from 'react';
// material
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
// graphql
import { useQuery, useReactiveVar } from '@apollo/client';
import { MACHINES_QUERY } from 'graphql/query';
// helper
import { storeDataVar } from 'helpers/cache';

const Machine = ({
  id,
  sx = {},
  size = 'medium',
  required = false,
  allitem = false,
  handleMachine,
}) => {
  const storeData = useReactiveVar(storeDataVar);
  // data
  const [machine, setMachine] = useState(allitem ? 'all-items' : '');
  const [machines, setMachines] = useState([]);
  // graphql
  useQuery(MACHINES_QUERY, {
    variables: { storeId: id ? id : storeData.id },
    onCompleted: (data) => {
      if (data.clt_machines && data.clt_machines.length > 0) {
        setMachines(data.clt_machines);
        if (!allitem) {
          setMachine(data.clt_machines[0].id);
          handleMachineId(data.clt_machines[0].id);
        }
      }
    },
  });

  const handleChange = (event) => {
    setMachine(event.target.value);
    handleMachineId(event.target.value);
  };
  const handleMachineId = (machineId) => {
    if (handleMachine) handleMachine(machineId);
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <FormControl
        fullWidth
        size={size}
        color='tennis'
        error={required && !machine}
      >
        <InputLabel id='machine-select-label'>
          코트{required && ' *'}
        </InputLabel>
        <Select
          labelId='machine-select-label'
          id='machine-select'
          value={machine}
          label='Court'
          onChange={handleChange}
        >
          {allitem && <MenuItem value='all-items'>모든 코트</MenuItem>}
          {machines.map((machine, index) => (
            <MenuItem value={machine.id} key={index}>
              {machine.name}
            </MenuItem>
          ))}
        </Select>
        {required && !machine && (
          <FormHelperText>코트를 선택해 주세요.</FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};

export default Machine;
