import React, { useEffect, useState } from 'react';
import { BanlistContainer } from './pages/Banlist';
import { AppBar, Toolbar, IconButton, Typography, Tabs, Tab, Box } from '@mui/material';
import * as Style from "./App.styles"

const scheduleSrc = "https://docs.google.com/spreadsheets/d/e/2PACX-1vThbVaHi8eldQlbsxN2gkCSeLfsBr2zER_tFOWWjgjAp91y1l7Gf2DAQaRoCHdhsFvhI9F8mkQLt0yN/pubhtml?widget=true&amp;headers=false"

const App = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

  return (
      <Style.AppContainer>
          <Typography style={{
             gridArea:"title"

          }}>aaaa</Typography>
          <AppBar style={{ gridArea: "appbar" }}>
              <Typography>Progession League</Typography>
              <Toolbar>
                  
                  <Tabs value={ value} onChange={handleChange} centered>
                      <Tab label="Banlist" value={0} />
                      <Tab label="Schedule" value={1}/>
                  </Tabs>
              </Toolbar>
          </AppBar>
          <Box style={{
              gridArea: "body", display: "flex", justifyContent:"center"          }}>
              {value == 0 && <BanlistContainer />}
              {value == 1 && <Style.Schedule src={scheduleSrc}      />}
           </Box>
      </Style.AppContainer>
  );
}

export default App;
