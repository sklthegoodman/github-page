const path = require('path')
// const isProduction = process.env.NODE_ENV === 'production'

const outputDir = path.resolve('dist')
const templateDir = path.resolve('dist')
const publicPath = process.env.ASSETS_SHARE_PATH || ''


module.exports = {
    productionSourceMap: false,
    outputDir: outputDir,
    publicPath: publicPath,
    pages: {
        priceCalculate: {
            entry: 'src/pages/price/price.js',
            template: 'src/template/template.html',
            title: '趣天价格计算',
            filename: path.resolve(templateDir, 'price.html')
        },
        cvsGenerator:{
            entry:'src/pages/handle_cvs/cvs.js',
            template: 'src/template/template.html',
            title: 'cvs处理',
            filename: path.resolve(templateDir, 'cvs.html')
        }
    }
}
