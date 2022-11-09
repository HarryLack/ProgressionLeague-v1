import { ReactNode } from "react";
import styled from "styled-components";

export const BanlistContainerDiv = styled.div`
grid-area: body;
display:grid;
justify-self:center;
row-gap: 1vmax;
width:100%;
`


export const BanlistSectionContainer = styled.div`
    display:grid;
    margin-left: 10%;
    margin-right: 10%;
    margin-bottom: 20px;
    border-collapse: collapse;
    border-spacing: 0;
    justify-content:center;
`

export const BanlistSectionTable = styled.table`
    width:50vw;
    border-collapse: collapse;
    border-spacing: 0;
    justify-content:center;
`

const colours: Record<string, string> = {
    "Normal":"#FDE68A",
    "Effect": "#FF8B53",
    "Spirit": "FF8B53",
    "Fusion": "#a086b7",
    "Link": "#006ead",
    "Synchro": "#CCCCCC",
    "XYZ": "#000000",
    "Spell": "#1D9E74",
    "Trap":"#BC5A84"
}

export const BanlistItemContainer = styled.tr <{ type: keyof typeof colours } >`
display:grid;
grid-template-columns: 15% 35% 35% 15%;
    background-color: ${(props) => colours[props.type]};
    color: ${(props) => props.type=="XYZ" ? "#ffffff" : "#000000"};
`

export const BanlistItemHeader = styled.th`
    text-align:center;
    border: 1px solid #333333;
    padding-left: 5px;
    padding-right: 5px;
`

export const BanlistItemContent = styled.td`
    text-align:center;
    border: 1px solid #333333;
    padding-left: 5px;
    padding-right: 5px;
`