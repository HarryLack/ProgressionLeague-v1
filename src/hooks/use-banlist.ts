import { useEffect, useState } from 'react';
import { BanlistHandler } from '../handlers/banlistHandler';

const UseBanlist = (): { loaded: boolean } => {
  const [loaded, setLoaded] = useState(false);
  const { current, prev } = BanlistHandler.getListInputs();

  useEffect(() => {
    setLoaded(false);
    if (current && prev) {
      BanlistHandler.generateBanlist().then(() => setLoaded(true));
    }
  }, [current, prev]);

  return { loaded };
};

export default UseBanlist;
