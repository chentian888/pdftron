import { Button } from 'antd';
const Home: React.FC = () => {
  return (
    <div className="page" style={{ background: '#f1f3f8' }}>
      <div className="w-1200 m-auto">
        <img
          className=" block max-w-full"
          src={require('./img/banner.png')}
          alt=""
        />
      </div>
      <div className=" w-1200 m-auto rounded-3xl bg-white p-16">
        <img
          className=" max-w-full m-auto block"
          src={require('./img/feature.png')}
          alt=""
        />
        <div className="bg-[#EBF0FE] w-[860px] h-[255px] m-auto mt-20 mb-4 p-12 flex justify-between items-center rounded-lg ">
          <div>
            <div className="text-4xl pb-4">欢迎您，尊敬的用户</div>
            <div className=" text-gray-400 pb-7">
              万能PDF编辑专注PDF在线编辑服务，为你提供最便捷 的操作方案与服务！
            </div>
            <Button size="large" type="primary">
              PDF在线编辑
            </Button>
          </div>
          <img
            className="block max-w-full"
            src={require('./img/icon-welcome.png')}
            alt=""
          />
        </div>
        <div className="w-[860px] m-auto">
          <div className="h-[50px] flex justify-between rounded-full bg-[#EBF0FE]">
            <div className="w-1/3 flex justify-center items-center rounded-full cursor-pointer">
              转换为PDF
            </div>
            <div className="w-1/3 flex justify-center items-center rounded-full cursor-pointer">
              PDF转其他
            </div>
            <div className="w-1/3 flex justify-center items-center rounded-full cursor-pointer">
              PDF功能层
            </div>
          </div>
          <div className="grid grid-cols-3 justify-items-start pt-10">
            <div className="w-1/3 mb-16 cursor-pointer">
              <img
                className="block max-w-full m-auto"
                src={require('./img/icon-word.png')}
                alt=""
              />
              <div className=" text-lg py-4 text-center">Word转PDF</div>
              <div className=" text-gray-400 text-center leading-6">
                word(.doc.docx). 转pdf
              </div>
            </div>
            <div className="w-1/3 mb-16 justify-self-center cursor-pointer">
              <img
                className="block max-w-full m-auto"
                src={require('./img/icon-ppt.png')}
                alt=""
              />
              <div className=" text-lg py-4 text-center">PPT转PDF</div>
              <div className=" text-gray-400 text-center leading-6">
                ppt(.ppt.pptx) 转pdf
              </div>
            </div>
            <div className="w-1/3 mb-16 justify-self-end cursor-pointer">
              <img
                className="block max-w-full m-auto"
                src={require('./img/icon-excel.png')}
                alt=""
              />
              <div className=" text-lg py-4 text-center">Excel转PDF</div>
              <div className=" text-gray-400 text-center leading-6">
                excel(.xls.xlsx)转pdf
              </div>
            </div>
            <div className="w-1/3 mb-16 cursor-pointer">
              <img
                className="block max-w-full m-auto"
                src={require('./img/icon-txt.png')}
                alt=""
              />
              <div className="text-lg py-4 text-center">TXT转PDF</div>
              <div className="text-gray-400 text-center leading-6">
                txt转PDF
              </div>
            </div>
            <div className="w-1/3 mb-16 justify-self-center cursor-pointer">
              <img
                className="block max-w-full m-auto"
                src={require('./img/icon-image.png')}
                alt=""
              />
              <div className=" text-lg py-4 text-center">图片转pdf</div>
              <div className=" text-gray-400 text-center leading-6">
                图片(.png.jpg)转pdf
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[1000px] h-[400px] bg-white m-auto my-10 rounded-2xl"></div>
    </div>
  );
};

export default Home;
