import { React,ReactDOM,Hub,Component} from 'js/base'
import Test from './test.jsx'


class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    Hub.$emit("test",1,23,4);
  }
  render() {
    return (
        <Test ></Test>
    )
  }
}
export default App;