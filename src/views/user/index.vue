<template>
  <div class="user-wrap">
    <a-button type="primary" @click="addUser">新增</a-button>
    <div class="table-wrap">
      <a-table :dataSource="dataSource" :columns="columns" :scroll="{ y: 400 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <a-button-group>
              <a-button type="link" @click="() => modifyUser(record)"
                >修改密码</a-button
              >
            </a-button-group>
          </template>
        </template>
      </a-table>
    </div>

    <a-modal
      v-model:visible="addVisible"
      title="新增"
      @ok="() => handleOk('add')"
      destroyOnClose
      :maskClosable="false"
      width="400px"
      @cancel="handleClose"
    >
      <a-form
        :model="formData"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        :rules="formRules"
        ref="addFormRef"
      >
        <a-form-item name="username" label="用户名">
          <a-input v-model:value="formData.username" />
        </a-form-item>
        <a-form-item name="password" label="密码">
          <a-input-password v-model:value="formData.password" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      v-model:visible="modifyVisible"
      title="修改"
      @ok="() => handleOk('modify')"
      destroyOnClose
      :maskClosable="false"
      width="400px"
      @cancel="handleClose"
    >
      <a-form
        :model="modifyFormData"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        :rules="modifyFormRules"
        ref="modifyFormRef"
      >
        <a-form-item name="password" label="原密码">
          <a-input-password v-model:value="modifyFormData.password" />
        </a-form-item>
        <a-form-item name="newPassword" label="新密码">
          <a-input-password v-model:value="modifyFormData.newPassword" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { reactive, onMounted, toRefs, ref } from "vue";
import { message as Message } from "ant-design-vue";
import { User } from "@apis";
export default {
  setup() {
    const state = reactive({
      dataSource: [],
      columns: [
        {
          title: "用户ID",
          dataIndex: "userid",
          key: "userid",
          width: 400,
        },
        {
          title: "用户名",
          dataIndex: "username",
          key: "username",
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: 200,
        },
      ],
      addVisible: false,
      modifyVisible: false,
      formData: {
        username: "",
        password: "",
      },
      formRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["blur", "change"],
          },
        ],
      },
      modifyFormData: {
        password: "",
        newPassword: "",
      },
      modifyFormRules: {
        password: [
          {
            required: true,
            message: "请输入原密码",
            trigger: ["blur", "change"],
          },
        ],
        newPassword: [
          {
            required: true,
            message: "请输入新密码",
            trigger: ["blur", "change"],
          },
        ],
      },
      record: {},
    });

    const addFormRef = ref();
    const modifyFormRef = ref();

    const addUser = () => {
      state.addVisible = true;
    };

    const getList = async () => {
      const res = await User.getList();
      const { data } = res.data;
      state.dataSource = data;
    };

    const modifyUser = (record) => {
      state.modifyVisible = true;
      state.record = { ...record };
    };

    const handleOk = (type) => {
      if (type === "add") {
        addFormRef.value.validate().then(() => {
          const { username, password } = state.formData;
          User.doRegister({ username, password }).then((res) => {
            const { code, message } = res.data;
            if (code === 200) {
              Message.success("新增成功");
              state.addVisible = false;
              getList();
            } else {
              Message.error(message);
            }
          });
        });
      } else if (type === "modify") {
        modifyFormRef.value.validate().then(() => {
          const { userid } = state.record;
          const { password, newPassword } = state.modifyFormData;
          User.doModify({ userid, password, newPassword }).then((res) => {
            const { code, message } = res.data;
            if (code === 200) {
              Message.success("修改成功");
              state.modifyVisible = false;
              getList();
            } else {
              Message.error(message);
            }
          });
        });
      }
    };

    const handleClose = () => {
      state.formData = { username: "", password: "" };
      state.modifyFormData = { password: "", newPassword: "" };
    }

    onMounted(() => {
      getList();
    });

    return {
      ...toRefs(state),
      addUser,
      handleOk,
      addFormRef,
      modifyFormRef,
      modifyUser,
      handleClose
    };
  },
};
</script>
<style lang="less">
.user-wrap {
  padding: 15px;
  .table-wrap {
    margin-top: 15px;
  }
}
</style>