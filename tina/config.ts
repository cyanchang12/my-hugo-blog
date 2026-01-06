import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/r/content-modelling-collections/
  schema: {
    collections: [
      {
        name: "post",
        label: "文章",
        path: "content/posts",
        // 定义默认的文章字段值
        defaultItem: () => {
          return {
            title: "新文章",
            date: new Date().toISOString().split('T')[0],
            draft: true,
          }
        },
        fields: [
          // 1. 基本文章信息
          {
            type: "string",
            name: "title",
            label: "文章标题",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "文章描述",
            ui: {
              component: "textarea"
            },
            description: "用于SEO和文章列表预览的简短描述"
          },

          // 2. 文章元数据
          {
            type: "datetime",
            name: "date",
            label: "发布日期",
            required: true,
            ui: {
              timeFormat: "HH:mm"
            }
          },
          {
            type: "boolean",
            name: "draft",
            label: "草稿状态",
            description: "如果勾选，文章将不会公开"
          },

          // 3. 内容分类
          {
            type: "string",
            name: "categories",
            label: "分类",
            list: true,
            description: "为文章添加分类"
          },
          {
            type: "string",
            name: "tags",
            label: "标签",
            list: true,
            description: "为文章添加标签",
            ui: {
              component: "tags"
            }
          },

          // 4. 媒体文件
          {
            type: "image",
            name: "image",
            label: "头图",
            description: "上传或选择一张文章头图"
          },

          // 5. 内容体 (保持不变，这是核心编辑器)
          {
            type: "rich-text",
            name: "body",
            label: "正文内容",
            isBody: true,
            description: "使用Markdown语法编写正文",
          }
        ],
        ui: {
          // 这是一个DEMO路由，您可以根据需要修改或删除
          router: ({ document }) => `/demo/blog/${document._sys.filename}`,
        },
      },
    ],
  },
});