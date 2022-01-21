import Mock from 'mockjs'

let users = [];

export default [
  {
    url: "/apis/user/list",
    method: "get",
    response: () => {
      return {
        code: 200,
        message: "成功",
        data: [...users]
      };
    },
  },
  {
    url: "/apis/user/register",
    methods: "post",
    response: (config) => {
      const { username, password } = config.body;
      const userid = Mock.Random.id();
      if (users.length) {
        const hasUser = users.filter((item) => item.username === username).length > 0;
        if (!hasUser) {
          users.unshift({
            username,
            password,
            userid
          });
          return {
            code: 200,
            message: "成功",
          };
        } else {
          return {
            code: 999,
            message: "该账号已注册",
          };
        }
      } else {
        users.unshift({
          username,
          password,
          userid
        });

        return {
          code: 200,
          message: "成功",
        };
      }
    },
  },
  {
    url: "/apis/user/login",
    methods: "post",
    response: (config) => {
      const { username, password } = config.body;
      if (users.length) {
        const userArr = users.filter((item) => item.username === username);
        const hasUser = userArr.length > 0;

        if (hasUser) {
          const { password: pwd, username: name } = userArr[0];
          if (password === pwd && username === name) {
            // 账号密码正确
            return {
              code: 200,
              message: "成功",
            };
          }else {
            return {
              code: 999,
              message: "用户名或密码不正确",
            };
          }
        } else {
          return {
            code: 999,
            message: "该账号不存在",
          };
        }
      } else {
        return {
          code: 999,
          message: "该账号不存在",
        };
      }
    },
  },
  {
    url: "/apis/user/modify",
    methods: "post",
    response: (config) => {
      const { userid, password, newPassword } = config.body;
      const currentUser = users.filter((item) => item.userid === userid)[0];
      const index = users.findIndex(item => item.userid === userid)
      if(password === currentUser.password) {
        users[index].password = newPassword;
        return {
          code: 200,
          message: '成功'
        }
      }else {
        return {
          code: 999,
          message: '原密码错误'
        }
      }
    }
  },
];
