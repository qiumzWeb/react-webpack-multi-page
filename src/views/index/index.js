import { React,ReactDOM,Hub} from 'js/base'
require('./scss/home.scss')
import App from './index.jsx'
ReactDOM.render(
    <App/>,
    document.getElementById('home')
);