import React, { h, Fragment, FunctionComponent } from "preact"
import { ReactNode, useEffect } from "react"
import { GenerateBanlist } from "../handlers/banlistHandler"
import { useAppSelector } from "../hooks/hooks"
import { cardInfo, selectBanlist } from "../store/slices/banlistSlice"
import { store } from "../store/store"
import * as Style from "./Banlist.styles"

export const BanlistContainer: FunctionComponent = () => {
	const { banned, limited, semiLimited, removed } = useAppSelector(selectBanlist)

	//@ts-expect-error fixme typing
	return <Style.BanlistContainerDiv>
				<BanlistSection title="banned" content={banned} />
				<BanlistSection title="limited" content={limited} />
				<BanlistSection title="semiLimited" content={semiLimited} />
			 <BanlistSection title="removed" content={removed} />
		</Style.BanlistContainerDiv>
}

interface SectionProps {
	title: string,
	content:cardInfo[]
}

export const BanlistSection: FunctionComponent<SectionProps> = (props: SectionProps) => {


	return <div>
		<h1>{props.title}</h1>
		{props.content.map((card) => { console.log(card); return <p>{card.name}</p> })}
	</div>
}