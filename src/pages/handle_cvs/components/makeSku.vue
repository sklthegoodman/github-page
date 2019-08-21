<template>
    <div>
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
                    上传之后将会生成三个CSV文件
                </div>
            </el-upload>
        </div>
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
        goodList_Spec:"",
        goodList:"",
        goodList_Position:""
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

                
                Util.downloadAsFile(me.makeGoodList(json),'GoodList.csv','text/csv')
                Util.downloadAsFile(me.makeGoodListSpec(json),'GoodList_Spec.csv','text/csv')
                Util.downloadAsFile(me.makeGoodListPosition(json),'GoodList_Position.csv','text/csv')

                Bus.$emit('parseDone',{
                    msg:'解析完成，将会生成三个CSV文件'
                })
            }

            reader.onerror = function (evt) {
                console.log(evt)
            }
        },
        makeGoodList(json){
            let title = [
                "货品编号",
                "品名",
                "主条码",
                "货品分类",
                "多规格",
                "子编码",
                "颜色",
                "尺码",
                "规格补充",
                "设为独立编码",
                "品牌ID",
                "参考进价",
                "参考售价",
                "货品归属",
                "重量(KG)",
                "长(CM)",
                "宽(CM)",
                "高(CM)"
            ]

            let skuIndex = 0,
                skuKey = json.title[skuIndex]

            const result = json.body.map((sku) => {
                let skuCode = sku[skuKey].split('-')
                //有时候没有颜色之分，处理一下
                if(skuCode.length < 3){
                    skuCode.splice(1,0,'')
                }
                let code = skuCode[0]

                //根据表头生成一个对象
                let rowObj = title.reduce((result,value) => {
                    result[value] = ""
                    return result
                },{})

                rowObj = Object.assign(rowObj,{
                    "货品编号":code,
                    "品名":code,
                    "主条码":code + '-',
                    "货品分类":'-',
                    "多规格":1
                })

                return rowObj
            })

            let parser = new Parser({fields:title})
            return parser.parse(result)

        },
        makeGoodListSpec(json){
            const fields = [
                '货品编号',
                '子编码',
                '颜色',
                '尺码',
                '规格补充',
                '设为独立编码',
                '更新'
            ]

            let skuIndex = 0,
                skuKey = json.title[skuIndex]

            const result = json.body.map((sku) => {
                let skuCode = sku[skuKey].split('-')
                //有时候没有颜色之分，处理一下
                if(skuCode.length < 3){
                    skuCode.splice(1,0,'')
                }
                let [code,color,size] = skuCode

                //根据表头生成一个对象
                let rowObj = fields.reduce((result,value) => {
                    result[value] = ""
                    return result
                },{})

                rowObj = Object.assign(rowObj,{
                    '货品编号':code,
                    '子编码':color ? color + '-' + size : size,
                    '颜色':color,
                    '尺码':size
                })

                return rowObj
            })

            let parser = new Parser({fields})
            return parser.parse(result)
        },
        makeGoodListPosition(json){
            const fields = [
                '所在仓库',
                '条码',
                '拣货货位',
                '货位备注'
            ]

            let skuIndex = 0,
                skuKey = json.title[skuIndex],
                posIndex = 1,
                posKey = json.title[posIndex]

            const result = json.body.map((sku) => {
                let skuCode = sku[skuKey]

                //货位
                let pos = sku[posKey]

                //根据表头生成一个对象
                let rowObj = fields.reduce((result,value) => {
                    result[value] = ""
                    return result
                },{})

                rowObj = Object.assign(rowObj,{
                    '所在仓库':'日本Q仓库离岸',
                    '条码':skuCode,
                    '拣货货位':pos
                })

                return rowObj
            })

            let parser = new Parser({fields})
            return parser.parse(result)
        }
    }
}
</script>

<style lang="less">

</style>