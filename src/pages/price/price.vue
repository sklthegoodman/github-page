<template>
    <div>
        <h3>趣天价格计算</h3>
        <el-form ref="form" :model="form" label-width="120px" label-position="left">
            <el-form-item label="成本价">
                <el-input v-model="form.cost" placeholder="请输入数字，比如：30"></el-input>
            </el-form-item>
            <el-form-item label="销售类型">
                <el-radio-group v-model="form.sellFee">
                    <el-radio label="0.1">一般</el-radio>
                    <el-radio label="0.08">团购</el-radio>
                    <el-radio label="0.06">拍卖</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="折扣">
                <el-input v-model="form.discount" placeholder="请输入百分比，比如：30%"></el-input>
            </el-form-item>
            <el-form-item label="期望销售利润率">
                <el-input v-model="form.profit" placeholder="请输入百分比，比如：12%"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确认</el-button>
                <el-button @click="onClear">清空</el-button>
            </el-form-item>
        </el-form>

        <div class="display" v-if="tableData && tableData.length">
            <el-table
                :data="tableData"
                style="width: 100%"
            >
                <el-table-column
                    label="平台费用"
                >
                    <el-table-column
                        prop="feeRate"                        
                        label="销售费率"
                    ></el-table-column>
                    <el-table-column
                        prop="fee"                        
                        label="销售手续费"
                    ></el-table-column>
                    <el-table-column
                        prop="adFee"                        
                        label="外部广告费"
                    ></el-table-column>
                </el-table-column>
                <el-table-column
                    label="物流费用"
                >
                    <el-table-column
                        prop="pack"
                        label="打包费"
                    ></el-table-column>
                    <el-table-column
                        prop="head"                        
                        label="头程"
                    ></el-table-column>
                    <el-table-column
                        prop="tail"                        
                        label="尾程"
                    ></el-table-column>
                </el-table-column>
                <el-table-column
                    prop="priceWithoutDiscount"
                    label="挂单价"
                >
                </el-table-column>
                <el-table-column
                    prop="price"                        
                    label="最终销售价"
                >
                </el-table-column>
                <el-table-column
                    prop="income"                        
                    label="收入"
                >
                </el-table-column>
                <el-table-column
                    prop="profit"
                    label="利润"
                >
                </el-table-column>
                <el-table-column
                    prop="profitInCNY"
                    label="利润(人民币)"
                >
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script>
import Util from '../../libs/utils'
const storeKey = 'exchangeRatw'
let storeData


try {
    storeData = JSON.parse(localStorage.getItem(storeKey))   
    console.log(storeData) 
} catch (error) {
    //
}


//获取汇率
if(storeData && (+new Date() - storeData.ts > 60 * 60 * 4)){
    //
}else{
    Util.ajax({
        url:'https://api.ratesapi.io/api/latest?base=CNY'
    }).then((data) => {
        let processed = JSON.parse(data)
        processed.ts = +new Date()
        console.log(processed)

        localStorage.setItem(storeKey,JSON.stringify(processed))
    }).catch(() => {
        console.log('汇率接口出错')
    })
}


export default {
    data(){
        return {
            form: {
                cost: '30',
                sellFee: '0.1',
                discount: '30%',
                profit:'12%',
            },
            tableData: []
        }
    },
    methods:{
        onSubmit(){
            const me = this,
                rate = storeData.rates.JPY,
                cost = +me.form.cost * rate,
                sellFee = +me.form.sellFee,
                discount = +me.form.discount.replace('%','') / 100,
                profit = +me.form.profit.replace('%','') / 100,
                packFee = 4,
                headRange = 4,
                tailRange = 220,
                logisticsFee = packFee * rate + headRange * rate + tailRange

                console.log(logisticsFee)
                console.log(logisticsFee/rate)
                console.log(rate)

            //计算
            let priceWithoutDiscount = (logisticsFee + cost)/ ((1 - profit) * (0.99 - 0.99 * discount - sellFee)),
                price = priceWithoutDiscount * (1 - discount),
                income = price - priceWithoutDiscount * sellFee - 0.01 * price
            console.log(priceWithoutDiscount)
            console.log(price)

            me.tableData = [
                {
                    feeRate: sellFee * 100 + '%',
                    fee: (priceWithoutDiscount * sellFee).toFixed(2),
                    adFee:Math.round(price * 0.01),
                    pack: `人民币：${packFee}，日元：${(packFee * rate).toFixed(2)}`,
                    head:`人民币：${headRange}，日元：${(headRange * rate).toFixed(2)}`,
                    tail:tailRange,
                    priceWithoutDiscount:priceWithoutDiscount.toFixed(2),
                    price:price.toFixed(2),
                    income:income.toFixed(2),
                    profit:(income * profit).toFixed(2),
                    profitInCNY:((income * profit)/rate).toFixed(2)
                }
            ]
        },
        onClear(){
            let me = this
            me.tableData = []
            me.form = {
                cost: '',
                sellFee: '0.1',
                discount: '',
                profit:'',
            }
        }
    }
}
</script>

<style lang="less">
    body{
        font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
        padding: 20px;
    }
    .el-form{
        width: 470px;
    }
</style>