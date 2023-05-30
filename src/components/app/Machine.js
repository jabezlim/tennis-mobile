import { keyBy } from 'lodash';
import { useState } from 'react';
// material
import {
  Box,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from '@mui/material';
// graphql
import { useQuery, useReactiveVar } from '@apollo/client';
import { MACHINES_QUERY } from 'graphql/query';
// config
import { selectMenuPaperSX, selectSX } from 'config/styles';
// import { ChevronDownIcon } from 'config/icons';
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
  const [machineNames, setMachineNames] = useState();
  // graphql
  useQuery(MACHINES_QUERY, {
    variables: { storeId: id ? id : storeData.id },
    onCompleted: (data) => {
      if (data.clt_machines && data.clt_machines.length > 0) {
        setMachines(data.clt_machines);
        setMachineNames(keyBy(data.clt_machines, 'id'));
        if (!allitem) {
          setMachine(data.clt_machines[0].id);
          handleMachineId(data.clt_machines[0].id, data.clt_machines[0].name);
        }
      }
    },
  });

  const handleChange = (event) => {
    setMachine(event.target.value);
    handleMachineId(event.target.value);
  };
  const handleMachineId = (id, name) => {
    if (handleMachine) {
      if (!name) name = machineNames[id].name;
      handleMachine(id, name);
    }
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <FormControl
        fullWidth
        size={size}
        color='black'
        error={required && !machine}
      >
        <Select
          labelId='machine-select-label'
          id='machine-select'
          value={machine}
          onChange={handleChange}
          // IconComponent={(props) => (
          //   <ChevronDownIcon
          //     {...props}
          //     sx={{ width: 7.4, height: 12, mr: 2 }}
          //   />
          // )}
          sx={selectSX}
          MenuProps={{
            PaperProps: { sx: selectMenuPaperSX },
          }}
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
