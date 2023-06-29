import React, { Fragment, FunctionComponent } from 'react'
import { useAppSelector } from '../hooks/actions'
import { cardInfo, IBanlist, LimitType, selectBanlist } from '../store/slices/banlistSlice'
import * as Style from './Banlist.styles'
import { BanlistHandler } from '../handlers/banlistHandler'
import { UseBanlist } from '../hooks/use-banlist'

const monsterCheck = /spirit|tuner/i

export const BanlistContainer: FunctionComponent = () => {
    const {
        banned, limited, semiLimited, removed, lastChanged,
    } = useAppSelector(selectBanlist)

    const { loaded } = UseBanlist()

    return (loaded || banned.length || limited.length || semiLimited.length || removed.length)
        ? (
            <Style.BanlistContainerDiv>
                <h1 style={{ textAlign: 'center' }}>
                    Last Updated: {lastChanged}
                </h1>
                <BanlistSection title='banned' content={banned} />
                <BanlistSection title='limited' content={limited} />
                <BanlistSection title='semiLimited' content={semiLimited} />
                {removed.length > 0 && <BanlistSection title='removed' content={removed} />}
            </Style.BanlistContainerDiv>
        )
        : (
            <div>Loading</div>
        )
}

interface SectionProps {
    title: keyof IBanlist
    content: cardInfo[]
}

export const BanlistSection: FunctionComponent<SectionProps> = (props: SectionProps) => {
    const content: cardInfo[] = Array.prototype.concat(props.content)

    content.sort((a, b) => {
        if (a.name > b.name) {
            return 1
        }
        if (a.name < b.name) {
            return -1
        }
        return 0
    })

    content.sort((a, b) => {
        if (a.type.includes('Monster')) {
            return b.type.includes('Monster') ? 0 : -1
        }
        if (a.type.includes('Spell')) {
            return b.type.includes('Spell') ? 0 : b.type.includes('Monster') ? 1 : -1
        }
        return 0
    })

    content.sort((a, b) => {
        if (a.type.includes('Monster') && b.type.includes('Monster')) {
            if (a.type.match(monsterCheck)) {
                if (b.type.match(/fusion|link|synchro|xyz/mi)?.[0] !== undefined) {
                    return -1
                }
            }
            if (a.type > b.type) {
                return 1
            }
            if (a.type < b.type) {
                return -1
            }
            return 0
        }
        return 0
    })

    return <Style.BanlistSectionContainer>
        <h1 style={{ textAlign: 'center' }}>{LimitType[props.title]}</h1>
        {(content.length > 0) ?
            <Style.BanlistSectionTable>
                <thead>
                <Style.BanlistItemContainer style={{ background: '#eeeeee', border: '1px solid #333333' }}
                                            type={'Synchro'}>
                    <Style.BanlistItemHeader>Card Type</Style.BanlistItemHeader>
                    <Style.BanlistItemHeader>Card Name</Style.BanlistItemHeader>
                    <Style.BanlistItemHeader>Progession Format</Style.BanlistItemHeader>
                    <Style.BanlistItemHeader>Remarks</Style.BanlistItemHeader>
                </Style.BanlistItemContainer>
                </thead>
                <tbody>
                {content.map((card) => {
                    return <BanlistItem key={`${props.title}: ${card.id}`} card={card} />
                })}
                </tbody>
            </Style.BanlistSectionTable>
            : <p>Nothing yet :smile:</p>
        }
    </Style.BanlistSectionContainer>
}

export const BanlistItem: FunctionComponent<{ card: cardInfo }> = ({ card }) => {
    const {
        name, type, status, prevStatus,
    } = card
    let typeChecked = type
    let typeColour = type.match(/monster|spell|trap/mi)?.[0]
    if (typeColour === 'Monster') {
        const types = type.match(/\w+/gm)
        if (types != null) {
            typeChecked = `${types[types.length - 1]}/${types[types.length - 2]}`
        }
        typeColour = type.match(/normal|effect|spirit|tuner|fusion|link|synchro|xyz/mi)?.[0]
    }
    const checker = typeColour?.match(monsterCheck)?.[0]
    if (checker) {
        typeColour = 'Effect'
        typeChecked = typeChecked.replace(checker, 'Effect')
    }

    const getStatus = () => {
        if (status === prevStatus) {
            return ''
        }
        if (prevStatus === 'New' || '') {
            return prevStatus
        }
        return `Was ${prevStatus}`
    }

    return (
        // @ts-expect-error typing?
        <Style.BanlistItemContainer type={typeColour}>
            <Style.BanlistItemContent>{typeChecked}</Style.BanlistItemContent>
            <Style.BanlistItemContent>{name}</Style.BanlistItemContent>
            <Style.BanlistItemContent>{status}</Style.BanlistItemContent>
            <Style.BanlistItemContent>{getStatus()}</Style.BanlistItemContent>
        </Style.BanlistItemContainer>
    )
}
