import React from 'react';
import { Input, Button, Space, Form, Row, Col } from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import Tools from '@/utils/tools';
import { UploadFile } from 'antd/es/upload/interface';

interface Props {
  file: UploadFile;
  loading: boolean;
  remove: () => Promise<void>;
}

const PdfReplaceText: React.FC<Props> = (props) => {
  const { file, loading } = props;
  const { instance, setShowWebviewer, setWebviewerTtile } = useModel('pdf');

  // 预览
  const handlePreview = () => {
    const { UI } = instance!;
    const { prefix, suffix } = Tools.fileMsg(file);
    setShowWebviewer(true);
    setWebviewerTtile(file.name);
    UI.loadDocument(file as any as File, {
      filename: prefix,
      extension: suffix,
    });
  };

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
  };

  return (
    <>
      <div className="w-2/6 z-10 relative m-auto">
        <div className="flex justify-center text-xl">PDF替换文字</div>
        <div className="flex justify-between my-6">
          <div className="flex items-center  text-gray-400">
            PDF名称：{file.name || ''}
          </div>
          <div>
            <Button type="primary" onClick={handlePreview}>
              预览
            </Button>
          </div>
        </div>
        <div className="text-red-500 mb-7 leading-7">
          一定要是原文档/扫描件等才能使用替换功能。默认是替换文档中的所有同样的词，如果只想改某一个位置
          的词，请带上这个词前后文字一起进行输入替换。
        </div>
      </div>
      <div className="w-6/12 z-10 relative m-auto">
        <Form
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.List name="users">
            {(fields, { add, remove }) => (
              <>
                <Row justify="start" align="middle">
                  <Col span={9}>
                    <Form.Item
                      name={['users', 'key']}
                      rules={[
                        { required: true, message: 'Missing first name' },
                      ]}
                    >
                      <Input size="large" placeholder="输入需要修改的文字" />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <div className="text-center">替换</div>
                  </Col>
                  <Col span={9}>
                    <Form.Item
                      name={['users', 'value']}
                      rules={[{ required: true, message: 'Missing last name' }]}
                    >
                      <Input size="large" placeholder="输入需要修改的文字" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify="start" align="middle">
                  <Col span={9}>
                    <Form.Item
                      name={['users', 'key']}
                      rules={[
                        { required: true, message: 'Missing first name' },
                      ]}
                    >
                      <Input size="large" placeholder="输入需要修改的文字" />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <div className="text-center">替换</div>
                  </Col>
                  <Col span={9}>
                    <Form.Item
                      name={['users', 'value']}
                      rules={[{ required: true, message: 'Missing last name' }]}
                    >
                      <Input size="large" placeholder="输入需要修改的文字" />
                    </Form.Item>
                  </Col>
                  <Col span={3} className="flex justify-center">
                    <Space>
                      <PlusCircleOutlined
                        style={{ fontSize: '20px' }}
                        onClick={() => add()}
                      />
                      <MinusCircleOutlined
                        style={{ fontSize: '20px' }}
                        onClick={() => remove(name)}
                      />
                    </Space>
                  </Col>
                </Row>

                {fields.map(({ key, name, ...restField }) => {
                  console.log(name);
                  console.log(restField);
                  return (
                    <Row key={key} justify="center" align="middle">
                      <Col span={9}>
                        <Form.Item
                          {...restField}
                          name={[name, 'first']}
                          rules={[
                            { required: true, message: 'Missing first name' },
                          ]}
                        >
                          <Input
                            size="large"
                            placeholder="输入需要修改的文字"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <div className="text-center">替换</div>
                      </Col>
                      <Col span={9}>
                        <Form.Item
                          {...restField}
                          name={[name, 'last']}
                          rules={[
                            { required: true, message: 'Missing last name' },
                          ]}
                        >
                          <Input
                            size="large"
                            placeholder="输入需要修改的文字"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={3} className="flex justify-center">
                        <Space>
                          <PlusCircleOutlined
                            style={{ fontSize: '20px' }}
                            onClick={() => add()}
                          />
                          <MinusCircleOutlined
                            style={{ fontSize: '20px' }}
                            onClick={() => remove(name)}
                          />
                        </Space>
                      </Col>
                    </Row>
                  );
                })}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add sights
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <div className="w-2/3 z-10 relative m-auto">
            <Button
              block
              size="large"
              type="primary"
              loading={loading}
              htmlType="submit"
            >
              一键替换
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default PdfReplaceText;
