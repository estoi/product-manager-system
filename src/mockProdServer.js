import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

import user from '../mock/user'
import product from '../mock/product'

export function setupProdMockServer() {
    createProdMockServer([...user, ...product])
  }