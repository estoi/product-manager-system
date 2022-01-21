<template>
  <div class="product-wrap">
    <div class="search-wrap">
      <a-collapse v-model:activeKey="activeKey" ghost>
        <a-collapse-panel header="搜索" key="1">
          <a-form :model="searchConfig" layout="inline" ref="searchFormRef">
            <a-form-item label="商品名称" name="productName">
              <a-input v-model:value="searchConfig.productName" />
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="onSearch">查询</a-button>
                <a-button @click="onReset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div class="table-wrap">
      <a-button type="primary" @click="addProduct">新增</a-button>
      <a-table :dataSource="dataSource" :columns="columns" :scroll="{ y: 400 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <a-button-group>
              <a-button type="link" @click="() => modifyProduct(record)"
                >修改</a-button
              >
              <a-popconfirm
                title="确定删除该商品?"
                @confirm="() => handleConfirm(record)"
              >
                <a-button type="link">删除</a-button>
              </a-popconfirm>
            </a-button-group>
          </template>
          <template v-if="column.dataIndex === 'productImg'">
            <img :src="record.productImg" alt="" />
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
      @cancel="handleClose"
    >
      <a-form
        :model="formData"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        :rules="formRules"
        ref="addFormRef"
      >
        <a-form-item name="productName" label="商品名称">
          <a-input v-model:value="formData.productName" />
        </a-form-item>
        <a-form-item name="productPrice" label="商品价格">
          <a-input v-model:value="formData.productPrice" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      v-model:visible="modifyVisible"
      title="修改"
      @ok="() => handleOk('modify')"
      destroyOnClose
      :maskClosable="false"
      @cancel="handleClose"
    >
      <a-form
        :model="modifyFormData"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        :rules="formRules"
        ref="modifyFormRef"
      >
        <a-form-item name="productName" label="商品名称">
          <a-input v-model:value="modifyFormData.productName" />
        </a-form-item>
        <a-form-item name="productPrice" label="商品价格">
          <a-input v-model:value="modifyFormData.productPrice" />
        </a-form-item>
        <a-form-item label="商品图片" name="productImg">
          <a-upload
            disabled
            v-model:file-list="fileList"
            list-type="picture-card"
          >
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { reactive, toRefs, onMounted, ref } from "vue";
import { message as Message } from "ant-design-vue";
import { Product } from "@apis";
export default {
  setup() {
    const state = reactive({
      activeKey: ["1"],
      dataSource: [],
      searchConfig: {
        productName: "",
      },
      columns: [
        {
          title: "商品ID",
          dataIndex: "productId",
          key: "productId",
          width: 300,
        },
        {
          title: "商品名称",
          dataIndex: "productName",
          key: "productName",
        },
        {
          title: "商品图片",
          dataIndex: "productImg",
          key: "productImg",
        },
        {
          title: "商品价格(元)",
          dataIndex: "productPrice",
          key: "productPrice",
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: 200,
        },
      ],
      fileList: [],
      addVisible: false,
      modifyVisible: false,
      formData: {
        productName: "",
        productPrice: "",
      },
      modifyFormData: {
        productName: "",
        productPrice: "",
      },
      formRules: {
        productName: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: ["blur", "change"],
          },
        ],
        productPrice: [
          {
            type: "string",
            required: true,
            message: "请输入商品价格",
            trigger: ["blur", "change"],
          },
        ],
      },
      record: {},
    });

    const searchFormRef = ref();
    const addFormRef = ref();
    const modifyFormRef = ref();

    const getList = () => {
      const { searchConfig } = state;
      Product.getList(searchConfig).then((res) => {
        const { data } = res.data;
        state.dataSource = [...data];
      });
    };

    const onSearch = () => {
      getList();
    };

    const onReset = () => {
      searchFormRef.value.resetFields();
      getList();
    };

    const handleOk = (type) => {
      if (type === "add") {
        addFormRef.value.validate().then(() => {
          const { productName, productPrice } = state.formData;
          Product.doAdd({ productName, productPrice }).then((res) => {
            const { code } = res.data;
            if (code === 200) {
              Message.success("新增成功");
              state.addVisible = false;
              getList();
            }
          });
        });
      } else {
        modifyFormRef.value.validate().then(() => {
          const { productId, productImg } = state.record;
          const { productName, productPrice } = state.modifyFormData;
          Product.doModify({
            productId,
            productName,
            productPrice,
            productImg,
          }).then((res) => {
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

    const addProduct = () => {
      state.addVisible = true;
    };

    const modifyProduct = (record) => {
      const { productImg, productName, productPrice } = record;
      state.record = { ...record };
      state.modifyFormData = {
        productName,
        productPrice,
      };
      state.fileList = [
        {
          uid: "-1",
          name: `${productName}.png`,
          status: "done",
          url: productImg,
        },
      ];
      state.modifyVisible = true;
    };

    const handleClose = () => {
      state.formData = { productName: "", productPrice: "" };
      state.modifyFormData = { productName: "", productPrice: "" };
    };

    const handleConfirm = (record) => {
      const { productId } = record;
      Product.doDelete({ productId }).then((res) => {
        const { code } = res.data;
        if (code === 200) {
          Message.success("删除成功");
          getList();
        }
      });
    };

    onMounted(() => {
      getList();
    });

    return {
      ...toRefs(state),
      onSearch,
      searchFormRef,
      onReset,
      handleOk,
      addProduct,
      modifyProduct,
      addFormRef,
      modifyFormRef,
      handleClose,
      handleConfirm,
    };
  },
};
</script>
<style lang="less">
.product-wrap {
  padding: 15px;
  .table-wrap {
    margin-top: 15px;
    .ant-btn {
      margin-bottom: 15px;
    }
  }
}
</style>
