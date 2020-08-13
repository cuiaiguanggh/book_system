//拿到package.json中配置的环境变量
export default {
  entry: 'src/index.js',
  define: { //定义环境变量中的值
    "process.env": {
      INIT_LEVEL: process.env.INIT_LEVEL,
      API_ENV: process.env.API_ENV,
    }

  },
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  "manifest": {},
  "hash": true,
  "html": {
    "template": "./public/index.ejs",
  },
  "extraBabelIncludes": [
    "node_modules/react-spring",
  ],
  "commons": [
    {
      async: '__common',
      children: true,
      minChunks: 4
    },
  ]
};
