import { useGetAllReviewsQuery } from '../../services/apiService/apiService';
import Card from '../Card/Card';
import UserReviewBadge from '../UserReviewBadge/UserReviewBadge';
import styles from './UsersReviewsCard.module.scss';
import { UsersReviewsCardPropsType } from './UsersReviewsCardTypes';

const UsersReviewsCard = ({sourceUuid, ...props}: UsersReviewsCardPropsType) => {
  const {data: reviews, isLoading} = useGetAllReviewsQuery(sourceUuid)

  if (isLoading) {
    return null
  }

  return (
    <Card 
      title='Отзывы, которые пользователи оставили об этом ресурсе'
      description='Читайте, что думают об этом ресурсе другие люди'
      {...props}
    >
      <>
        {reviews?.length ?
        reviews.map(review => <UserReviewBadge key={review.uuid} {...review}/>) : <span className={styles.no_reviews}>Отзывов нет</span>}
      </>
    </Card>
  );
};

export default UsersReviewsCard;