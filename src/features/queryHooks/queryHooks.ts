import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { ITechnique } from '../../interfaces/ITechnique';
import { ITherapyMethod } from '../../interfaces/ITherapyMethod';
import { ISymptom } from '../../interfaces/ISymptom';
import { ICity } from '../../interfaces/IPsychologistForm';
import {
	IPsychologist,
	IPsychologistWithLikes,
} from '../../interfaces/IPsychologist';
import { ITimeSlot, ITimeSlotDate } from '../../interfaces/ITimeSlot';
import { IPatient } from '../../interfaces/IPatient';
import { IUser } from '../../interfaces/IUser';
import { message } from 'antd';
import { NavigateFunction } from 'react-router-dom';
import { IRecordPost } from '../../interfaces/IRecordpost';
import IFilteringValues from '../../interfaces/IFilteringValues';
import fetchViewedPsychologists from '../../api/apiHandlers/fetchViewedPsychologists';

export const useTechniqueQuery = () => {
	return useQuery({
		queryFn: () => {
			return axiosInstance.get<ITechnique[]>('techniques');
		},
		queryKey: ['GetTechniques'],
	});
};
export const useTherapyMethodQuery = () => {
	return useQuery({
		queryFn: () => {
			return axiosInstance.get<ITherapyMethod[]>(`methods`);
		},
		queryKey: ['GetTherapyMethod'],
	});
};
export const useSymptomQuery = () => {
	return useQuery({
		queryFn: () => {
			return axiosInstance.get<ISymptom[]>(`symptoms`);
		},
		queryKey: ['GetSymptoms'],
	});
};
export const useCityQuery = () => {
	return useQuery({
		queryFn: () => {
			return axiosInstance.get<ICity[]>(`cities`);
		},
		queryKey: ['GetCities'],
	});
};
export const usePostPsychologist = () => {
	return useMutation({
		mutationFn: async (data: FormData) => {
			return await axiosInstance.post('psychologists/create', data);
		},
	});
};

export const useViewedPsychologists = (user: IUser | null) => {
	return useQuery({
		queryKey: ['GetViewedPsychologists'],
		queryFn: () => fetchViewedPsychologists({ user }),
	});
};

export const useGetPsychologist = (id: string) => {
	return useQuery({
		queryFn: () => {
			return axiosInstance.get<IPsychologist>(`/psychologists/${id}`);
		},
		queryKey: ['GetPsychologist'],
	});
};

export const useGetPsychologists = (filterValues: IFilteringValues | null) => {
	return useQuery({
		queryFn: async () => {
			const { data } = await axiosInstance.post<IPsychologistWithLikes[]>(
				`/psychologists/filter`,
				filterValues
			);
			return data;
		},
		queryKey: ['GetPsychologists', filterValues],
		enabled: !!filterValues,
	});
};

export const useAddNewTimes = (
	setIsError: React.Dispatch<React.SetStateAction<boolean>>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: ITimeSlotDate) => {
			return axiosInstance.post<ITimeSlot>('/appointments', data);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['reposData'] });
		},
		onError: () => {
			setIsError(true);
			setTimeout(() => {
				setIsError(false);
			}, 3000);
		},
	});
};

export const useGoToRecord = (
	navigate: NavigateFunction,
	setLoading: (value: React.SetStateAction<boolean>) => void
) => {
	return useMutation({
		mutationFn: (data: IRecordPost) => {
			return axiosInstance.post('/records/create', data);
		},
		onSuccess: () => {
			message.success('Вы успешно записались на прием к психологу!');
			navigate('/my-account/patient/');
			setLoading(false);
		},
	});
};

export const useAddingTimeForm = (active: boolean, date: string) => {
	return useQuery<ITimeSlot[]>({
		queryKey: ['reposData'],
		enabled: active,
		queryFn: async () => {
			const response = await axiosInstance.get(`/appointments?date=${date}`);

			return response.data;
		},
	});
};

export const useDeleteTime = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => {
			return axiosInstance.delete(`/appointments/${id}`);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['reposData'] });
		},
	});
};

export const useGetFavourites = (authUser: IUser | null) => {
	return useQuery({
		queryFn: async () => {
			const { data } = await axiosInstance.get<IPatient>(
				`/patients/${authUser?.patient?.id ?? 0}`
			);
			return data;
		},
		queryKey: ['GetFavourites'],
		enabled: !!(authUser && authUser.patient),
	});
};

export const useSwitchFavourite = () => {
	return useMutation({
		mutationFn: async (psychologistId: number) => {
			const data = { psychologistId };
			return await axiosInstance.post(`patients/favorites`, data);
		},
	});
};

export const useSaveVievedPsychologist = (
	psychologist: IPsychologistWithLikes
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (psychologistId: number) => {
			const response = await axiosInstance.post(
				`patients/viewedPsychologists/${psychologistId}`,
				psychologist
			);

			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['GetViewedPsychologists'] });
		},
	});
};