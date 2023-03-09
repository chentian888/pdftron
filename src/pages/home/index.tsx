import { Button, Modal } from 'antd';
import {
  useNavigate,
  useModel,
  Link,
  FormattedMessage,
  useIntl,
} from '@umijs/max';
import Header from '@/components/Header';
import AppStore from '@/components/AppStore';

type TabType = { name: string; value: string };

const Home: React.FC = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const { tab, setTab } = useModel('global');

  const tabs: TabType[] = [
    { name: intl.formatMessage({ id: 'toPdf' }), value: '1' },
    { name: intl.formatMessage({ id: 'pdfTo' }), value: '2' },
    { name: intl.formatMessage({ id: 'pdf' }), value: '3' },
  ];

  const tabChange = (item: TabType) => {
    setTab(item.value);
  };

  const renderTabs = () => {
    return tabs.map((ele, index) => {
      return (
        <div
          className={`w-1/3 flex justify-center items-center rounded-full cursor-pointer  ${
            tab === ele.value ? 'bg-[#7f66fa] text-white' : ''
          }`}
          key={index}
          onClick={() => tabChange(ele)}
        >
          {ele.name}
        </div>
      );
    });
  };

  const handleClick = (ele: HomeItemType) => {
    if (ele.to) {
      navigate(ele.to);
    } else {
      Modal.info({
        title: '功能提示',
        content: '可在PDF在线编辑中使用该功能',
        okText: '知道了',
      });
    }
  };
  const renderTabContent = () => {
    const items1 = [
      {
        title: intl.formatMessage({ id: 'word2pdf' }),
        desc: intl.formatMessage({ id: 'word2pdfDesc' }),
        icon: 'icon-word',
        className: '',
        to: '/convertFrom/word',
      },
      {
        title: intl.formatMessage({ id: 'ppt2pdf' }),
        desc: intl.formatMessage({ id: 'ppt2pdfDesc' }),
        icon: 'icon-ppt',
        className: 'justify-self-center',
        to: '/convertFrom/ppt',
      },
      {
        title: intl.formatMessage({ id: 'excel2pdf' }),
        desc: intl.formatMessage({ id: 'excel2pdfDesc' }),
        icon: 'icon-excel',
        className: 'justify-self-end',
        to: '/convertFrom/excel',
      },
      {
        title: intl.formatMessage({ id: 'img2pdf' }),
        desc: intl.formatMessage({ id: 'img2pdfDesc' }),
        icon: 'icon-image',
        className: '',
        to: '/convertFrom/image',
      },
    ];

    const items2 = [
      {
        title: intl.formatMessage({ id: 'pdf2word' }),
        desc: intl.formatMessage({ id: 'pdf2word' }),
        icon: 'icon-word',
        className: '',
        to: '/convertTo/office/word',
      },
      {
        title: intl.formatMessage({ id: 'pdf2ppt' }),
        desc: intl.formatMessage({ id: 'pdf2ppt' }),
        icon: 'icon-ppt',
        className: 'justify-self-center',
        to: '/convertTo/office/ppt',
      },
      {
        title: intl.formatMessage({ id: 'pdf2excel' }),
        desc: intl.formatMessage({ id: 'pdf2excelDesc' }),
        icon: 'icon-excel',
        className: 'justify-self-end',
        to: '/convertTo/office/excel',
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
        title: intl.formatMessage({ id: 'pdf2img' }),
        desc: intl.formatMessage({ id: 'pdf2imgDesc' }),
        icon: 'icon-image',
        className: '',
        to: '/convertTo/image',
      },
      // {
      //   title: 'PDF转PDF/A(免费)',
      //   desc: 'PDF转PDF/A',
      //   icon: 'icon-pdfa',
      //   className: 'justify-self-center',
      //   to: '/convertTo/pdfa',
      // },
    ];

    const items3 = [
      {
        title: intl.formatMessage({ id: 'pdfMerge' }),
        desc: intl.formatMessage({ id: 'pdfMergeDesc' }),
        icon: 'icon-merge',
        className: '',
        to: '/page/merge',
      },
      {
        title: intl.formatMessage({ id: 'pdfExtract' }),
        desc: intl.formatMessage({ id: 'pdfExtractDesc' }),
        icon: 'icon-split1',
        className: 'justify-self-center',
        to: '/page/extract',
      },
      {
        title: intl.formatMessage({ id: 'pdfSplit' }),
        desc: intl.formatMessage({ id: 'pdfSplitDesc' }),
        icon: 'icon-split2',
        className: 'justify-self-end',
        to: '/page/split',
      },
      {
        title: intl.formatMessage({ id: 'pdfCrop' }),
        desc: intl.formatMessage({ id: 'pdfCropDesc' }),
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
      // {
      //   title: 'PDF替换文字',
      //   desc: 'PDF替换文字',
      //   icon: 'icon-text',
      //   className: 'justify-self-center',
      // },
      // {
      //   title: 'PDF替换图片',
      //   desc: 'PDF替换图片',
      //   icon: 'icon-txt',
      //   className: 'justify-self-end',
      // },
      {
        title: intl.formatMessage({ id: 'pdfText' }),
        desc: intl.formatMessage({ id: 'pdfTextDesc' }),
        icon: 'icon-extra-text',
        className: 'justify-self-center',
        to: '/extraction/text',
      },
      // {
      //   title: 'PDF提取图片',
      //   desc: '提取PDF中的所有小图片',
      //   icon: 'icon-extra-image',
      //   className: 'justify-self-center',
      //   // to: '/extraction/image',
      //   to: '/forbid',
      // },
      // {
      //   title: 'PDF删除文字(免费)',
      //   desc: '删除PDF中已选择的文字',
      //   icon: 'icon-remove-text',
      //   className: 'justify-self-end',
      //   to: '/content/removetext',
      // },
      // {
      //   title: 'PDF删除图片(免费)',
      //   desc: '删除PDF中已选择的图片数据',
      //   icon: 'icon-remove-image',
      //   className: '',
      //   to: '/content/removeimage',
      // },
      // {
      //   title: 'PDF压缩(免费)',
      //   desc: 'PDF压缩',
      //   icon: 'icon-compress',
      //   className: 'justify-self-center',
      //   to: '/compress',
      // },
      // {
      //   title: 'PDF加密解密(免费)',
      //   desc: 'PDF加密解密',
      //   icon: 'icon-lock',
      //   className: 'justify-self-end',
      //   to: '/security',
      // },
    ];

    let cols: HomeItemType[] = items1;
    if (tab === '1') {
      cols = items1;
    } else if (tab === '2') {
      cols = items2;
    } else if (tab === '3') {
      cols = items3;
    }

    return cols.map((ele, index) => {
      return (
        <div className={`mb-16 ${ele.className} cursor-pointer`} key={index}>
          <div className="no-underline" onClick={() => handleClick(ele)}>
            <img
              className="w-[140px] block max-w-full m-auto"
              src={require(`./img/${ele.icon}.png`)}
              alt=""
            />
            <div className="text-black text-lg py-4 text-center">
              {ele.title}
            </div>
            <div className="w-[190px] text-gray-400 text-center leading-6">
              {ele.desc}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="page" style={{ background: '#f1f3f8' }}>
      <Header />
      {/* <div className="flex justify-center">
        <img
          className="block max-w-full"
          src={require('./img/banner.png')}
          alt=""
        />
      </div> */}
      <div className="w-1200 m-auto rounded-3xl bg-white p-16 z-10 relative">
        <img
          className="max-w-full m-auto block"
          src={require('./img/feature.png')}
          alt=""
        />
        <div className="bg-[#EBF0FE] w-[860px] h-[255px] m-auto mt-20 mb-4 p-12 flex justify-between items-center rounded-lg ">
          <div className="w-1/2">
            <div className="text-4xl pb-4">
              <FormattedMessage id="welcome" />
            </div>
            <div className="text-gray-400 pb-7 leading-6">
              <FormattedMessage id="welcomeDesc" />
            </div>
            <a href="/editor">
              <Button size="large" type="primary">
                <FormattedMessage id="edit" />
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
      <AppStore />
      <div
        className="h-[763px] flex justify-center items-center relative"
        style={{ backgroundImage: `url(${require('./img/bg-footer.png')})` }}
      >
        {/* <div className="w-[180px] h-[180px] rounded-lg bg-white"></div> */}
        <div className="h-[60px] text-gray-300  bg-[#725697] bg-opacity-50  absolute left-0 bottom-0 w-full flex justify-center items-center">
          <span className="px-4 text-white">
            <FormattedMessage id="company" />
          </span>
          <span className="px-4 text-white">
            <FormattedMessage id="icp" />
          </span>
          <Link
            className="px-4 no-underline text-white"
            to="mailto:912786297@qq.com"
          >
            <FormattedMessage id="concat" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
