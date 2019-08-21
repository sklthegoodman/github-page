<template>
    <div>
        <div 
            v-if="parseDoneMsg"
            class="parse-done"
        >
            <p class="parse-done__p">
                {{ parseDoneMsg }}
            </p>
            <el-row>
                <el-button 
                    type="primary"
                    @click="reset"
                >
                    重新上传文件解析
                </el-button>
            </el-row>
        </div>
        <div v-else>
            <div class="choose">
                <el-radio-group 
                    v-model="radio"
                    @change="onChange"
                >
                    <el-radio-button 
                        label="生成Sku"
                    />
                    <el-radio-button 
                        label="开单"
                    />
                </el-radio-group>
            </div>
            <div class="content">
                <makeSku 
                    v-if="radio == types['makeSku']"
                />
                <makeOrder
                    v-if="radio == types['makeOrder']"
                />
            </div>
        </div>
    </div>
</template>

<script>
import parser from 'json2csv'
// components
import makeSku from './components/makeSku'
import makeOrder from './components/makeOrder'
import { Enumeration } from '../../libs/utils'
import Bus from '../../libs/bus'
const Parser = parser.Parser
console.log(Parser)

const fields = ['car', 'price', 'color']
const myCars = [
    {
        "car": "Audi",
        "price": 40000,
        "color": "blue"
    }, {
        "car": "BMW",
        "price": 35000,
        "color": "black"
    }, {
        "car": "Porsche",
        "price": 60000,
        "color": "green"
    }
]

const json2csvParser = new Parser({ fields })
const csv = json2csvParser.parse(myCars)
console.log(csv)

// 组件枚举
const types = new Enumeration({
    makeSku:'生成Sku',
    makeOrder:"开单"
})
export default {
    components:{
        makeSku,
        makeOrder
    },
    data() {
        return {
            radio:types['makeSku'],
            types,
            parseDoneMsg:''
        }
    },
    created(){
        const me = this

        Bus.$on('parseDone',(data) => {
            me.parseDoneMsg = data.msg || '解析完成'
        })
    },
    methods: {
        reset(){
            const me = this
            me.parseDoneMsg = ''
        },
        onChange(data){
            console.log(data)
        }
    }
}
</script>

<style lang="less">
*{
    margin: 0;
}
body{
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
    padding: 20px;
}

.choose{
    text-align: center;
}

.upload{
    text-align: center;
    margin-top: 20px;
}

.parse-done{
    text-align: center;
    padding-top: 100px;
}

.parse-done__p{
    margin-bottom: 15px;
}
</style>