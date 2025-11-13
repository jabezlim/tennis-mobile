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
      console.log('MACHINES_QUERY', data);
      if (data.machines && data.machines.length > 0) {
        setMachines(data.machines);
        setMachineNames(keyBy(data.machines, 'id'));
        if (!allitem) {
          setMachine(data.machines[0].id);
          handleMachineId(data.machines[0].id, data.machines[0].name, data.machines[0].machine_no);
        }
      }
    },
  });

  const handleChange = (event) => {
    //console.log('event.target.value', event.target.value);
    setMachine(event.target.value);
    handleMachineId(event.target.value);
  };
  const handleMachineId = (id, name, machine_no) => {
    if (handleMachine) {
      if (!name) name = machineNames[id].name;
      if (!machine_no) machine_no = machineNames[id].machine_no;
      handleMachine(id, name, machine_no);
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
