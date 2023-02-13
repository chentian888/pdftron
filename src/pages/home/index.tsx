import { Button } from 'antd';
import { Link, useModel } from '@umijs/max';
import Header from '@/components/Header';

type TabType = { name: string; value: string };

const Home: React.FC = () => {
  const { tab, setTab } = useModel('global');

  const tabs: TabType[] = [
    { name: '转换为PDF', value: '1' },
    { name: 'PDF转其他', value: '2' },
    { name: 'PDF功能层', value: '3' },
  ];

  const tabChange = (item: TabType) => {
    setTab(item.value);
  };

  const renderTabs = () => {
    return tabs.map((ele, index) => {
      return (
        <div
          className={`w-1/3 flex justify-center items-center rounded-full cursor-pointer  ${
            tab === ele.value ? 'bg-[#6672FB] text-white' : ''
          }`}
          key={index}
          onClick={() => tabChange(ele)}
        >
          {ele.name}
        </div>
      );
    });
  };

  const renderTabContent = () => {
    const items1 = [
      {
        title: 'Word转PDF',
        desc: 'Word(.doc.docx)转PDF',
        icon: 'icon-word',
        className: '',
        to: '/convertFrom/word',
      },
      {
        title: 'PPT转PDF',
        desc: 'PPT(.ppt.pptx)转PDF',
        icon: 'icon-ppt',
        className: 'justify-self-center',
        to: '/convertFrom/ppt',
      },
      {
        title: 'Excel转PDF',
        desc: 'Excel(.xls.xlsx)转PDF',
        icon: 'icon-excel',
        className: 'justify-self-end',
        to: '/convertFrom/excel',
      },
      // {
      //   title: 'Txt转PDF',
      //   desc: 'Txt转PDF',
      //   icon: 'icon-txt',
      //   className: '',
      //   to: '/convertFrom/txt',
      // },
      {
        title: '图片转PDF',
        desc: '图片(.png.jpg)转PDF',
        icon: 'icon-image',
        className: '',
        to: '/convertFrom/image',
      },
    ];

    const items2 = [
      {
        title: 'PDF转Word',
        desc: 'PDF转Word',
        icon: 'icon-word',
        className: '',
        to: '/convertTo/word',
      },
      {
        title: 'PDF转PPT',
        desc: 'PDF转PPT',
        icon: 'icon-ppt',
        className: 'justify-self-center',
        to: '/convertTo/ppt',
      },
      {
        title: 'PDF转Excel',
        desc: 'PDF转Excel',
        icon: 'icon-excel',
        className: 'justify-self-end',
        to: '/convertTo/excel',
      },
      // {
      //   title: 'PDF转Xps',
      //   desc: 'PDF转Xps',
      //   icon: 'icon-xps',
      //   className: '',
      //   to: '/convertTo/xps',
      // },
      // {
      //   title: 'PDF转Epud',
      //   desc: 'PDF转Epud',
      //   icon: 'icon-epud',
      //   className: 'justify-self-center',
      //   to: '/convertTo/epud',
      // },
      {
        title: 'PDF转图片',
        desc: 'PDF转图片（jpeg,png）',
        icon: 'icon-image',
        className: '',
        to: '/convertTo/image',
      },
      {
        title: 'PDF转PDF/A',
        desc: 'PDF转PDF/A',
        icon: 'icon-pdfa',
        className: 'justify-self-center',
        to: '/convertTo/pdfa',
      },
    ];

    const items3 = [
      {
        title: 'PDF合并',
        desc: '选择多个PDF文档文件进行合并操作',
        icon: 'icon-merge',
        className: '',
        to: '/page/merge',
      },
      {
        title: 'PDF拆分1',
        desc: '选择PDF中的页面拆分成新的文档',
        icon: 'icon-split1',
        className: 'justify-self-center',
        to: '/page/extract',
      },
      {
        title: 'PDF拆分2',
        desc: '选择PDF中的页面拆分成多个单独PDF',
        icon: 'icon-split2',
        className: 'justify-self-end',
        to: '/page/split',
      },
      {
        title: 'PDF裁剪',
        desc: '将PDF拆分成两半再按正确顺序合并',
        icon: 'icon-crop',
        className: '',
        to: '/page/crop',
      },
      // {
      //   title: '新建PDF',
      //   desc: '新建PDF',
      //   icon: 'icon-create',
      //   className: '',
      //   to: '',
      // },
      {
        title: 'PDF替换文字',
        desc: 'PDF替换文字',
        icon: 'icon-text',
        className: 'justify-self-center',
        to: '/content/textreplace',
      },
      {
        title: 'PDF替换图片',
        desc: 'PDF替换图片',
        icon: 'icon-txt',
        className: 'justify-self-end',
        to: '/content/imagereplace',
      },
      {
        title: 'PDF提取文字',
        desc: 'PDF提取文字',
        icon: 'icon-extra-text',
        className: '',
        to: '/extraction/text',
      },
      {
        title: 'PDF提取图片',
        desc: '提取PDF中的所有小图片',
        icon: 'icon-extra-image',
        className: 'justify-self-center',
        to: '/extraction/image',
      },
      {
        title: 'PDF删除文字数据',
        desc: '删除PDF中已选择的文字',
        icon: 'icon-remove-text',
        className: 'justify-self-end',
        to: '/content/removetext',
      },
      {
        title: 'PDF删除图片数据',
        desc: '删除PDF中已选择的图片数据',
        icon: 'icon-remove-image',
        className: '',
        to: '/content/removeimage',
      },
      {
        title: 'PDF压缩',
        desc: 'PDF压缩',
        icon: 'icon-compress',
        className: 'justify-self-center',
        to: '/compress',
      },
      {
        title: 'PDF加密解密',
        desc: 'PDF加密解密',
        icon: 'icon-lock',
        className: 'justify-self-end',
        to: '/security',
      },
    ];

    let cols = items1;
    if (tab === '1') {
      cols = items1;
    } else if (tab === '2') {
      cols = items2;
    } else if (tab === '3') {
      cols = items3;
    }

    return cols.map((ele, index) => {
      return (
        <div className={`mb-16 ${ele.className}`} key={index}>
          <Link to={ele.to} className="no-underline">
            <img
              className="w-[140px] block max-w-full m-auto"
              src={require(`./img/${ele.icon}.png`)}
              alt=""
            />
            <div className="text-black text-lg py-4 text-center">
              {ele.title}
            </div>
            <div className="w-[140px] text-gray-400 text-center leading-6">
              {ele.desc}
            </div>
          </Link>
        </div>
      );
    });
  };

  return (
    <div className="page" style={{ background: '#f1f3f8' }}>
      <Header />
      <div className="flex justify-center">
        <img
          className="block max-w-full"
          src={require('./img/banner.png')}
          alt=""
        />
      </div>
      <div className="w-1200 m-auto rounded-3xl bg-white p-16 -mt-60 z-10 relative">
        <img
          className="max-w-full m-auto block"
          src={require('./img/feature.png')}
          alt=""
        />
        <div className="bg-[#EBF0FE] w-[860px] h-[255px] m-auto mt-20 mb-4 p-12 flex justify-between items-center rounded-lg ">
          <div className="w-1/2">
            <div className="text-4xl pb-4">欢迎您，尊敬的用户</div>
            <div className="text-gray-400 pb-7 leading-6">
              万能PDF编辑专注PDF在线编辑服务，为你提供最便捷 的操作方案与服务！
            </div>
            <a href="/editor">
              <Button size="large" type="primary">
                PDF在线编辑
              </Button>
            </a>
          </div>
          <img
            className="block max-w-full"
            src={require('./img/icon-welcome.png')}
            alt=""
          />
        </div>
        <div className="w-[860px] m-auto">
          <div className="h-[50px] flex justify-between rounded-full bg-[#EBF0FE]">
            {renderTabs()}
          </div>
          <div className="grid grid-cols-3 justify-items-start pt-10">
            {renderTabContent()}
          </div>
        </div>
      </div>
      <div className="w-[1000px] h-[400px] bg-white m-auto my-10 rounded-2xl"></div>
      <div
        className="h-[763px] flex justify-center items-center relative"
        style={{ backgroundImage: `url(${require('./img/bg-footer.png')})` }}
      >
        <div className="w-[180px] h-[180px] rounded-lg bg-white"></div>
        <div className="h-[60px] text-gray-300  bg-[#725697] bg-opacity-50  absolute left-0 bottom-0 w-full flex justify-center items-center">
          ©2018 Yubanmei. All rights reserved. Website by yubanmei@163.co
        </div>
      </div>
    </div>
  );
};

export default Home;
