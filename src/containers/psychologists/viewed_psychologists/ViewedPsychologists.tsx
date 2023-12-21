import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '../../../store/hooks';
import { PsychologistCard } from '../../../components/psychologists/psychologistCard/PsychologistCard';
import { Space, Typography } from 'antd';
import styles from '../../../components/psychologists/psychologistList/PsychologistsList.module.scss';
import fetchViewedPsychologists from '../../../api/apiHandlers/fetchViewedPsychologists';

const ViewedPsychologists = () => {
	const user = useAppSelector((state) => state.users.userInfo);

	const { data: viewedPsychologists } = useQuery({
		queryKey: ['GetViewedPsychologists'],
		queryFn: () => fetchViewedPsychologists({ user }),
	});

	return (
		<div className={styles.container}>
			{viewedPsychologists && viewedPsychologists.length > 0 ? (
				<>
					<Typography>Просмотренные ранее психологи</Typography>
					<Space
						style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap' }}
					>
						{viewedPsychologists.map((psychologist) => (
							<PsychologistCard
								psychologist={psychologist}
								key={psychologist.id}
							/>
						))}
					</Space>
				</>
			) : null}
		</div>
	);
};

export default ViewedPsychologists;