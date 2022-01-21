import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

import mock from './mock/index'

export function setupProdMockServer() {
    createProdMockServer([...mock])
  }