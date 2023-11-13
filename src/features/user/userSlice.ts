import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../api/axiosInstance';
import { IUser } from '../../interfaces/IUser';
import { AxiosError, isAxiosError } from 'axios';

type AuthUserData = {
	email: string;
	phone: string;
	password: string;
};

type UserResponseError = {
	message: string;
};
type UserResponseValidateError = {
	message: string;
	errors: { type: string; messages: string[] }[];
};

export const registerUser = createAsyncThunk<
	IUser,
	AuthUserData,
	{ rejectValue: UserResponseError | UserResponseValidateError }
>('auth/register', async (userData: AuthUserData, { rejectWithValue }) => {
	try {
		const response = await axiosInstance.post('/auth/register', userData);
		return response.data;
	} catch (err) {
		if (isAxiosError(err)) {
			const error: AxiosError<UserResponseError> = err;
			return rejectWithValue(
				error.response?.data || { message: 'An error occurred' }
			);
		}
		throw err;
	}
});

export const loginUser = createAsyncThunk<
	IUser,
	AuthUserData,
	{ rejectValue: string }
>('auth.login', async (userData, { rejectWithValue }) => {
	try {
		const response = await axiosInstance.post('auth/sessions', userData);
		return response.data;
	} catch (err) {
		if (isAxiosError(err)) {
			const error: AxiosError<UserResponseError> = err;
			return rejectWithValue(
				error.response?.data.message || 'Internet connection error'
			);
		}
		throw err;
	}
});

interface UserState {
	userInfo: IUser | null;
	loading: boolean;
	registerError: null | UserResponseValidateError;
	loginError: null | string;
	logged: boolean;
}

const initialState: UserState = {
	userInfo: null,
	registerError: null,
	loginError: null,
	loading: false,
	logged: false,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},

	extraReducers(builder) {
		builder
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
				state.registerError = null;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.userInfo = { ...action.payload };
				state.loading = false;
				state.registerError = null;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false;
				if (Array.isArray(action.payload)) {
					state.registerError = {
						message: 'Validation error occurred',
						errors: action.payload as { type: string; messages: string[] }[],
					};
				} else {
					state.registerError = {
						message: action.payload?.message ?? 'Error occurred',
						errors: [], // You might want to provide some default value for errors array
					};
				}
			})

			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.loginError = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false;
				state.loginError = null;
				state.logged = true;
				state.userInfo = action.payload;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.logged = false;
				state.loginError = action.payload || null;
			});
	},
});

export default userSlice;