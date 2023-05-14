import { Layout, Menu } from "antd";
import { InboxOutlined, SendOutlined } from "@ant-design/icons";
import React, { PropsWithChildren } from "react";
import { useRouter } from "next/router";
import { Path } from "@/interfaces";

const { Header, Footer, Sider, Content } = Layout;

export default function AppLayout({ children }: PropsWithChildren) {
  const { pathname, push } = useRouter();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          defaultSelectedKeys={[pathname.split("/")?.[1]]}
          items={[
            {
              key: "orders",
              icon: <InboxOutlined />,
              label: "Užsakymai",
              onClick: () => push(Path.ORDERS),
            },
            {
              key: "shipments",
              icon: <SendOutlined />,
              label: "Siuntos",
              onClick: () => push(Path.SHIPMENTS),
            },
          ]}
          style={{ paddingTop: 64 }}
        />
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: "#001529" }} />
        <Content className="p-4">
          <div>{children}</div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
}
