import { FunctionComponent } from 'react';
import { CardInfo, IBanlist, LimitType } from '../../store/slices/banlistSlice';
import * as Style from './Banlist.styles';
import BanlistItem from './BanlistItem';
import monsterCheck from './utils';

interface SectionProps {
  title: keyof IBanlist
  content: CardInfo[]
}

const BanlistSection: FunctionComponent<SectionProps> = ({ content, title }: SectionProps) => {
  const contents: CardInfo[] = Array.prototype.concat(content);

  contents.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  });

  contents.sort((a, b) => {
    if (a.type.includes('Monster')) {
      return b.type.includes('Monster') ? 0 : -1;
    }
    if (a.type.includes('Spell')) {
      // eslint-disable-next-line no-nested-ternary
      return b.type.includes('Spell') ? 0 : b.type.includes('Monster') ? 1 : -1;
    }
    return 0;
  });

  contents.sort((a, b) => {
    if (a.type.includes('Monster') && b.type.includes('Monster')) {
      if (a.type.match(monsterCheck)) {
        if (b.type.match(/fusion|link|synchro|xyz/mi)?.[0] !== undefined) {
          return -1;
        }
      }
      if (a.type > b.type) {
        return 1;
      }
      if (a.type < b.type) {
        return -1;
      }
      return 0;
    }
    return 0;
  });

  return (
    <Style.BanlistSectionContainer>
      <h1 style={{ textAlign: 'center' }}>{LimitType[title]}</h1>
      {(contents.length > 0)
        ? (
          <Style.BanlistSectionTable>
            <thead>
              <Style.BanlistItemContainer
                style={{ background: '#eeeeee', border: '1px solid #333333' }}
                type="Synchro"
              >
                <Style.BanlistItemHeader>Card Type</Style.BanlistItemHeader>
                <Style.BanlistItemHeader>Card Name</Style.BanlistItemHeader>
                <Style.BanlistItemHeader>Progession Format</Style.BanlistItemHeader>
                <Style.BanlistItemHeader>Remarks</Style.BanlistItemHeader>
              </Style.BanlistItemContainer>
            </thead>
            <tbody>
              {contents.map((card) => <BanlistItem key={`${title}: ${card.id}`} card={card} />)}
            </tbody>
          </Style.BanlistSectionTable>
        )
        : <p>Nothing yet :smile:</p>}
    </Style.BanlistSectionContainer>
  );
};

export default BanlistSection;
