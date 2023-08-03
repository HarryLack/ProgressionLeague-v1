import { FunctionComponent } from 'react';
import { CardInfo } from '../../store/slices/banlistSlice';
import * as Style from './Banlist.styles';
import monsterCheck from './utils';

const BanlistItem: FunctionComponent<{ card: CardInfo }> = ({ card }) => {
  const {
    name, type, status, prevStatus,
  } = card;
  let typeChecked = type;
  let typeColour = type.match(/monster|spell|trap/mi)?.[0];
  if (typeColour === 'Monster') {
    const types = type.match(/\w+/gm);
    if (types != null) {
      typeChecked = `${types[types.length - 1]}/${types[types.length - 2]}`;
    }
    typeColour = type.match(/normal|effect|spirit|tuner|fusion|link|synchro|xyz/mi)?.[0];
  }
  const checker = typeColour?.match(monsterCheck)?.[0];
  if (checker) {
    typeColour = 'Effect';
    typeChecked = typeChecked.replace(checker, 'Effect');
  }

  const getStatus = () => {
    if (status === prevStatus) {
      return '';
    }
    if (prevStatus === 'New' || '') {
      return prevStatus;
    }
    return `Was ${prevStatus}`;
  };

  return (
    <Style.BanlistItemContainer type={typeColour}>
      <Style.BanlistItemContent>{typeChecked}</Style.BanlistItemContent>
      <Style.BanlistItemContent>{name}</Style.BanlistItemContent>
      <Style.BanlistItemContent>{status}</Style.BanlistItemContent>
      <Style.BanlistItemContent>{getStatus()}</Style.BanlistItemContent>
    </Style.BanlistItemContainer>
  );
};

export default BanlistItem;
