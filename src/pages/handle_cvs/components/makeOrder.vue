<template>
    <div class="upload">
        <el-upload
            drag
            action="#"
            accept="text/csv"
            :on-success="onSuccess"
            :on-error="onSuccess"
        >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
                将CSV文件拖到此处，或<em>点击这里上传</em>
            </div>
            <div 
                slot="tip"
                class="el-upload__tip" 
            >
                解析之后将生成开单所需的csv
            </div>
        </el-upload>
    </div>
</template>

<script>
import csv2json from './csv2json'
import  { Parser } from 'json2csv'
import Util from '@libs/utils'
import Bus from '@libs/bus'

export default {
    data: () => ({
        fileList:[],
    }),
    methods:{
        onSuccess(reponse,file){
            const me = this

            let reader = new FileReader()
            reader.readAsText(file.raw, "gb2312")
            reader.onload = function (evt) {
                // console.log(evt.target.result.split('\n'))
                const json = csv2json(evt.target.result)
                console.log(json)

                
                Util.downloadAsFile(me.makeOrder(json),'order.csv','text/csv')

                Bus.$emit('parseDone',{
                    msg:'解析完成，将会生成开单文件'
                })
            }

            reader.onerror = function (evt) {
                console.log(evt)
            }
        },
        makeOrder(json){
            const me = this
            const fields = [
                '条码',
                '数量',
                '备注'
            ]
            
            let skuIndex = 4,
                skuKey = json.title[skuIndex],
                codeIndex = 5,
                codeKey = json.title[codeIndex],
                quantityIndex = 7,
                quantityKey = json.title[quantityIndex]

            const result = json.body.map((sku) => {
                let skuDetail = me.removeQuotation(sku[skuKey])
                let code = me.removeQuotation(sku[codeKey])
                let quantity = me.removeQuotation(sku[quantityKey])

                // if(!code){
                //     console.log(skuDetail)
                //     let arr = [
                //         skuDetail.match(/CODE:(.+?)\s?\//)[1],
                //         skuDetail.match(/COLOR:(.+?)\s?\//)[1],
                //         skuDetail.match(/SIZE:(.+?)/)[1]
                //     ]
                // }

                return {
                    '条码':code,
                    '数量':quantity,
                    '备注':''
                }
            })

            let parser = new Parser({fields})
            return parser.parse(result)
        },
        removeQuotation(str){
            return str.replace(/"/g,'')
        }
    }
}
</script>

<style lang="less">

</style>