import React, { h, Fragment, FunctionComponent } from "preact"
import { ReactNode, useEffect } from "react"
import { GenerateBanlist } from "../handlers/banlistHandler"
import { useAppSelector } from "../hooks/hooks"
import { cardInfo, LimitType, selectBanlist } from "../store/slices/banlistSlice"
import { store } from "../store/store"
import * as Style from "./Banlist.styles"

export const BanlistContainer: FunctionComponent = () => {
	const { banned, limited, semiLimited, removed, lastChanged } = useAppSelector(selectBanlist)

	return (
		//@ts-expect-error fixme typing
		<Style.BanlistContainerDiv>
			<h1>Last Updated: Week 3</h1>
				<BanlistSection title="banned" content={banned} />
				<BanlistSection title="limited" content={limited} />
				<BanlistSection title="semiLimited" content={semiLimited} />
				{removed.length >0 &&
				<BanlistSection title="removed" content={removed} />}
		</Style.BanlistContainerDiv>
	)
}

interface SectionProps {
	title: string,
	content:cardInfo[]
}

export const BanlistSection: FunctionComponent<SectionProps> = (props: SectionProps) => {
	const content: cardInfo[] = Array.prototype.concat(props.content)

	content.sort((a, b) => {
		if (a.type > b.type) {
			return 1
		} else if (a.type < b.type) {
			return -1
		} else {
			return 0
		}
	})

	//@ts-expect-error typing children aaaaaa
	return content.length ? <Style.BanlistSectionContainer >
		<h1 style={{ textAlign:"center" }}>{LimitType[props.title]}</h1>
		{/*@ts-expect-error typing children aaaaaa*/}
		<Style.BanlistSectionTable>

			<thead>
				{/*@ts-expect-error typing children aaaaaa*/}
			<Style.BanlistItemContainer style={{ background: "#eeeeee", border: "1px solid #333333" }}>
				<Style.BanlistItemHeader>Card Type</Style.BanlistItemHeader>
				<Style.BanlistItemHeader>Card Name</Style.BanlistItemHeader>
				<Style.BanlistItemHeader>Progession Format</Style.BanlistItemHeader>
				<Style.BanlistItemHeader>Remarks</Style.BanlistItemHeader>
				</Style.BanlistItemContainer>
				</thead>
		{content.map((card) => { console.log(card); return <BanlistItem card={card} /> })}
	</Style.BanlistSectionTable> </Style.BanlistSectionContainer> :
		//@ts-expect-error typing children aaaaaa
		<Style.BanlistSectionContainer>
		<h1>{LimitType[props.title]}</h1>
		<p>Nothing yet :smile:</p>
		</Style.BanlistSectionContainer>
}

export const BanlistItem: FunctionComponent<{ card: cardInfo }> = (props) => {
	const { name, type, status, prevStatus } = props.card
	let typeChecked = type
	let typeColour = type.match(/monster|spell|trap/mi)?.[0];
	if (typeColour === "Monster") {
		const types = type.match(/\w+/gm);
		if (types) { 
			typeChecked = `${types[types.length-1]}/${types[types.length - 2]}`
	}
		typeColour = type.match(/normal|effect|fusion|link|synchro|xyz/mi)?.[0]
	}
	console.log(typeColour);
	//@ts-expect-error typing?
	return <Style.BanlistItemContainer type={typeColour}>
		<Style.BanlistItemContent>{typeChecked}</Style.BanlistItemContent>
		<Style.BanlistItemContent>{name}</Style.BanlistItemContent>
		<Style.BanlistItemContent>{status}</Style.BanlistItemContent>
		<Style.BanlistItemContent>{prevStatus === "New" || "" ? prevStatus : "Was " + prevStatus}</Style.BanlistItemContent>
	</Style.BanlistItemContainer>
}