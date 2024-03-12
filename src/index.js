import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import reduxStore from './redux';
import { BrowserRouter } from 'react-router-dom'
import { registerLicense } from '@syncfusion/ej2-base';


// key syncfusion
registerLicense(process.env.REACT_APP_SYNC_KEY);


//import reportWe bVitals from './reportWebVitals';

const {store , persistor} = reduxStore()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <PersistGate loading= {null} persistor={persistor}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </PersistGate>
    </Provider>
);
