const Util = {
    ajax(option){
        return new Promise((resolve,reject) => {
            var xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                        resolve(xhr.responseText)
                    } else {
                        reject(xhr.responseText)
                    }
                }
            }
            xhr.open("get", option.url, true)
            xhr.send(null)
        })
    },
    //以文件形式下载
    downloadAsFile(content,fileName,contentType){
        const a = document.createElement('a')
        const file = new Blob([content],{type:contentType})
        a.href = URL.createObjectURL(file)
        a.download = fileName
        a.click()
    }
}

class Enumeration {
    constructor(obj) {
        if(!obj) return {}
        
        for(let key in obj){
            this[this[key] = obj[key]] = key
        }
    }
}

export {Util as default, Enumeration}