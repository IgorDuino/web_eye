import cn from 'classnames';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import SocialNetworksCard from '../../components/SocialNetworksCard/SocialNetworksCard';
import StateChart from '../../components/StateChart/StateChart';
import SubscriptionCard from '../../components/SubscriptionCard/SubscriptionCard';
import Button from '../../components/UI/Button/Button';
import UsersReviewsCard from '../../components/UsersReviewsCard/UsersReviewsCard';
import { useGetSourceQuery } from '../../services/apiService/apiService';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import styles from './SourcePage.module.scss';

const SourcePage = () => {
  const params = useParams()
  const uuid = params.uuid ?? ''
  const [timeDelta, setTimeDelta] = useState(2)
  const [maxCount, setMaxCount] = useState(7)
  
  const {data: source, isLoading: isSourceLoading} = useGetSourceQuery(uuid)
  
  if (isSourceLoading) {
    return null;
  }

  if (!source) {
    return <NotFoundPage/>
  }

  function summaryClickHandler() {
    window.open(`${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/resources/${uuid}/stats/export`, '_blank')
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1 
          className={
            cn("page_title", styles.status, styles[source.status.toLowerCase()])
          }
        >
          {uuid ? source.name : 'Ресурс'}
        </h1>
        <span className={styles.rating}>{source.rating}</span>
        <Button btnType='turquoise' onClick={summaryClickHandler}>
          <span className={styles.download_btn}>Получить отчёт</span>
        </Button>
      </div>
      <a 
        href={source.url ?? '#'}
        rel="noreferrer"
        target='_blank'
        className={styles.to_site}
      >
        <u>Посмотреть сайт</u>
      </a>
      <StateChart 
        sourceUuid={source.uuid}
        max_count={maxCount}
        timedelta={12 ** (timeDelta - 2) * 3600}
      />
      <div className={styles.inputs}>
        <div className={styles.col}>
          <span>Временной промежуток</span>
          <input 
            type="range" 
            name="timedelta" 
            min={1}
            defaultValue={timeDelta}
            onChange={(event) => setTimeDelta(+event.target.value)}
            max={4}
          />
        </div>
        <div className={styles.col}>
          <span>Количетсво промежутков</span>
          <input 
            type="range" 
            name="maxCount"
            onChange={(event) => setMaxCount(+event.target.value)}
            defaultValue={maxCount}
            min={2}
            max={7}
          />
        </div>
      </div>
      <div className={styles.cards}>
        <ReviewCard sourceUuid={source.uuid}/>
        <UsersReviewsCard sourceUuid={source.uuid}/>
        <SocialNetworksCard sourceUuid={source.uuid}/>
        <SubscriptionCard sourceUuid={source.uuid}/>
      </div>
    </div>
  );
};

export default SourcePage;