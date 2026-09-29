import { Card, Typography, Flex, Tag } from "antd";
import { StarFilled, ArrowRightOutlined } from "@ant-design/icons";

const { Title, Text, Link } = Typography;

export const MotorcycleCard = ({ title, image, engineCapacity, power, rating, reviewsCount }: any) => {
  return (
    <Card
      hoverable
      cover={<img alt={title} src={image} style={{ height: 220, objectFit: 'cover' }} />}
    >
      <Flex vertical gap="middle">
        <Title level={5} style={{ margin: 0 }}>
          {title}
        </Title>

        <Flex gap="small">
          <Tag variant="solid">{engineCapacity}</Tag>
          <Tag variant="solid">{power}</Tag>
        </Flex>

        <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
          <Flex gap="small" align="center">
            <StarFilled style={{ color: 'var(--enduro-color-primary)' }} />
            <Text strong style={{ color: 'var(--enduro-color-primary)' }}>{rating}</Text>
            <Text type="secondary">{reviewsCount} отзыва</Text>
          </Flex>
          <Link href="#" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            Читать <ArrowRightOutlined />
          </Link>
        </Flex>
      </Flex>
    </Card>
  );
};