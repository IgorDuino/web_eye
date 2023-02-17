import { Link } from 'react-router-dom';
import { SOURCES_ROUTE } from '../../utils/constants';
import styles from './SourceCard.module.scss'
import cn from 'classnames'

const SourceCard = ({id=1, state='normal', name='ВУЗ', rating=4.78, i=0}) => {
  return (
    <div className={styles.container}>
      <span className={styles.position}>{i + 1}.</span>
      <span className={styles.name}>
        <Link to={SOURCES_ROUTE + '/' + id}>{name}</Link>
      </span>
      <span className={cn(styles.vr, styles.first_vr)}/>
      <span 
        className={cn(styles.state, styles[state.toLowerCase()])}
      >{state}</span>
      <span className={styles.vr}></span>
      <span className={styles.rating}>{rating}</span>
    </div>
  );
};

export default SourceCard;