//拿到package.json中配置的环境变量
export default {
  entry: 'src/index.js',
  define: { //定义环境变量中的值
    "process.env": {
      INIT_LEVEL: process.env.INIT_LEVEL
    }
  },
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },

  "extraBabelIncludes": [
    "node_modules/react-spring",
  ]

};