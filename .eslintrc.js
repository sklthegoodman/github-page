module.exports = {
  root: true,
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    "plugin:vue/recommended"
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "semi":[1,'never'],
    "no-console": "off",
    "indent":[2, 4,{SwitchCase: 1}],

    //vue插件的配置
    "vue/html-indent":[1,4],
    "vue/no-v-html":0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
