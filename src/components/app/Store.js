import { useEffect, useState } from 'react';
import { keyBy } from 'lodash';
// material
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
// graphql
import { useQuery } from '@apollo/client';
import { STORES_QUERY } from 'graphql/query';
// config
import { selectMenuPaperSX, selectSX } from 'config/styles';
// import { ChevronDownIcon } from 'config/icons';

const Store = ({
  storeId,
  sx = {},
  size = 'medium',
  required = false,
  allitem = false,
  disabled = false,
  handleStore,
}) => {
  // data
  const [store, setStore] = useState(allitem ? 'all-items' : '');
  const [stores, setStores] = useState([]);
  const [storeNames, setStoreNames] = useState();

  useQuery(STORES_QUERY, {
    onCompleted: (data) => {
      if (data.clt_stores && data.clt_stores.length > 0) {
        setStores(data.clt_stores);
        setStoreNames(keyBy(data.clt_stores, 'id'));
      }
    },
  });

  useEffect(() => {
    if (stores && storeNames && !allitem) {
      let id = stores[0].id;
      if (storeId) id = storeId;
      if (storeId !== '0') setStore(id);
      handleStoreData(id);
    }
    // eslint-disable-next-line
  }, [stores, storeNames, allitem, storeId]);

  const handleChange = (event) => {
    setStore(event.target.value);
    handleStoreData(event.target.value);
  };

  const handleStoreData = (id) => {
    if (handleStore && id !== '0') {
      const name = storeNames[id].name;
      handleStore(id, name);
    }
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      { storeId && storeNames ? (
        <Typography sx={{ 
            fontWeight: 700,
            fontSize: 20, 
            textAlign: 'center' 
          }}
        >
          { storeNames[storeId].name }
        </Typography>
      ) : (
        <FormControl
          fullWidth
          color='black'
          size={size}
          error={required && !store}
          disabled={disabled}
        >
          <InputLabel id='store-select-label' color='primary'>
            지점명을 꼭 확인해 주세요{required && ' *'}
          </InputLabel>
          <Select
            labelId='store-select-label'
            id='store-select'
            value={store}
            label='지점명을 꼭 확인해 주세요'
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
            {allitem && <MenuItem value='all-items'>모든 지점</MenuItem>}
            {stores.map((store, index) => (
              <MenuItem value={store.id} key={index}>
                {store.name}
              </MenuItem>
            ))}
          </Select>
          {required && !store && (
            <FormHelperText>지점를 선택해 주세요.</FormHelperText>
          )}
        </FormControl>
      )}
    </Box>
  );
};

export default Store;
