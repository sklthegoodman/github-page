<template>
    <div>
        <div class="upload">
            <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-success="onSuccess"
                multiple
                :limit="3"
                :on-exceed="handleExceed"
                :file-list="fileList"
            >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">上传CVS文件，将生成三份表单</div>
            </el-upload>
        </div>
    </div>
</template>

<script>
import parser from 'json2csv'
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
export default {
    data() {
        return {
            fileList:[]
        }
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        onSuccess(reponse,file){
            console.log(file);
            var reader = new FileReader();
                reader.readAsText(file.raw, "gb2312");
                reader.onload = function (evt) {
                    console.log(evt.target.result.split('\n'))
                }
                reader.onerror = function (evt) {
                    console.log(evt)
                }
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        }
    }
}
</script>

<style lang="less">
body{
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
}
*{
    margin: 0;
}
</style>