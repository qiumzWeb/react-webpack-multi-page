/*
 * @Author: qiumingzhen 
 * @Date: 2018-12-11 15:59:01 
 * @Last Modified by: qiumingzhen
 * @Last Modified time: 2018-12-12 10:02:43
 */

import crypto from 'crypto'

const md5 = (data) => {
    if (!data) {
        return false
    } else {
        data = data.toString()
        return crypto.createHash('md5').update(data).digest('hex')
    }
}
export default md5 