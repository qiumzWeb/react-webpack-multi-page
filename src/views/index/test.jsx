import { React,ReactDOM,Hub,Component} from 'js/base'
function Name(props) {
    return <h1>网站名称：{props.name}</h1>;
}
function Url(props) {
    return <h1>网站地址：{props.url}</h1>;
}
function Nickname(props) {
    return <h1>网站小名：{props.nickname}</h1>;
}

class Test extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount () { // dom 加载前
        Hub.$on("test",function(_data){
        console.log(_data);
        console.log(arguments);
        })
    }
    render() {
        return (
        <div className="m-content">
        <Name name="菜鸟教程" />
        <Url url="http://www.runoob.com" />
        <Nickname nickname="Runoob" />
        </div>
        )
    }
    componentDidMount () { // dom 加载完成

    }    
}
export default Test;