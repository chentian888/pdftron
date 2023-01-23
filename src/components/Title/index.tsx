import { Helmet } from '@umijs/max';
interface TitleProps {
  title?: string;
}

const Title: React.FC<TitleProps> = (props) => {
  const { title } = props;
  return (
    <Helmet>
      <title>{title || 'PDF万能编辑器'}</title>
    </Helmet>
  );
};

export default Title;
