import { FunctionComponent } from 'react';
import { useAppSelector } from '../../hooks/actions';
import { selectBanlist } from '../../store/slices/banlistSlice';
import * as Style from './Banlist.styles';
import UseBanlist from '../../hooks/use-banlist';
import BanlistSection from './BanlistSection';

const BanlistContainer: FunctionComponent = () => {
  const {
    banned, limited, semiLimited, removed, lastChanged,
  } = useAppSelector(selectBanlist);

  const { loaded } = UseBanlist();

  return (loaded || banned.length || limited.length || semiLimited.length || removed.length)
    ? (
      <Style.BanlistContainerDiv>
        <Style.BanlistHeader>
          Last Updated:
          {lastChanged}
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
