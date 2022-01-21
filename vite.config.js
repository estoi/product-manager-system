import vue from "@vitejs/plugin-vue";
import { viteMockServe } from "vite-plugin-mock";
import path from 'path';
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

export default ({command }) => {
  let prodMock = true
  return {
    plugins: [
      vue(),
      viteMockServe({
        supportTs: false,
        watchFiles: true,
        mockPath: 'mock',
        localEnabled: command === 'serve',
        prodEnabled: command !== 'serve' && prodMock,
        injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `,
      }),
      Components({
        resolvers: [
          AntDesignVueResolver(),
        ]
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@apis': path.resolve(__dirname, 'apis')
      }
    }
  }
}
