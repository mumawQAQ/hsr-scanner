import { useParams } from 'react-router-dom';

const RelicRuleCreate = () => {
  const { templateName, templateDescription, author } = useParams();
  return (
    <div>
      <h1>{`Create template with name: ${templateName} and description: ${templateDescription} and author is :${author}`}</h1>
    </div>
  );
};

export default RelicRuleCreate;
