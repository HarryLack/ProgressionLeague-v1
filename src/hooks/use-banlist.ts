import { BanlistHandler, GenerateBanlist } from '../handlers/banlistHandler'
import { store } from '../store/store'
import { setLoaded } from '../store/slices/banlistSlice'
import { useEffect, useState } from 'react'
import { useAppDispatch } from './actions'

export const UseBanlist = (): { loaded: boolean } => {
    const dispatch = useAppDispatch()
    const [loaded,setLoaded] = useState(false)
    const { current, prev } = BanlistHandler.getListInputs()

    useEffect(() => {
        setLoaded(false)
        if (current && prev) {
            BanlistHandler.generateBanlist().then(() => setLoaded(true))
        }
    }, [current, prev])

    return { loaded }
}