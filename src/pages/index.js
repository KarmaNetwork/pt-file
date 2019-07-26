import React from 'react';
import { Upload, Icon, Modal } from 'antd';
import FileTransfer from '@/utils/file';
import ss from '@/styles/index.less';

export default class Index extends React.Component {
  state = {
    visible: false
  }
  
  componentWillMount() {
    // 当页面加载时就应该初始化此对象
    let ft = new FileTransfer('http://localhost:8000', true);
    this.ft = ft;
  }
  
  action = async (file) => {
    // 从FileTransfer中获取URL。
    let url = this.ft.getUrl();
    
    // 设置传输进度回调，
    this.ft.onprocess = (size, total) => {
      console.log(size);
      console.log(total);
    }

    await alert(url);
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
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single or bulk upload.</p>
          </Upload.Dragger>
	</main>
      </div>
    );
  }
}
