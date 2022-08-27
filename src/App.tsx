import React, { useEffect } from 'react';
import { BanlistContainer } from './pages/Banlist';
import { AppBar } from '@mui/material';
import * as Style from "./App.styles"
import { GenerateBanlist } from './handlers/banlistHandler';
import { useAppSelector } from './hooks/hooks';
import { selectBanlist } from './store/slices/banlistSlice';

const App = () => {
  return (
      <Style.AppContainer>
          <AppBar style={{gridArea:"appbar"}}></AppBar>
          <BanlistContainer/>
      </Style.AppContainer>
  );
}

export default App;
