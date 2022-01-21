<template>
  <div class="login-wrap">
    <Particles
      id="tsparticles"
      :options="{
        background: {
          color: {
            value: '#2d2d2d',
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'grab',
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              size: 20,
            },
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: '#1890ff',
          },
          links: {
            color: '#1890ff',
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: 'none',
            enable: true,
            outMode: 'bounce',
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 40,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: 'circle',
          },
          size: {
            random: true,
            value: 5,
          },
        },
        detectRetina: true,
      }"
    />
    <div class="login-content">
      <div class="title">商品管理系统</div>
      <div class="login-form">
        <a-form :model="loginState">
          <a-form-item>
            <a-input
              v-model:value="loginState.username"
              placeholder="请输入用户名"
            />
          </a-form-item>
          <a-form-item>
            <a-input-password
              v-model:value="loginState.password"
              placeholder="请输入密码"
            />
          </a-form-item>
          <a-form-item>
            <div class="form-link">
              <a-button type="link" @click="goRegister">注册</a-button>
            </div>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              block
              :disabled="!loginState.username || !loginState.password"
              @click="onLogin"
              >登录</a-button
            >
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { message as Message } from "ant-design-vue";
import { User } from "@apis";
export default {
  setup() {
    const loginState = reactive({
      username: "",
      password: "",
    });

    const router = useRouter();
    const goRegister = () => {
      router.replace("/register");
    };

    const onLogin = () => {
      const { username, password } = loginState;
      User.doLogin({
        username,
        password,
      }).then((result) => {
        const { code, message } = result.data;
        if (code === 200) {
          localStorage.setItem("isLogin", true);
          localStorage.setItem("user", JSON.stringify(loginState));
          router.replace("/user");
        } else {
          Message.error(message);
        }
      });
    };

    onMounted(() => {
      localStorage.removeItem("isLogin");
      localStorage.removeItem("user");
    });

    return {
      loginState,
      goRegister,
      onLogin,
    };
  },
};
</script>
<style lang="less">
.login-wrap {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-content {
    .title {
      font-size: 28px;
      text-align: center;
      color: #fff;
      position: relative;
      margin-bottom: 20px;
    }
    .login-form {
      margin-top: 10px;
      width: 300px;
      height: 200px;
      .form-link {
        text-align: right;
      }
    }
  }
}
</style>
