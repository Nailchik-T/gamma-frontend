import React from 'react';
import { Card } from 'antd';
import { IPsychologist } from '../../interfaces/IPsychologist';
import { HeartOutlined } from '@ant-design/icons';
import psychologistsMock from '../../mocks/psychologists';
import styles from './PsychologistCard.module.scss';

const { Meta } = Card;

interface PsychologistCardProps {
	psychologist: IPsychologist;
}

export const PsychologistCard: React.FC<PsychologistCardProps> = ({
	psychologist,
}) => {
	const {
		fullName,
		education,
		description,
		photo,
		city,
		cost,
		experienceYears,
		format,
	} = psychologist;

	return (
		<Card
			className={styles.card}
			cover={
				<div className={styles.cover}>
					<span className={styles.heart}>
						<HeartOutlined />
					</span>

					<img
						alt={fullName}
						src={psychologistsMock.api.psychologists + photo}
						className={styles.img}
					/>
				</div>
			}
		>
			<Meta
				title={fullName}
				description={
					<>
						<p>{`Образование: ${education}`}</p>
						<p>{`Опыт: ${experienceYears} лет`}</p>
						<p>{`Формат: ${format}`}</p>
						<p>{`Стоимость: ${cost} тг`}</p>
						<p>{`Город: ${city.name}`}</p>
						<p>{`О себе: ${description}`}</p>
					</>
				}
			/>
		</Card>
	);
};
