/*
 * @Author: qiumingzhen 
 * @Date: 2018-12-11 15:59:26 
 * @Last Modified by: qiumingzhen
 * @Last Modified time: 2018-12-12 10:51:43
 */

const genSignData = function(jsonObject) {
	let content = "";
    let keys = Object.keys(jsonObject).sort(); // 排序
	for (let key of keys) {
		let value = jsonObject[key];
		let objectFlag = false;
		if(typeof (value) == 'object'){
			let $str = "{";
			for (let $k in value) {
				$str += $k + "=" + value[$k] + ", ";
				objectFlag = true;
            }
			if(objectFlag){
				value = $str.substring(0,$str.length-2)+"}"
			};
		}
		if ("sign" == key) {
			continue;
		}
		// 空串不参与签名
		if (value === null || value  === undefined || value === "" ) {
			continue;
		}
		if(typeof(value)!='object' || objectFlag) content += "&" + key + "=" + value;
	}

	if (content != null && content != "" && content.substr(0, 1) == "&") {
		content = content.substr(1, content.length)
    }

	return content;
}

export default genSignData;