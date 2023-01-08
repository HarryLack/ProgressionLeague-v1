import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { store } from './store/store'
import { GenerateBanlist } from './handlers/banlistHandler'

import pkg from '../package.json'
import { setLoaded } from './store/slices/banlistSlice'

console.log('Progression League: version', pkg.version)
// eslint-disable-next-line
GenerateBanlist().then((response) => {
  if (response !== undefined) store.dispatch(setLoaded(true))
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
    <Provider store={store}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider>
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
