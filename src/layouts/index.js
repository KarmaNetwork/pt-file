import React from 'react';
import { Layout } from 'antd';

const BasicLayout = props => {
  return (
    <Layout>
      <Layout.Header>
	hello
      </Layout.Header>
      <Layout.Content>
	{props.children}
      </Layout.Content>
    </Layout>
  );
};

export default BasicLayout;
