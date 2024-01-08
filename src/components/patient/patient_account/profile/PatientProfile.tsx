import { ChangeEvent, useState } from 'react';
import styles from './PatientProfile.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { IUserEdit } from '../../../../interfaces/IUserEdit';
import {
	updatePatientName,
	updateUser,
} from '../../../../features/user/userSlice';

function PatientProfile() {
	const [active, setActive] = useState(false);
	const goToEdit = () => {
		if (!active) {
			setActive(true);
		} else {
			setActive(false);
		}
	};
	const dispatch = useAppDispatch();
	const userInfo = useAppSelector((state) => state.users.userInfo);
	const [password, setPassword] = useState('');
	const [currentPasswordEdit, setCurrentPassword] = useState('');
	const [email, setEmail] = useState(userInfo?.email || '');
	const [phone, setPhone] = useState(userInfo?.phone || '');
	const [name, setName] = useState(userInfo?.patient?.name || '');
	const onChangeHandlerName = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};
	const onChangeHandlerMail = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};
	const onChangeHandlerPassword = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};
	const onChangeHandlerCurrentPassword = (e: ChangeEvent<HTMLInputElement>) => {
		setCurrentPassword(e.target.value);
	};
	const onChangeHandlerPhone = (e: ChangeEvent<HTMLInputElement>) => {
		setPhone(e.target.value);
	};

	const postChanges = async () => {
		const updatedUser: IUserEdit = {
			email,
			password,
			phone,
			name,
			сurrentPassword: currentPasswordEdit,
		};
		if (currentPasswordEdit != '') {
			await dispatch(updateUser(updatedUser));
			setActive(false);
		}
		if (name) {
			await dispatch(
				updatePatientName({ name, userId: userInfo?.patient?.id })
			);
		}
	};
	console.log(userInfo);

	return (
		<div className={styles.edit_container}>
			{active ? (
				<>
					<div className={styles.btn_flex}>
						<button onClick={postChanges} className={styles.btn_confirm}>
							Применить
						</button>
						<button onClick={goToEdit} className={styles.btn_cancel}>
							Отменить изменения
						</button>
					</div>

					<div className={styles.input_container}>
						<div className={styles.input_block_top}>
							<label>ФИО</label>
							<input onChange={onChangeHandlerName} type="text" value={name} />
						</div>
						<div className={styles.input_block_top}>
							<label>Телефон</label>
							<input
								onChange={onChangeHandlerPhone}
								type="text"
								value={phone}
							/>
						</div>
					</div>
					<div className={styles.input_container}>
						<div className={styles.input_block_small}>
							<label>Почта</label>
							<input onChange={onChangeHandlerMail} type="text" value={email} />
						</div>
						<div className={styles.flex_input}>
							<div className={styles.input_block_small}>
								<label>Текущий пароль</label>
								<input
									onChange={onChangeHandlerCurrentPassword}
									value={currentPasswordEdit}
									type="text"
								/>
							</div>
							<div className={styles.input_block_small}>
								<label>Новый пароль</label>
								<input
									onChange={onChangeHandlerPassword}
									value={password}
									type="text"
								/>
							</div>
						</div>
					</div>
				</>
			) : (
				<>
					<button onClick={goToEdit} className={styles.btn_edit}>
						Редактировать
					</button>
					<div className={styles.input_container}>
						<div className={styles.input_block_top}>
							{' '}
							<label>ФИО</label>
							<input type="text" disabled value={name} />
						</div>
						<div className={styles.input_block_top}>
							<label>Телефон</label>
							<input type="text" disabled value={phone} />
						</div>
					</div>
					<div className={styles.input_container}>
						<div className={styles.input_block_small}>
							<label>Почта</label>
							<input type="text" disabled value={email} />
						</div>
						<div className={styles.flex_input}>
							<div className={styles.input_block_small}>
								<label>Текущий пароль</label>
								<input disabled type="text" value={currentPasswordEdit} />
							</div>
							<div className={styles.input_block_small}>
								<label>Новый пароль</label>
								<input disabled type="text" value={password} />
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
export default PatientProfile;
