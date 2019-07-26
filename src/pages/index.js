import React from 'react';
import { Upload, Icon } from 'antd';
import FileTransfer from '@/utils/file';
import ss from '@/styles/index.less';

export default function() {
    const action = async file => {
        // 当页面加载时就应该初始化此对象
        let ft = new FileTransfer('http://localhost:8000');
        // 从FileTransfer中获取URL。
        let url = ft.getUrl();
        await alert(url);
        // 设置传输进度回调，
        ft.onprocess = (size, total) => {

        }
    }

    const onChange = (info) => {
        // console.log(info);
    }

    return (
        <div className={ss.dropage}>
            <main className={ss.dropbox}>
                <Upload.Dragger name="files" action={action} onChange={onChange}>
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
