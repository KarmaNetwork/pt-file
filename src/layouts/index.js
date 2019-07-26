import React from 'react';
import { Typography, Layout } from 'antd';
import ss from '@/styles/layout.less';

const { Title } = Typography;

const BasicLayout = props => {
  return (
    <Layout className={ss.page}>
      <Layout.Header>
	<h1 className={ss.title}>pt-file</h1>
      </Layout.Header>
      <Layout.Content>
	{props.children}
      </Layout.Content>
    </Layout>
  );
};

export default BasicLayout;
