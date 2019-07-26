import React from 'react';
import { Upload, Icon, Modal, Button } from 'antd';
import copy from 'copy-to-clipboard';
import FileTransfer from '@/utils/file';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ss from '@/styles/index.less';

export default class Index extends React.Component {
  state = {
    value: '',
    copied: false,
    visible: false
  }
  
  componentWillMount() {
    // 当页面加载时就应该初始化此对象
    let ft = new FileTransfer('http://localhost:8000', true);
    this.ft = ft;
  }

  action = async (file) => {
    // 从FileTransfer中获取URL。
    let url = this.ft.getUrl(file);
    
    await Modal.success({
      title: '请复制此链接',
      content: (
	<div>{url}</div>
      ),
      okText: (
	<CopyToClipboard text={url}>
	  <div>复制</div>
	</CopyToClipboard>
      ),
      maskClosable: true,
    });
    
    // 设置传输进度回调，
    this.ft.onprocess = (size, total) => {
      console.log(size);
      console.log(total);
    }
  }

  onChange(info) {
    // console.log(info);
  }

  cancel = () => {
    this.setState({visible: false})
  }

  render() {
    return (
      <div className={ss.dropage}>
	<Modal
          title="正在上传中..."
          visible={this.state.visible}
	  footer={null}
	  onCancel={this.cancel}
        >
        </Modal>
	<main className={ss.dropbox}>
          <Upload.Dragger name="files" action={this.action} onChange={this.onChange}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">请将文件拖拽至此</p>
          </Upload.Dragger>
	</main>
      </div>
    );
  }
}
