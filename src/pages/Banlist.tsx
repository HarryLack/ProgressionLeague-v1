import React, { FunctionComponent } from 'preact'
import { useAppSelector } from '../hooks/hooks'
import { cardInfo, LimitType, selectBanlist } from '../store/slices/banlistSlice'
import * as Style from './Banlist.styles'

export const BanlistContainer: FunctionComponent = () => {
  const {
    loaded, banned, limited, semiLimited, removed, lastChanged
  } = useAppSelector(selectBanlist)

  return loaded
    ? (
    // @ts-expect-error fixme typing
    <Style.BanlistContainerDiv>
      <h1 style={{ textAlign: 'center' }}>
        Last Updated:
        {lastChanged}
      </h1>
      <BanlistSection title="banned" content={banned} />
      <BanlistSection title="limited" content={limited} />
      <BanlistSection title="semiLimited" content={semiLimited} />
      {removed.length > 0 && <BanlistSection title="removed" content={removed} />}
    </Style.BanlistContainerDiv>
      )
    : (
    <div>Loading</div>
      )
}

interface SectionProps {
  title: string
  content: cardInfo[]
}

export const BanlistSection: FunctionComponent<SectionProps> = (props: SectionProps) => {
  const content: cardInfo[] = Array.prototype.concat(props.content)

  content.sort((a, b) => {
    if (a.name > b.name) {
      return 1
    } if (a.name < b.name) {
      return -1
    }
    return 0
  })

  content.sort((a, b) => {
    if (a.type.includes('Monster')) {
      return b.type.includes('Monster') ? 0 : -1
    } if (a.type.includes('Spell')) {
      return b.type.includes('Spell') ? 0 : b.type.includes('Monster') ? 1 : -1
    }
    return 0
  })

  content.sort((a, b) => {
    if (a.type.includes('Monster') && b.type.includes('Monster')) {
      if (a.type.includes('Spirit')) {
        if (b.type.match(/fusion|link|synchro|xyz/mi)?.[0] !== undefined) {
          return -1
        }
      }
      if (a.type > b.type) {
        return 1
      } if (a.type < b.type) {
        return -1
      }
      return 0
    }
    return 0
  })

  return (content.length > 0)
    ? (
  // @ts-expect-error fixme typing
    <Style.BanlistSectionContainer>
      <h1 style={{ textAlign: 'center' }}>{LimitType[props.title]}</h1>
      {/* @ts-expect-error typing children aaaaaa */}
      <Style.BanlistSectionTable>
        <thead>
          {/* @ts-expect-error typing children aaaaaa */}
          <Style.BanlistItemContainer style={{ background: '#eeeeee', border: '1px solid #333333' }}>
            <Style.BanlistItemHeader>Card Type</Style.BanlistItemHeader>
            <Style.BanlistItemHeader>Card Name</Style.BanlistItemHeader>
            <Style.BanlistItemHeader>Progession Format</Style.BanlistItemHeader>
            <Style.BanlistItemHeader>Remarks</Style.BanlistItemHeader>
          </Style.BanlistItemContainer>
        </thead>
                  {content.map((card) => { console.log(card); return <BanlistItem key={card.id } card={card} /> })}
      </Style.BanlistSectionTable>
    </Style.BanlistSectionContainer>
      )
    : (
  // @ts-expect-error fixme typing
    <Style.BanlistSectionContainer>
      <h1>{LimitType[props.title]}</h1>
      <p>Nothing yet :smile:</p>
    </Style.BanlistSectionContainer>
      )
}

export const BanlistItem: FunctionComponent<{ card: cardInfo }> = (props) => {
  const { card } = props
  const {
    name, type, status, prevStatus
  } = card
  let typeChecked = type
  let typeColour = type.match(/monster|spell|trap/mi)?.[0]
  if (typeColour === 'Monster') {
    const types = type.match(/\w+/gm)
    if (types != null) {
      typeChecked = `${types[types.length - 1]}/${types[types.length - 2]}`
    }
    typeColour = type.match(/normal|effect|spirit|fusion|link|synchro|xyz/mi)?.[0]
  }
  console.log(typeColour)

  if (typeColour == 'Spirit') {
    typeColour = 'Effect'
    typeChecked = typeChecked.replace('Spirit', 'Effect')
  }

  return (
  // @ts-expect-error typing?
    <Style.BanlistItemContainer type={typeColour}>
      <Style.BanlistItemContent>{typeChecked}</Style.BanlistItemContent>
      <Style.BanlistItemContent>{name}</Style.BanlistItemContent>
          <Style.BanlistItemContent>{status}</Style.BanlistItemContent>
          {/* eslint-disable-next-line */ }
      <Style.BanlistItemContent>{status === prevStatus ? '' : prevStatus === 'New' || '' ? prevStatus : `Was ${prevStatus}`}</Style.BanlistItemContent>
    </Style.BanlistItemContainer>
  )
}
