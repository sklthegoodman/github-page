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
    }
}

export {Util as default}