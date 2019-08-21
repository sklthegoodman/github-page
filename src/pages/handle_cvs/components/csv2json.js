function flatten(str){
    if(!str) return ''
    let rows = str.split('\n')
    //清洗一遍数据，把空的行去掉
    rows = rows.filter((row) => {
        return row
    })
    let refined = rows.map((item) => {
        return item.split(',')
    })
    return refined
}

function csv2json(str){
    let refined = flatten(str)
    //表头
    const title = refined.shift()
    //内容
    const body = refined.map((item) => {
        const row = item.reduce((result,row,index) => {
            let key = title[index]
            result[key] = row
            return result
        },{})
        return row
    })

    return {
        title,
        body
    }
}

export {csv2json as default}