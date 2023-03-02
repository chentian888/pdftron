import React from 'react';
import { Input, Button, Form, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { get, concat, map, trim } from 'lodash-es';
import Tools from '@/utils/tools';
import { UploadFile } from 'antd/es/upload/interface';

interface Props {
  file: UploadFile;
  loading: boolean;
  remove: (target: ReplaceTextListType[]) => Promise<void>;
}

const PdfReplaceText: React.FC<Props> = (props) => {
  const { file, loading, remove } = props;
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
    const arr1 = get(values, 'replaceArr1');
    const arr2 = get(values, 'replaceArr2');
    let removeList = concat(arr1, arr2);
    removeList = map(removeList, (str) => trim(str));
    remove(removeList);
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
        <Form name="replace" onFinish={onFinish} autoComplete="off">
          <Form.List name="replaceArr1">
            {() => (
              <>
                <Row justify="start">
                  <Col span={9}>
                    <Form.Item
                      name={[0, 'from']}
                      rules={[
                        { required: true, message: '输入需要修改的文字' },
                      ]}
                    >
                      <Input size="large" placeholder="输入需要修改的文字" />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <div className="text-center my-2">替换</div>
                  </Col>
                  <Col span={9}>
                    <Form.Item
                      name={[0, 'to']}
                      rules={[
                        { required: true, message: '输入需要修改的文字' },
                      ]}
                    >
                      <Input size="large" placeholder="输入需要修改的文字" />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
          <Form.List name="replaceArr2">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => {
                  return (
                    <Row key={key} justify="center">
                      <Col span={9}>
                        <Form.Item
                          {...restField}
                          name={[name, 'from']}
                          rules={[
                            { required: true, message: '输入需要修改的文字' },
                          ]}
                        >
                          <Input
                            size="large"
                            placeholder="输入需要修改的文字"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <div className="text-center my-2">替换</div>
                      </Col>
                      <Col span={9}>
                        <Form.Item
                          {...restField}
                          name={[name, 'to']}
                          rules={[
                            { required: true, message: '输入需要修改的文字' },
                          ]}
                        >
                          <Input
                            size="large"
                            placeholder="输入需要修改的文字"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <MinusCircleOutlined
                          className="m-3"
                          style={{ fontSize: '20px' }}
                          onClick={() => remove(name)}
                        />
                      </Col>
                    </Row>
                  );
                })}
                <Form.Item>
                  <div className="w-2/3 z-10 relative m-auto">
                    <Button
                      size="large"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      添加更多替换
                    </Button>
                  </div>
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
