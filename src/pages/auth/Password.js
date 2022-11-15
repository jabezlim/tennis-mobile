import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
// material
import { Divider, Grid, Stack, Typography } from '@mui/material';
// components
import Logo from 'components/ui/Logo';
import { PasswordForm } from 'components/page/auth';
// config
import { path } from 'config/path';
// project imports
import AuthWrapper from './AuthWrapper';
import AuthCardWrapper from './AuthCardWrapper';
import AuthFooter from './AuthFooter';

const Password = () => {
  const { storeid } = useParams();
  // data
  const [id, setId] = useState();

  useEffect(() => {
    if (storeid) {
      setId(storeid);
    }
  }, [storeid]);

  return (
    <AuthWrapper>
      <Grid
        container
        direction='column'
        justifyContent='flex-end'
        sx={{ minHeight: '100vh' }}
      >
        <Grid item xs={12}>
          <Grid
            container
            justifyContent='center'
            alignItems='center'
            sx={{ minHeight: 'calc(100vh - 68px)' }}
          >
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid
                  container
                  spacing={2}
                  alignItems='center'
                  justifyContent='center'
                >
                  <Grid item sx={{ mb: 3 }}>
                    <Logo ball />
                  </Grid>
                  <Grid item xs={12}>
                    <PasswordForm />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      item
                      container
                      direction='column'
                      alignItems='center'
                      xs={12}
                    >
                      <Stack direction={'row'} spacing={2}>
                        <Typography
                          component={Link}
                          to={id ? `${path.urls.login}/${id}` : path.urls.login}
                          variant='subtitle1'
                          sx={{ textDecoration: 'none', fontWeight: 700 }}
                        >
                          로그인
                        </Typography>
                        <Divider
                          orientation='vertical'
                          variant='middle'
                          flexItem
                        />
                        <Typography
                          component={Link}
                          to={
                            id
                              ? `${path.urls.register}/${id}`
                              : path.urls.register
                          }
                          variant='subtitle1'
                          sx={{ textDecoration: 'none', fontWeight: 700 }}
                        >
                          회원가입
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default Password;
