import { FunctionComponent, SyntheticEvent, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Tabs, Tab, Box,
} from '@mui/material';
import BanlistContainer from './pages/banlist/Banlist';
import * as Style from './App.styles';
import UseBanlist from './hooks/use-banlist';

const scheduleSrc = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vThbVaHi8eldQlbsxN2gkCSeLfsBr2zER_tFOWWjgjAp91y1l7Gf2DAQaRoCHdhsFvhI9F8mkQLt0yN/pubhtml?widget=true&amp;headers=false';

const App: FunctionComponent = () => {
  const [value, setValue] = useState(0);
  UseBanlist();

  const handleChange = (event: SyntheticEvent, newValue: number): void => {
    setValue(newValue);
  };

  return (
    <Style.AppContainer>
      <Typography style={{
        gridArea: 'title',
      }}
      />
      <AppBar style={{ gridArea: 'appbar' }}>
        <Typography>Progession League</Typography>
        <Toolbar>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Banlist" value={0} />
            <Tab label="Schedule" value={1} />
          </Tabs>
        </Toolbar>
      </AppBar>
      <Box style={{ gridArea: 'body', display: 'flex', justifyContent: 'center' }}>
        {value === 0 && <BanlistContainer />}
        {value === 1 && <Style.Schedule src={scheduleSrc} />}
      </Box>
    </Style.AppContainer>
  );
};

export default App;
