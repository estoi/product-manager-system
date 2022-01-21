<template>
  <div class="root-wrap">
    <a-layout class="layout-wrap" v-if="hasLayout">
      <a-layout-sider
        class="layout-menu-wrap"
        v-model:collapsed="collapsed"
        collapsible
        :trigger="null"
      >
        <div class="logo">Galaxy</div>
        <a-menu theme="dark" v-model:selectedKeys="selectedKeys" mode="inline">
          <a-menu-item
            v-for="item in menu"
            :key="item.key"
            @click="() => selectMenu(item)"
          >
            <component :is="item.icon" />
            <span>{{ item.name }}</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header class="layout-header">
          <div class="header-wrap">
            <menu-unfold-outlined
              v-if="collapsed"
              class="trigger"
              @click="() => (collapsed = !collapsed)"
            />
            <menu-fold-outlined
              v-else
              class="trigger"
              @click="() => (collapsed = !collapsed)"
            />
            <div class="user-menu">
              <a-dropdown>
                <a-button type="link">{{ user.username }}</a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="0" @click="logOut">退出</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>
        </a-layout-header>
        <a-layout-content class="layout-content">
          <div class="content-wrap">
            <router-view></router-view>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { reactive, toRefs } from "vue";
import menuConfig from "@/config/menuConfig";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  ShoppingOutlined
} from "@ant-design/icons-vue";
export default {
  components: {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    ShoppingOutlined
  },
  setup() {
    const state = reactive({
      collapsed: false,
      selectedKeys: ['1'],
      hasLayout: true,
      menu: menuConfig,
      user: {}
    })

    const router = useRouter();

    router.beforeEach((to, from, next) => {
      const isLogin = localStorage.getItem("isLogin");
      if (isLogin) {
        next();
      } else {
        if (to.name === "login" || to.name === "register") {
          return next();
        }
        next({ name: "login" });
      }
    });

    router.afterEach((to) => {
      const { meta } = to;
      const { hasLayout: layout } = meta;
      state.hasLayout = layout;
      state.user = localStorage.getItem("user")? JSON.parse(localStorage.getItem("user")): {}
    });

    const selectMenu = (event) => {
      const { path } = event;
      router.push(path);
    };

    const logOut = () => {
      localStorage.removeItem('isLogin');
      localStorage.removeItem('user');
      router.replace('/login')
    }

    return {
      ...toRefs(state),
      selectMenu,
      logOut
    };
  },
};
</script>

<style lang="less">
#app {
  width: 100vw;
  height: 100vh;
  .root-wrap {
    width: 100%;
    height: 100%;
    .layout-wrap {
      height: 100%;
      .logo {
        height: 30px;
        margin: 15px;
        background-color: #666;
        line-height: 30px;
        text-align: center;
        color: #fff;
        font-size: 14px;
      }
      .layout-header {
        background-color: #fff;
        .header-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
      .layout-content {
        box-sizing: border-box;
        padding: 12px;
        .content-wrap {
          width: 100%;
          height: 100%;
          background-color: #fff;
        }
      }
    }
  }
}
</style>
