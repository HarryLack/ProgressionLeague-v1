import React, { FunctionComponent, useState } from 'react';
import { useAppSelector } from '../../hooks/actions';
import { selectBanlist } from '../../store/slices/banlistSlice';
import * as Style from './Banlist.styles';
import UseBanlist from '../../hooks/use-banlist';
import BanlistSection from './BanlistSection';
import { BanlistHandler } from '../../handlers/banlistHandler';
import { ListUrls } from '../../lists/lists';

const Weeks = () => (
  <>
    {Object.entries(ListUrls).map(([name, value]) => <option value={value}>{name}</option>)}
  </>
);

const BanlistContainer: FunctionComponent = () => {
  const {
    banned, limited, semiLimited, removed, lastChanged,
  } = useAppSelector(selectBanlist);

  const { loaded } = UseBanlist();
  const [current, setCurrent] = useState<string | undefined>();
  const [prev, setPrev] = useState<string | undefined>();
  const [comparing, setComparing] = useState(false);
  const [compareText, setCompareText] = useState('');
  const onCompare = (event: any) => {
    event.preventDefault();
    if (current && prev) {
      if (!comparing) {
        setComparing(true);
      }

      BanlistHandler.setCurrentList(current);
      BanlistHandler.setPrevList(prev);
      setCompareText(`Comparing: ${current.replace('W', 'Week ')} to ${prev.replace('W', 'Week ')} `);
    }
  };

  const isComparing = comparing && current && prev;

  return (loaded || banned.length || limited.length || semiLimited.length || removed.length)
    ? (
      <Style.BanlistContainerDiv>
        <form onSubmit={onCompare}>
          Previous List
          <select onChange={(event) => setPrev(event.target.value)}>
            <Weeks />
          </select>
          Current List
          <select onChange={(event) => setCurrent(event.target.value)}>
            <Weeks />
          </select>
          <button type="submit">Compare</button>
        </form>
        <Style.BanlistHeader>
          {isComparing ? compareText : `Last Updated: ${lastChanged}`}
        </Style.BanlistHeader>
        <BanlistSection title="banned" content={banned} />
        <BanlistSection title="limited" content={limited} />
        <BanlistSection title="semiLimited" content={semiLimited} />
        {removed.length > 0 && <BanlistSection title="removed" content={removed} />}
      </Style.BanlistContainerDiv>
    )
    : (
  // eslint-disable-next-line react/react-in-jsx-scope
      <div>Loading</div>
    );
};

export default BanlistContainer;
